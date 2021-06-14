const Notifications = require("../models/Notifications");
const User = require("../models/User");

const createNotification = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { username, userId, action, placeId } = req.body;
    const user = await User.findById(uid);
    console.log(placeId);
    const newNoti = await Notifications.create({
      username,
      userId,
      action,
      new: true,
      placeOwnerId: uid,
      date: new Date(),
      placeId,
    });
    user.notifications.push(newNoti);
    await user.save();
    res.status(200).json(newNoti);
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const notiOwnerId = req.params.uid;

    const updatedNotification = await Notifications.updateMany(
      { new: true, placeOwnerId: notiOwnerId },
      { $set: { new: false } }
    );
    const notis = await Notifications.find({ placeOwnerId: notiOwnerId });
    res.status(200).json(notis);
  } catch (err) {
    console.log(err);
  }
};

exports.createNotification = createNotification;
exports.updateNotification = updateNotification;
