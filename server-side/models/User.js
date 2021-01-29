const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notifications" },
  ],
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
});

module.exports = mongoose.model("User", userSchema);
