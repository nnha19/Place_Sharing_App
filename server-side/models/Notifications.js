const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  username: String,
  action: String,
  new: Boolean,
  placeOwnerId: String,
  date: { type: String, required: true },
  placeId: { type: String, requierd: true },
});

module.exports = mongoose.model("Notifications", notificationsSchema);
