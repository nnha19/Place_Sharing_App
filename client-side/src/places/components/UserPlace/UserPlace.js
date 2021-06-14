import React from "react";

import Places from "../../../places/components/Places/Places";
import UserProfile from "../ShowPlace/UserProfile/UserProfile";

const UserPlace = (props) => {
  return (
    <>
      {props.user ? (
        <>
          {/* <UserProfile creator={} /> */}
          <Places places={props.user.places} />
        </>
      ) : null}
    </>
  );
};

export default UserPlace;
