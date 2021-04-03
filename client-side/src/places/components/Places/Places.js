import React from "react";
import "./Places.css";
import { Link } from "react-router-dom";
import Button from "../../../share/UI/Button/Button";
const Places = (props) => {
  let places;
  if (props.places.length > 0) {
    places = props.places.map((p) => {
      return (
        <div className="place">
          <img className="place__img" src={p.image} alt={p.title} />
          <h3 className="place__title">{p.title}</h3>
          <div className="place__infos">
            <p className="place__like">
              <i class="place__star far fa-thumbs-up"></i>
              {p.likes.length} {p.likes.length > 1 ? " likes" : "like"}
            </p>
            <p className="place__comment">
              <i class="place__star far fa-comments"></i>
              {p.comments.length}
              {p.comments.length > 1 ? " comments" : " comment"}
            </p>
            <div>
              <i className="place__star far fa-star"></i>
              <p className="place__rating">
                {p.rating.length}
                {p.rating.length > 1 ? " ratings" : " rating"}
              </p>
            </div>
          </div>
          <div className="center">
            <Button style={{ width: "100%" }} className="place__btn">
              <Link className="place__detail" to={`/place/${p._id}`}>
                Detail
              </Link>
            </Button>
          </div>
        </div>
      );
    });
  } else if (props.places.length === 0 && !props.isLoading) {
    places = <p className="error-message">!No places to show.</p>;
  }

  return <div className="places">{places}</div>;
};

export default Places;
