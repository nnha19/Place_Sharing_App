import React, { useState } from "react";

import "./SideDrawer.css";
import { NavLink } from "react-router-dom";
import NavItemUser from "../NavBar/NavItems/NavItemUser/NavItemUser";
import BackDrop from "../../../UI/BackDrop/BackDrop";
import NavItems from "../NavBar/NavItems/NavItems";

const SideDrawer = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const showSideDrawerHandler = () => {
    setShowSideDrawer(true);
  };

  const hideSideDrawer = () => {
    setShowSideDrawer(false);
  };

  return (
    <>
      <BackDrop clicked={hideSideDrawer} showBackDrop={showSideDrawer} />
      <div onClick={showSideDrawerHandler} className="hamburger-container">
        <span className="hamburger"></span>
      </div>
      {props.authContext.authenticated && props.authContext.noti.curUser && (
        <NavItemUser />
      )}
      <ul
        className={showSideDrawer ? "sidedrawer show-sidedrawer" : "sidedrawer"}
      >
        <div className="logo sidedrawer-logo">
          <NavLink className="logo__link" to="/">
            <h2 className="logo__name">IncJour</h2>
          </NavLink>
        </div>
        <NavItems hideSideDrawer={hideSideDrawer} sidedrawer={true} />
      </ul>
    </>
  );
};

export default SideDrawer;
