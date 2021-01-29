import React, { useState, useContext, useEffect } from "react";
import Button from "../../../../share/UI/Button/Button";
import BackDrop from "../../../../share/UI/BackDrop/BackDrop";
import Modal from "../../../../share/UI/Model/Model";
import Rate from "./Rate/Rate";
import "./Rating.css";
import AuthContext from "../../../../context/authContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import EditRating from "./EditRating/EditRating";

const Rating = (props) => {
  const placeId = useParams().id;
  const [ratings, setRatings] = useState([]);
  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `http://localhost:5000/place/${placeId}/rating`
      );
      setRatings(resp.data);
    })();
  }, []);

  const addRatingHandler = (newRating) => {
    setRatings([...ratings, newRating]);
  };

  const updateRatingHandler = (rating) => {
    const updateRatingIndex = ratings.findIndex((r) => r._id === rating._id);
    const allRatings = [...ratings];
    allRatings[updateRatingIndex] = rating;
    console.log(rating);
    setRatings(allRatings);
  };

  const deleteRatingHandler = (rating) => {
    const deletedRating = ratings.filter((r) => r._id !== rating._id);
    setRatings(deletedRating);
  };

  const showEditDropDownHandler = (ratingId) => {
    const rating = ratings.find((r) => r._id === ratingId);
    rating.editing
      ? (rating.editing = !rating.editing)
      : (rating.editing = true);
  };

  const authContext = useContext(AuthContext);

  const [showRating, setShowRating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [rate, setRate] = useState(false);

  const showRatingHandler = () => {
    setShowRating(true);
    setShowOptions(false);
  };

  const hideRatingHandler = (state) => {
    const hideEditingDropDown = () => {
      const notEditingRating = ratings.map((r) => {
        if (r.editing) {
          return { ...r, editing: false };
        }
        return { ...r };
      });
      setRatings(notEditingRating);
    };
    if (state === "editing" || state === "deleting") {
      hideEditingDropDown();
      return;
    }
    setRate(false);
    hideEditingDropDown();
    setShowRating(false);
    setShowOptions(false);
  };

  const showOptionsHandler = () => {
    setShowOptions(!showOptions);
  };

  const hideRateHandler = () => {
    setRate(false);
  };

  const rateHandler = () => {
    setRate(true);
    setShowOptions(false);
  };

  const ratedUser = ratings.some(
    (r) => r.author.userId === authContext.userData.userId
  );

  let ratingsOutput;
  if (ratings && ratings.length > 0) {
    ratingsOutput = ratings.map((r) => {
      let ratedStars = [];
      const [starNum] = r.star.split(" ");
      for (let i = 0; i < parseInt(starNum); i++) {
        ratedStars.push(<i class="rated fas fa-star"></i>);
      }
      while (ratedStars.length !== 5) {
        ratedStars.push(<i class="far fa-star"></i>);
      }

      return (
        <>
          <div className="rating">
            <div className="rating__stars">{ratedStars}</div>
            <div className="rating__infos">
              <div className="rating__edit">
                <h4 className="rating__name">
                  <strong>{r.author.username}</strong>
                </h4>
                <EditRating
                  showDropDown={r.editing}
                  showEditDropDown={(id) => showEditDropDownHandler(id)}
                  ratingId={r._id}
                  hideRating={(state) => hideRatingHandler(state)}
                  ratingStar={r.star}
                  ratingReview={r.review}
                  showRating={showRating}
                  deleteRating={deleteRatingHandler}
                  updateRating={(rating) => updateRatingHandler(rating)}
                  authContext={authContext}
                  ratingOwner={authContext.userData.userId === r.author.userId}
                />
              </div>
              <p className="rating__review">{r.review}</p>
            </div>
          </div>
        </>
      );
    });
  } else {
    ratingsOutput = (
      <p style={{ color: "blue", textAlign: "center", margin: "2rem" }}>
        No ratings to show.
      </p>
    );
  }

  return (
    <>
      <BackDrop clicked={hideRatingHandler} showBackDrop={showRating || rate} />
      <div className="ratings">
        <Button clicked={showOptionsHandler} className="ratings__btn">
          <span className="ratings__text">Rating</span>
          <i
            className={`user__noti-icon fas fa-angle-${
              showOptions ? "up" : "down"
            }`}
          ></i>
        </Button>
        <div className={showOptions ? "options show-options" : "options"}>
          <ul className="options__lists">
            <li onClick={showRatingHandler} className="options__list">
              Ratings
            </li>
            {authContext.authenticated && !ratedUser && (
              <li onClick={rateHandler} className="options__list">
                Rate
              </li>
            )}
          </ul>
        </div>
      </div>
      <div
        className={`${
          showRating ? "rating-modal show-rating" : "rating-modal"
        }`}
      >
        {ratingsOutput}
      </div>
      <Rate
        closeRate={() => hideRateHandler()}
        addRating={(rating) => addRatingHandler(rating)}
        hideRating={() => hideRatingHandler()}
        placeId={props.placeId}
        rate={rate}
        placeOwnerId={props.placeOwnerId}
      />
    </>
  );
};

export default Rating;
