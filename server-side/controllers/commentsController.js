const Place = require("../models/Place");
const Comments = require("../models/Comments");

const createComments = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const { author, username, text } = req.body;
    const newComment = await Comments.create({
      author,
      username,
      text,
    });
    const place = await Place.findById(placeId);
    place.comments.push(newComment);
    const placeWithComment = await place.save();
    Place.findById(placeId)
      .populate("comments")
      .exec((err, place) => {
        if (err) {
          console.log(err);
        }

        res.status(201).json(place);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong with the server.");
  }
};

const editComment = async (req, res, next) => {
  try {
    const commentId = req.params.cid;
    const { author, username, text } = req.body;
    const comment = await Comments.findById(commentId);
    if (comment.author.toString() === req.userId) {
      const updatedComment = await Comments.findByIdAndUpdate(commentId, {
        author,
        username,
        text,
      });
      res.status(200).json(updatedComment);
    } else {
      res.status(500).json("This comment doesn't belong to you.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Please try again later.");
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);
    const commentId = req.params.cid;
    const comment = await Comments.findById(commentId);
    if (comment.author.toString() === req.userId) {
      const newComments = place.comments.filter(
        (c) => c.toString() !== commentId
      );
      place.comments = newComments;
      const newPlace = await place.save();
      const deletedComment = await Comments.findByIdAndRemove(commentId);
      res
        .status(200)
        .json({ message: "Comment deleted", id: deletedComment._id });
    } else {
      res.status(500).json("You can't take this action.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Please try again later.");
  }
};

exports.createComments = createComments;
exports.editComment = editComment;
exports.deleteComment = deleteComment;
