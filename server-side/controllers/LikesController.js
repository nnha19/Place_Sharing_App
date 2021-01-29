const Likes = require("../models/Likes");
const Place = require("../models/Place");
const User = require("../models/User");

const likePost = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const { username, author, placeOwnerId } = req.body;

    const place = await Place.findById(placeId);
    const alreadyLiked = place.likes.filter(
      (like) => like.author.toString() === author.toString()
    );
    if (alreadyLiked.length === 0) {
      const like = await Likes.create({
        username,
        author,
      });
      place.likes.push(like);
      const placeWithLikes = await place.save();
      // const placeOwner = await User.findById(placeOwnerId);
      // placeOwner.notifications.push({
      //   username,
      //   action: " likes your post.",
      //   new: true,
      // });
      // const placeOwnerNotis = await placeOwner.save();
      // res.status(200).json({ placeWithLikes, placeOwnerNotis });
      res.status(200).json({ placeWithLikes });
    } else {
      res.status(400).json("You already liked the post.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Please try again later.");
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const userId = req.params.uid;

    const place = await Place.findById(placeId);
    const notDeletedLike = place.likes.filter((like) => {
      return like.author.toString() !== userId;
    });
    place.likes = notDeletedLike;
    await place.save();
    res.status(200).json(place);
  } catch (err) {
    res.status(500).json("Something went wrong.Try again.");
  }
};

exports.likePost = likePost;
exports.unlikePost = unlikePost;
