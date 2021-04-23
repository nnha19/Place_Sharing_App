const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(500).json("You are not authorized.");
    }
    checkToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = checkToken.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = authMiddleWare;
