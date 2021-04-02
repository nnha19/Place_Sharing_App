import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditRating.css";
import Rate from "../Rate/Rate";
import axios from "axios";
import Spinner from "../../../../../share/UI/LoadingSpinner/LoadingSpinner";

const EditRating = (props) => {
  const [loading, setLoading] = useState(false);
  const placeId = useParams().id;
  const [editRating, setEditRating] = useState(false);

  const editRatingHandler = () => {
    setEditRating(true);
    props.hideRating("editing");
  };
  const hideEditRatingHandler = () => {
    setEditRating(false);
  };
  useEffect(() => {
    if (!props.showRating) {
      setEditRating(false);
    }
  }, [props.showRating]);

  const deleteRatingHandler = async () => {
    setLoading(true);
    props.hideRating("deleting");
    const resp = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}/rating/${props.ratingId}`,
      {
        headers: {
          Authorization: props.authContext.token,
        },
      }
    );
    props.deleteRating(resp.data);
  };

  let ratingDotsClsName = "rating__dots";
  if (props.authContext.authenticated && props.ratingOwner) {
    ratingDotsClsName = "rating__dots show-rating__dots";
  }

  return (
    <>
      <div className="rating__update">
        <span
          onClick={() => props.showEditDropDown(props.ratingId)}
          className={ratingDotsClsName}
        >
          ...
        </span>
        <div
          className={
            props.showDropDown
              ? "rating__dropdown show-dropdown"
              : "rating__dropdown"
          }
        >
          <span
            onClick={editRatingHandler}
            className="rating__btn rating__edit-btn"
          >
            Edit
          </span>
          <span
            onClick={deleteRatingHandler}
            className="rating__btn rating__delete-btn"
          >
            Delete
          </span>
        </div>
        <Rate
          ratingStar={props.ratingStar}
          ratingReview={props.ratingReview}
          closeRate={() => hideEditRatingHandler()}
          rate={editRating}
          hideRating={props.hideRating}
          ratingId={props.ratingId}
          editing={editRating}
          updateRating={(rating) => props.updateRating(rating)}
        />
      </div>
      <Spinner showSpinner={loading} />
    </>
  );
};

export default EditRating;
