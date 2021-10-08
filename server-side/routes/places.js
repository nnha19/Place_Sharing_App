const router = require("express").Router();
const placesController = require("../controllers/placesController");
const { check } = require("express-validator");
const authMiddleWare = require("../middlewares/auth-middleware");
const upload = require("../middlewares/multer-middleware");

router.get("/", placesController.getPlaces);
router.get("/user/:uid", placesController.getPlaceByUserId);
router.get("/:id", placesController.getPlaceById);

// router.use(authMiddleWare);

router.post(
  "/",
  upload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.createPlace
);

router.put(
  "/:id",
  upload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.updatePlace
);

router.delete("/:id", placesController.deletePlace);

module.exports = router;
