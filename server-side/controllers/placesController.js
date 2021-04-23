const Place = require("../models/Place");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find({});
    if (places) {
      res.status(200).json(places);
    } else {
      res.status(404).json("Couldn't find any places.");
    }
  } catch (err) {
    res.status(500).json("Something went wrong with server.Please try again.");
  }
};

const getPlaceByUserId = async (req, res, next) => {
  try {
    const { uid } = req.params;
    User.findById(uid)
      .populate("places")
      .exec((err, user) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(user);
        res.status(200).json(user);
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getPlaceById = async (req, res, next) => {
  Place.findById(req.params.id)
    .populate("comments")
    .exec((err, place) => {
      if (err) {
        res.status(500).json(err);
      } else {
        console.log(place);
        res.status(200).json(place);
      }
    });
};

const createPlace = async (req, res, next) => {
  try {
    console.log(req.file);
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res
        .status(500)
        .json("Invalid input fileds.Make sure all the fileds are filled out.");
    }
    const { title, description, username,author } = req.body;
    const image =req.file.path

    const createdPlace = await Place.create({
      title,
      description,
      image,
      creator :{username,author},
      rating: [],
      date: new Date(),
    });

    const user = await User.findById(author);
    user.places.push(createdPlace);
    await user.save();
    console.log(user);

    res.status(201).json(createdPlace);
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Pls try again later.");
  }
};

const updatePlace = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res
        .status(500)
        .json("Invalid input fileds.Make sure all the fileds are filled out.");
    }
    const placeId = req.params.id;
    const { title, description, image, username, author, date } = req.body;
    const place = await Place.findById(placeId);
    console.log(`place creator id is ${place.creator.author}`);
    console.log(`current user id is ${req.userId}`);
    if (place.creator.author.toString() === req.userId) {
      const updatedPlace = await Place.findByIdAndUpdate(placeId, {
        title,
        description,
        image,
       creator :{author,username},
        date,
      });
      res.status(201).json(updatedPlace);
    } else {
      res.status(500).json("You are not allowed to do this.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.Try again later");
  }
};

const deletePlace = async (req, res, next) => {
  try {
    const placeId = req.params.id;
    const place = await Place.findById(placeId);
    if (place.creator.author.toString() === req.userId) {
      const deletedPlace = await Place.findByIdAndRemove(placeId);
      res.status(200).json(`Deleted place ${deletedPlace}`);
    } else {
      res.status(500).json("You can't delete this place.");
    }
  } catch (err) {
    res.status(500).json("Something went wrong.Try again later.");
  }
};

exports.getPlaces = getPlaces;
exports.getPlaceByUserId = getPlaceByUserId;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
