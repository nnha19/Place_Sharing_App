const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  author: {
    username: { type: String, require: true },
    userId: { type: String, require: true },
  },
  star: {
    type: String,
    require: true,
  },
  review: { type: String, require: true },
});

module.exports = mongoose.model("Rating", ratingSchema);
