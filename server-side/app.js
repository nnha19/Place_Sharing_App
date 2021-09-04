const express = require("express");
const mongoose = require("mongoose");
const usersRoute = require("./routes/users");
const placesRoute = require("./routes/places");
const commentsRoute = require("./routes/comments");
const likesRoute = require("./routes/likes");
const userNotificationsRoute = require("./routes/user-notifications");
const reviewRoute = require("./routes/rating");
const path = require("path");

const cors = require("cors");
const app = express();
app.use(express.json());
app.use("/imgs", express.static(path.join("imgs")));

require("dotenv").config();
const PORT = process.env.PORT || 5000;

app.use(cors());
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.yrg2a.mongodb.net:27017,cluster0-shard-00-01.yrg2a.mongodb.net:27017,cluster0-shard-00-02.yrg2a.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-90vt8b-shard-0&authSource=admin&retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

app.listen(PORT, function () {
  console.log("Server has started.");
});
