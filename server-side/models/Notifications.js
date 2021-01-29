const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  username: String,
  action: String,
  new: Boolean,
  placeOwnerId: String,
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Notifications", notificationsSchema);
