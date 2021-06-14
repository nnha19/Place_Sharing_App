import React from "react";

import { Link } from "react-router-dom";

import "./UserProfile.css";

const UserProfile = (props) => {
  return (
    <Link to={`/place/user/${props.creator.author}`}>
      <div className="show__uploader">
        <img
          className="user__profile"
          src={`${process.env.REACT_APP_BACKEND_URL}/${props.creator.image}`}
          alt="Creator Profle"
        />
        <strong>
          <em>
            <span className="show__user-name">{props.creator.username}</span>
          </em>
        </strong>
      </div>
    </Link>
  );
};

export default UserProfile;
