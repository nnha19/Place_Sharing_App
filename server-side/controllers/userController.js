const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const getAllUsers = async (req, res, next) => {
  try {
    User.find({})
      .populate("notifications")
      .exec((err, users) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json(users);
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
};

const createUser = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(500).json("Invalid Input fields.Try again.");
    } else {
      const { username, email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user) {
        res
          .status(500)
          .json({ err: "User with the provided email already exists." });
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
        });
        console.log(newUser);
        try {
          const token = await jwt.sign(
            {
              username: newUser.username,
              userId: newUser._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          res.status(200).json({
            message: "Created an account",
            userData: {
              userId: newUser._id,
              username: newUser.username,
              token,
            },
          });
        } catch (err) {
          console.log(err);
          res.status(500).json("Something went wrong.Try again later.");
        }
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json("Something went wrong with the server.Please try again later.");
  }
};

const loginUser = async (req, res, next) => {
  let token;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        jwt.sign(
          { username: user.username, userId: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "1h" },
          (err, tok) => {
            if (err) {
              res.status(500).json("Something went wrong.");
            } else {
              token = tok;
              res.status(200).json({
                message: "logged you in.",
                userData: {
                  userId: user._id,
                  username: user.username,
                  token,
                },
              });
            }
          }
        );
      } else {
        res.status(404).json("Your password is incorrect");
      }
    } else {
      res.status(404).json("User with the provided Email doesn't exist.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Try again later.");
  }
};

exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getUserById = getUserById;
exports.getAllUsers = getAllUsers;
