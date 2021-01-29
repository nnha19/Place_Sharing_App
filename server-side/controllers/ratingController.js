const Place = require("../models/Place");
const Rating = require("../models/Rating");

const getAllReviews = (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
    .populate("rating")
    .exec((err, place) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(place.rating);
    });
};

const createReview = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const { author, star, review } = req.body;
    Place.findById(placeId)
      .populate("rating")
      .exec(async (err, place) => {
        const alreadyRated = place.rating.some(
          (r) => r.author.userId === author.userId
        );
        if (alreadyRated) {
          console.log("already rated.");
          res.status(500).json("users can't rate twice in same place.");
        } else {
          const newRating = await Rating.create({
            author,
            star,
            review,
          });
          const place = await Place.findById(placeId);
          place.rating.push(newRating);
          await place.save();
          res.status(200).json(newRating);
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const ratingId = req.params.rid;
    const { review, star, author } = req.body;
    const updatedRating = {
      review,
      star,
      author,
    };
    const rating = await Rating.findById(ratingId);
    if (rating.author.userId === req.userId) {
      console.log("You own this rating");
      await Rating.findByIdAndUpdate(ratingId, updatedRating);
      let oldRating = await Rating.findById(ratingId);
      oldRating = { ...updatedRating, _id: oldRating._id };
      res.status(200).json(oldRating);
    } else {
      res.status(500).json("This is not your rating.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const ratingId = req.params.rid;
    const rating = await Rating.findById(ratingId);
    if (req.userId === rating.author.userId) {
      const place = await Place.findById(placeId);
      const rating = await Rating.findByIdAndRemove(ratingId);
      const leftOverDeletedPlace = place.rating.filter((r) => {
        return r._id.toString() !== ratingId;
      });
      place.rating = leftOverDeletedPlace;
      await place.save();
      res.status(200).json(rating);
    } else {
      res.status(500).json("You can't delete this.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAllReviews = getAllReviews;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
