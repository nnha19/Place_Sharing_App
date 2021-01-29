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

app.use(cors());
mongoose
  .connect(
    "mongodb://yelpcampDB:database@cluster0-shard-00-00.pkqmd.mongodb.net:27017,cluster0-shard-00-01.pkqmd.mongodb.net:27017,cluster0-shard-00-02.pkqmd.mongodb.net:27017/IncJour?ssl=true&replicaSet=atlas-5p5lw3-shard-0&authSource=admin&retryWrites=true&w=majority",
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

app.listen(5000, function () {
  console.log("Server has started.");
});
