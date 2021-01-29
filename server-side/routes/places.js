const router = require("express").Router();
const placesController = require("../controllers/placesController");
const { check } = require("express-validator");
const authMiddleWare = require("../middlewares/auth-middleware");

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "./public/uploads",
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// const upload = multer({
//   storage: storage,
// }).single("image");

router.get("/", placesController.getPlaces);
router.get("/user/:uid", placesController.getPlaceByUserId);
router.get("/:id", placesController.getPlaceById);

router.use(authMiddleWare);

router.post(
  "/",
  // upload,
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("image").not().isEmpty(),
  ],
  placesController.createPlace
);

// router.post("/", upload.single("image"), (req, res, next) => {});

router.put(
  "/:id",
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  check("image").not().isEmpty(),
  placesController.updatePlace
);

router.delete("/:id", placesController.deletePlace);

module.exports = router;
