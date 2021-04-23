const router = require("express").Router();
const userController = require("../controllers/userController");
const upload =require("../middlewares/multer-middleware")
const { check } = require("express-validator");

router.get("/", userController.getAllUsers);
router.get("/:uid", userController.getUserById);
router.post(
  "/signup",
  upload.single("image"),
  [
    check("username").not().isEmpty(),
    check("password").isLength({ min: "5" }),
    check("email").isEmail(),
  ],
  userController.createUser
);
router.post("/login", userController.loginUser);

module.exports = router;
