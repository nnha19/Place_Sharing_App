import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../../../../share/UI/Model/Model";
import Button from "../../../../../share/UI/Button/Button";
import Spinner from "../../../../../share/UI/LoadingSpinner/LoadingSpinner";
import AuthContext from "../../../../../context/authContext";
import axios from "axios";
import useCreateNotification from "../../../../../customHooks/useCreateNotification";
import "./Rate.css";
const Rate = (props) => {
  const placeId = useParams().id;
  const authContext = useContext(AuthContext);

  const [createNoti] = useCreateNotification("");

  const [starCount, setStarCount] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [ratingState, setRatingState] = useState("");

  useEffect(() => {
    if (props.editing) {
      const ratingStar = props.ratingStar.split(" ")[0];
      setStarCount(ratingStar);
      setReview(props.ratingReview);
    }
  }, [props.editing]);

  useEffect(() => {
    if (starCount) {
      if (starCount == "1") {
        setRatingState("Horrible");
      } else if (starCount == "2") {
        setRatingState("Bad");
      } else if (starCount == "3") {
        setRatingState("Medium");
      } else if (starCount == "4") {
        setRatingState("Good");
      } else if (starCount == "5") {
        setRatingState("Amazing");
      }
    }
  }, [starCount]);

  const outPutStars = [];
  const ratedStarCls = "fas fa-star";
  const starCls = "far fa-star";
  let stars;
  const ratingHandler = (e) => {
    const starNum = e.target.dataset.star;
    if (e.target.classList.contains("rate__star")) {
      if (outPutStars.length > 0 && outPutStars[starNum - 1].includes("fas")) {
        setStarCount(starNum - 1);
      } else {
        setStarCount(starNum);
      }
    }
  };
  if (starCount) {
    for (let i = 0; i < starCount; i++) {
      outPutStars.push(ratedStarCls);
    }
    while (outPutStars.length !== 5) {
      outPutStars.push(starCls);
    }
  }

  if (outPutStars.length === 0) {
    stars = (
      <>
        <i className="rate__star far fa-star" data-star="1"></i>
        <i className="rate__star far fa-star" data-star="2"></i>
        <i className="rate__star far fa-star" data-star="3"></i>
        <i className="rate__star far fa-star" data-star="4"></i>
        <i className="rate__star far fa-star" data-star="5"></i>
      </>
    );
  } else {
    stars = outPutStars.map((starCls, i) => {
      return <i className={`rate__star ${starCls}`} data-star={i + 1}></i>;
    });
  }

  const writingReviewHandler = (e) => {
    setReview(e.target.value);
  };

  const submitRatingHandler = async (e) => {
    const updateRating = {
      author: {
        username: authContext.userData.username,
        userId: authContext.userData.userId,
      },
      review,
      star: starCount + " stars",
    };
    e.preventDefault();
    if (props.editing) {
      setLoading(true);
      props.closeRate();
      try {
        const resp = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}/rating/${props.ratingId}`,
          updateRating,
          {
            headers: {
              Authorization: authContext.token,
            },
          }
        );
        setLoading(false);
        props.updateRating(resp.data);
        setStarCount(0);
        setReview("");
      } catch (err) {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      props.hideRating();
      const rating = {
        author: {
          username: authContext.userData.username,
          userId: authContext.userData.userId,
        },
        review,
        star: starCount + " stars",
      };
      const resp = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}/rating`,
        rating,
        {
          headers: {
            Authorization: authContext.token,
          },
        }
      );
      props.addRating(resp.data);
      setLoading(false);
      setStarCount(0);
      setReview("");
      createNoti(props.placeOwnerId, " rated your place.", props.placeId);
    } catch (err) {
      setLoading(false);
    }
  };

  let checkBtnDisable = false;
  if (!starCount || review === "") {
    checkBtnDisable = true;
  }

  const cancelRateHandler = () => {
    props.closeRate();
  };

  const ratingStars = (
    <form onSubmit={submitRatingHandler} className="rate">
      <p className="rate__state">
        <em>{starCount ? ratingState : ""}</em>
      </p>
      <div onClick={ratingHandler} className="rate-icons">
        {stars}
      </div>
      <textarea
        className="rate__review"
        placeholder="What do you think?"
        rows="6"
        cols="60"
        value={review}
        onChange={writingReviewHandler}
      ></textarea>
      <Button disabled={checkBtnDisable} className="rate__btn">
        Submit
      </Button>
      <Button
        clicked={cancelRateHandler}
        type="button"
        className="rate__cancel"
      >
        Cancel
      </Button>
    </form>
  );

  return (
    <div>
      <Modal
        showModel={props.rate}
        content={ratingStars}
        header="Give an honest review."
      />
      <Spinner showSpinner={loading} />
    </div>
  );
};

export default Rate;
