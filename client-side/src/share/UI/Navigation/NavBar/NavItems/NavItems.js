import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./NavItems.css";
import AuthContext from "../../../../../context/authContext";
import NavItemUser from "./NavItemUser/NavItemUser";
const NavItems = (props) => {
  const authContext = useContext(AuthContext);

  const logoutHandler = () => {
    authContext.logout();
  };

  const hideSideDrawerHandler = (e) => {
    if (props.sidedrawer && e.target.classList.contains("nav__link")) {
      props.hideSideDrawer();
    }
  };

  return (
    <>
      <div onClick={hideSideDrawerHandler} className="nav__list">
        <li className="nav__item">
          <NavLink className="nav__link" to="/places">
            Places
          </NavLink>
        </li>
        {authContext.authenticated && (
          <li className="nav__item">
            <NavLink className="nav__link" to="/place/new">
              Add Place
            </NavLink>
          </li>
        )}
        {authContext.authenticated && (
          <li className="nav__item">
            <button onClick={logoutHandler} className="nav-btn">
              Logout
            </button>
          </li>
        )}
        {!authContext.authenticated && (
          <li className="nav__item">
            <NavLink className="nav__link" to="/login">
              Login
            </NavLink>
          </li>
        )}
      </div>
      {!props.sidedrawer && (
        <div className="logo">
          <NavLink className="logo__link" to="/">
            <h2 className="logo__name">IncJour</h2>
          </NavLink>
        </div>
      )}
      {authContext.authenticated &&
        authContext.noti.curUser &&
        !props.sidedrawer && (
          <NavItemUser authenticated={authContext.authenticated} />
        )}
    </>
  );
};

export default NavItems;
