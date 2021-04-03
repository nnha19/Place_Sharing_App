import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import "./NavItemUser.css";
import AuthContext from "../../../../../../context/authContext";
import moment from "moment";

const NavItemUser = (props) => {
  const [showNoti, setShowNoti] = useState([]);
  const history = useHistory();
  let reverseNoti = [];

  const authContext = useContext(AuthContext);
  const notiContext = useContext(AuthContext).noti;
  const { curUser } = notiContext;
  useEffect(() => {
    if (reverseNoti) {
      const firstNoti = reverseNoti.slice(0, 10);
      setShowNoti(firstNoti);
    }
  }, [curUser, curUser.notifications, authContext.users]);

  const newNoti =
    notiContext.curUser &&
    notiContext.curUser.notifications.filter((n) => n.new).length;

  let notiOutPut;

  if (notiContext.curUser && notiContext.curUser.notifications) {
    for (let i = notiContext.curUser.notifications.length - 1; i >= 0; i--) {
      reverseNoti.push(notiContext.curUser.notifications[i]);
    }
  }

  const navigateToPlaceHandler = (placeId) => {
    history.push(`/place/${placeId}`);
    authContext.setShowNotis(false);
  };

  notiOutPut =
    showNoti &&
    showNoti.map((notis) => {
      return (
        <p
          onClick={() => navigateToPlaceHandler(notis.placeId)}
          className="noti"
        >
          <strong>{notis.username}</strong>
          <span>{notis.action}</span>
          <p className="noti__date">{moment(notis.date).fromNow()}</p>
        </p>
      );
    });

  let showMoreNoti;
  const allNotiLength = reverseNoti.length;
  const shownNotiLength = showNoti.length;

  const showMoreNotiHandler = () => {
    if (allNotiLength - shownNotiLength >= 10) {
      const moreNoti = reverseNoti.slice(shownNotiLength, shownNotiLength + 10);
      setShowNoti([...showNoti, ...moreNoti]);
    } else if (allNotiLength > shownNotiLength) {
      const allLeftNoti = reverseNoti.slice(shownNotiLength);
      setShowNoti([...showNoti, ...allLeftNoti]);
    }
  };

  const showLessNotiHandler = () => {
    const lessNoti = reverseNoti.slice(0, 10);
    setShowNoti(lessNoti);
  };

  if (allNotiLength > shownNotiLength) {
    showMoreNoti = (
      <p className="user__noti-list" onClick={showMoreNotiHandler}>
        <i className="user__noti-icon fas fa-angle-down"></i>
        <span className="user__noti-text">Show More</span>
      </p>
    );
  } else if (reverseNoti.length === 0) {
    showMoreNoti = <p className="user__noti-list">No notifications yet.</p>;
  } else if (reverseNoti.length <= 10) {
    <p className="user__noti-list" onClick={showMoreNotiHandler}>
      <i className="user__noti-icon fas fa-angle-down"></i>
    </p>;
  } else {
    showMoreNoti = (
      <p className="user__noti-list" onClick={showLessNotiHandler}>
        <i className="user__noti-icon fas fa-angle-up"></i>
        <span className="user__noti-text">Show Less</span>
      </p>
    );
  }

  const goToProfileHandler = () => {
    history.push(`/place/user/${notiContext.curUser._id}`);
  };
  return (
    <>
      <div className="user">
        <i onClick={notiContext.toggleNoti} className="user__noti fas fa-bell">
          {newNoti > 0 && <span className="user__noti--num">{newNoti}</span>}
        </i>
        <div className={notiContext.showNotis ? "notis show-notis" : "notis"}>
          <span onClick={notiContext.toggleNoti} className="user__noti-close">
            X
          </span>
          {notiOutPut}
          {showMoreNoti}
        </div>
        <div onClick={goToProfileHandler} className="user__infos">
          {curUser.profileImg ? (
            <img
              className="user__profile"
              src={curUser.profileImg}
              alt="profile-picture"
            />
          ) : (
            <span className="user__profile-name">{curUser.username[0]}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default NavItemUser;
