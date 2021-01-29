const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  username: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Likes", likesSchema);
