const router = require("express").Router({ mergeParams: true });
const ratingController = require("../controllers/ratingController");
const authMiddleWare = require("../middlewares/auth-middleware");

router.get("/", ratingController.getAllReviews);

router.use(authMiddleWare);

router.post("/", ratingController.createReview);
router.put("/:rid", ratingController.updateReview);
router.delete("/:rid", ratingController.deleteReview);

module.exports = router;
