const mongoose = require("mongoose");

// define advert schema
const advertSchema = mongoose.Schema(
  {
    // all properties are required
    item: { type: String, index: true, required: true }, // it will create and index to speed up search times
    selling: { type: Boolean, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true, unique: true }, // this field must be unique
    tags: { type: [String], required: true },
  },
  { versionKey: false }
);

// adds a custom static method to mongoose. This method returns a filtered list of adverts
advertSchema.statics.list = function (filters, start, limit, sort) {
  const query = Advert.find(filters);
  query.skip(start);
  query.limit(limit);
  query.sort(sort);
  return query.exec();
};

// create model
const Advert = mongoose.model("Advert", advertSchema, "adverts");

// export model
module.exports = Advert;
