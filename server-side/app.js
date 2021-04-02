const express = require("express");
const mongoose = require("mongoose");
const usersRoute = require("./routes/users");
const placesRoute = require("./routes/places");
const commentsRoute = require("./routes/comments");
const likesRoute = require("./routes/likes");
const userNotificationsRoute = require("./routes/user-notifications");
const reviewRoute = require("./routes/rating");

const cors = require("cors");
const app = express();
app.use(express.json());

app.locals.moment = require("moment");
require("dotenv").config();

console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

app.use(cors());
mongoose
  .connect(
    `mongodb+srv://webtek:${process.env.DB_PASSWORD}@cluster0.yrg2a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    }
  )
  .then((res) => console.log("connected"))
  .catch((err) => console.log(err));

app.use("/user", usersRoute);
app.use("/place/:id/rating", reviewRoute);

app.use("/place", placesRoute);
app.use("/place/:id/comments", commentsRoute);
app.use("/place/:id/likes", likesRoute);
app.use("/user/:uid/notifications", userNotificationsRoute);

app.listen(process.env.PORT || 5000, function () {
  console.log("Server has started.");
});
