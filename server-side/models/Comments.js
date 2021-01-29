const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  username: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  text: String,
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Comments", commentsSchema);
