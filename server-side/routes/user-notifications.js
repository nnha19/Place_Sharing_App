const router = require("express").Router({ mergeParams: true });
const notificationController = require("../controllers/notificationsController");

router.post("/", notificationController.createNotification);
router.put("/", notificationController.updateNotification);
module.exports = router;
