import React from "react";

import Places from "../../../places/components/Places/Places";
import UserProfile from "../ShowPlace/UserProfile/UserProfile";

import "./UserPlace.css";

const UserPlace = (props) => {
  return (
    <>
      {props.user ? (
        <>
          <div className="user-place">
            <UserProfile userId={props.user._id} />
            <span> &nbsp; Places</span>
          </div>
          <Places places={props.user.places} />
        </>
      ) : null}
    </>
  );
};

export default UserPlace;
