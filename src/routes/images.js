var express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

var router = express.Router();

// this code is not necessary because the files in the public folder are already accesible by default
// GET /images/image.jpg
/*router.get("/:fileName", function (req, res, next) {
  try {
    const image = req.params.fileName;
    const imagePath = path.join(__dirname, `../public/images/${image}`);
    res.sendFile(imagePath);
  } catch (err) {
    next(err);
  }
});*/

// POST /images/upload/
router.post("/upload", function (req, res, next) {
  try {
    if (!req.body.url) {
      throw new Error();
    }
    // if no filename is given, it will be taken from the url
    if (!req.body.fileName) {
      req.body.fileName = req.body.url.split("/").at(-1).toLowerCase();
    }

    const imageUrl = req.body.url;
    const fileName = req.body.fileName;
    const imagePath = path.join(__dirname, `../public/images/${fileName}`);

    axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
    }).then((response) => {
      response.data.pipe(fs.createWriteStream(imagePath));
      res.send({ status: "Image successfully uploaded" });
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
