import React, { useContext } from "react";
import NavItems from "./NavItems/NavItems";
import "./NavBar.css";
import SideDrawer from "../SideDrawer/SideDrawer";
import AuthContext from "../../../../context/authContext";
const NavBar = (props) => {
  const authContext = useContext(AuthContext);
  return (
    <nav className="nav">
      <ul className="nav__lists">
        <NavItems />
      </ul>
      <div className="sidedrawer-container">
        <SideDrawer authContext={authContext} />
      </div>
    </nav>
  );
};

export default NavBar;
