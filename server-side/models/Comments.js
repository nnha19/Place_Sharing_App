const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  username: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: String,
  date: { type: String, required: true },
});

module.exports = mongoose.model("Comments", commentsSchema);
