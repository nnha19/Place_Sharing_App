const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(500).json("You are not authorized.");
    }
    checkToken = jwt.verify(token, "Secret_Key");
    req.userId = checkToken.userId;
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = authMiddleWare;
