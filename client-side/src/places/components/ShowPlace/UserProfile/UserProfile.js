import React, { useContext } from "react";

import { Link } from "react-router-dom";
import AuthContext from "../../../../context/authContext";

import "./UserProfile.css";

const UserProfile = (props) => {
  const context = useContext(AuthContext);

  const creator =
    context.users &&
    context.users.find((user) => {
      return user._id === props.userId;
    });

  return creator ? (
    <Link to={`${props.link ? `/place/user/${creator._id}` : "#"}`}>
      <div className={`show__uploader ${props.className}`}>
        <img
          className="user__profile"
          src={`${process.env.REACT_APP_BACKEND_URL}/${creator.image}`}
          alt="Creator Profle"
        />
        <strong>
          <em>
            <span className="show__user-name">{creator.username}</span>
          </em>
        </strong>
      </div>
    </Link>
  ) : null;
};

export default UserProfile;
