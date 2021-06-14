import { useContext } from "react";

import axios from "axios";
import AuthContext from "../context/authContext";

const useCreateNotification = (init) => {
  const authContext = useContext(AuthContext);
  const sendRequest = async (author, action, placeId) => {
    const userNotiResp = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user/${author}/notifications`,
      {
        username: authContext.userData.username,
        userId: authContext.userData.userId,
        action,
        placeId,
      },
      {
        headers: {
          Authorization: authContext.token,
        },
      }
    );
    authContext.updateUser(userNotiResp.data, author);
  };

  return [sendRequest];
};

export default useCreateNotification;
