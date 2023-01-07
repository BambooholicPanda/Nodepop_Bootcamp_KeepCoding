const readline = require("readline");

// load models
const Advert = require("./models/Advert");

// import the json file
const jsonFile = require("./adverts.json");
//const { json } = require("express");

async function main() {
  // ask for confirmation
  const accepted = await yesNoQuestion(
    "Are you sure that you want to overwrite the database? Keep in mind that previous data will be deleted. [y/n]"
  );
  if (!accepted) {
    process.exit();
  }

  // connect database
  const connection = require("./lib/connectMongoose");

  // initialize advert collection
  await initAdverts();

  // disconnect database
  connection.close();
}

main().catch((err) => console.log("An error ocurred", err));

async function initAdverts() {
  // delete all previous adverts
  const result = await Advert.deleteMany();
  console.log(`${result.deletedCount} adverts deleted.`);

  // create initial adverts
  //const advertsObj = JSON.parse(jsonFile);
  const inserted = await Advert.insertMany(jsonFile.adverts);
  console.log(`${inserted.length} adverts created.`);
}

function yesNoQuestion(text) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    interface.question(text, (answer) => {
      interface.close();
      if (answer.toLowerCase() === "y") {
        resolve(true);
        return;
      }
      resolve(false);
    });
  });
}
