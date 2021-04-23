import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./share/UI/Navigation/NavBar/NavBar";
import PlacesPage from "./places/pages/PlacesPage";
import { Route, Switch, Redirect } from "react-router-dom";
import SignUp from "./share/components/Authentication/SignUp/SignUp";
import Login from "./share/components/Authentication/Login/Login";
import CreatePlacePage from "./places/pages/CreatePlacePage";
import AuthContext from "./context/authContext";
import EditPlacePage from "./places/pages/EditPlacePage";
import UserPlacePage from "./places/pages/UserPlacePage";
import Show from "./places/pages/ShowPage";
import axios from "axios";
import moment from "moment";

const App = () => {
  document.title = "Place Sharing App";

  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState({ username: "", userId: "" });
  const [showNotis, setShowNotis] = useState(false);
  const [users, setUsers] = useState(null);
  const [curUser, setCurUser] = useState();

  useEffect(() => {
    (async () => {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`);
      setUsers(resp.data);
    })();
  }, [userData]);

  useEffect(() => {
    if (users && userData.userId) {
      const currentUser = users.find((u) => u._id === userData.userId);
      setCurUser(currentUser);
    }
  }, [users, userData.userId]);


  const updateUserNotiHandler = (notification, notiOwnerId) => {
    const notiOwner = users.find((u) => u._id === notiOwnerId);
    notiOwner.notifications.push(notification);
    const index = users.findIndex((u) => u._id === notiOwnerId);
    const updateUsers = [...users];
    updateUsers[index] = notiOwner;
    setUsers(updateUsers);
  };

  const loginHandler = async (respData) => {
    const { username, userId } = respData;
    setToken(respData.token);
    setUserData({ username, userId });
    const resp = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/user/${userId}`
    );
    const loginTimer =
      respData.loginTimer || new Date().getTime() + 1000 * 60 * 60;
    const userAuth = {
      username,
      userId,
      token: respData.token,
      loginTimer,
    };
    localStorage.setItem("userAuth", JSON.stringify(userAuth));
  };

  const logoutHandler = () => {
    setToken(null);
    setUserData({ username: "", userId: "" });
    localStorage.clear();
  };

  const hideNotiHandler = (e) => {
    if (!e.target.closest(".notis") && !e.target.closest(".user__noti")) {
      setShowNotis(false);
    }
  };

  const toggleNoti = async (e) => {
    setShowNotis(!showNotis);
    const newNoti = curUser.notifications.every((n) => !n.new);
    if (!newNoti) {
      const resp = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/${curUser._id}/notifications`
      );
      const currentUser = users.find((u) => u._id === userData.userId);
      const index = users.findIndex((u) => u._id === userData.userId);
      currentUser.notifications = resp.data;
      const updateUsers = [...users];
      updateUsers[index] = currentUser;
      setUsers(updateUsers);
    }
  };

  useEffect(() => {
    let respData;
    const userAuth = JSON.parse(localStorage.getItem("userAuth"));
    if (userAuth) {
      const { username, userId, token, loginTimer } = userAuth;
      respData = { username, userId, token, loginTimer };
      const currentTime = new Date().getTime();
      if (loginTimer > currentTime) loginHandler(respData);
    }
  }, []);

  return (
    <div onClick={hideNotiHandler} className="wrapper">
      <AuthContext.Provider
        value={{
          authenticated: !!token,
          login: (respData) => loginHandler(respData),
          logout: () => logoutHandler(),
          token,
          userData: userData,
          noti: {
            showNotis,
            hideNoti: () => hideNotiHandler(),
            toggleNoti: () => toggleNoti(),
            curUser,
          },
          users,
          updateUser: (noti, notiOwnerId) =>
            updateUserNotiHandler(noti, notiOwnerId),
          setShowNotis: (boolean) => setShowNotis(boolean),
        }}
      >
        <NavBar />
        <Switch>
          <Route exact path="/" component={PlacesPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/places" component={PlacesPage} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/place/new" component={CreatePlacePage} />
          <Route exact path="/place/:id" component={Show} />
          <Route exact path="/place/:id/update" component={EditPlacePage} />
          <Route exact path="/place/user/:uid" component={UserPlacePage} />
        </Switch>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
