const router = require("express").Router();
const placesController = require("../controllers/placesController");
const { check } = require("express-validator");
const authMiddleWare = require("../middlewares/auth-middleware");
const upload =require("../middlewares/multer-middleware")

router.get("/", placesController.getPlaces);
router.get("/user/:uid", placesController.getPlaceByUserId);
router.get("/:id", placesController.getPlaceById);

router.use(authMiddleWare);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("image").not().isEmpty(),
  ],
  upload.single("image"),
  placesController.createPlace
);

router.put(
  "/:id",
  check("title").not().isEmpty(),
  check("description").isLength({ min: 5 }),
  check("image").not().isEmpty(),
  upload.single("image"),
  placesController.updatePlace
);

router.delete("/:id", placesController.deletePlace);

module.exports = router;
