const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
  likes: [
    {
      username: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
      },
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  date: { type: Date, default: Date.now() },
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
});

module.exports = mongoose.model("Place", placeSchema);
