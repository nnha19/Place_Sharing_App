import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserPlace from "../components/UserPlace/UserPlace";

import axios from "axios";
const UserPlacePage = (props) => {
  const params = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/place/user/${params.uid}`
      );
      setUser(resp.data);
    })();
  }, []);

  return (
    <>
      <UserPlace user={user} />
    </>
  );
};

export default UserPlacePage;
