var express = require("express");
// const createError = require("http-errors");
const mongoose = require("mongoose");
var router = express.Router();

const Advert = require("../../models/Advert");

// CRUD Create Read Update Delete

// returns a list of all adverts or adverts that fulfill the given queries
// GET /api/adverts
router.get("/adverts", async (req, res, next) => {
  try {
    // filters
    const tag = req.query.tag;
    const selling = req.query.selling;
    const item = req.query.item;
    const price = req.query.price;

    // pagination and sorting
    const start = req.query.start;
    const limit = req.query.limit;
    const sort = req.query.sort;

    const filters = {};

    if (tag) {
      filters.tags = tag;
    }

    if (selling) {
      filters.selling = selling;
    }

    if (item) {
      filters.item = new RegExp("^" + item, "i");
    }

    if (price) {
      let filteredPrice;

      /* Using regex
        /^\d+-$/.test(price) Number followed by a hyphen

        /^-\d+$/.test(price) Hyphen followed by a number

        /^\d+-\d+/.test(price) Number followed by a hyphen and then another number
      */

      // in order to know which of the four possible options it got, this code block checks if the value has a hyphen, and if so, where it is located
      if (!price.includes("-")) {
        filteredPrice = price;
      } else if (price.endsWith("-")) {
        filteredPrice = { $gte: price.split("-")[0] };
      } else if (price.startsWith("-")) {
        filteredPrice = { $lte: price.split("-")[1] };
      } else {
        filteredPrice = {
          $gte: price.split("-")[0],
          $lte: price.split("-")[1],
        };
      }

      filters.price = filteredPrice;
    }

    const adverts = await Advert.list(filters, start, limit, sort);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ results: adverts }, null, 3)); // format for better visualization
    //res.json({ results: adverts });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// update an existing advert
// PUT /api/adverts/:id (body=advertData)
router.put("/adverts/:id", async (req, res, next) => {
  try {
    // this function will update the indexes before saving a new advert to prevent photo duplicates
    await mongoose.connection.syncIndexes();
  } catch (err) {
    err.status = 500;
    next(err);
  }

  try {
    const id = req.params.id;
    const advertData = req.body;

    const advertUpdate = await Advert.findOneAndUpdate(
      { _id: id },
      advertData,
      {
        new: true, // returns the updated advert
      }
    );

    res.json({ result: advertUpdate });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// create an advert
// POST /api/adverts (body=advertData)
router.post("/adverts", async (req, res, next) => {
  try {
    // this function will update the indexes before saving a new advert to prevent photo duplicates
    await mongoose.connection.syncIndexes();
  } catch (err) {
    err.status = 500;
    next(err);
  }

  try {
    const advertData = req.body;

    // instantiate a new advert to memory
    const advert = new Advert(advertData);

    // saves the object to the database if it's valid
    try {
      const savedAdvert = await advert.save();
      res.json({ result: savedAdvert }, 201);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// delete an advert
// DELETE /api/adverts/:id
router.delete("/adverts/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    // checks if the id exists
    const advertExists = await Advert.exists({ _id: id });
    if (!advertExists) {
      throw new Error();
    }

    try {
      // deletes the element with the given id
      await Advert.deleteOne({ _id: id });

      res.json({ status: "Advert deleted successfully" });
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } catch (err) {
    err.name = "Advert does not exist";
    err.status = 400;
    err.message = "The given id does not exist in the database";
    next(err);
  }
});

// list of all available tags
// GET /api/tags
router.get("/tags", function (req, res, next) {
  Advert.distinct("tags", function (err, tags) {
    res.send({availableTags: tags});
  });
});

module.exports = router;
