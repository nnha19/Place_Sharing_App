import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../Input/Input";
import Button from "../../../UI/Button/Button";
import AuthContext from "../../../../context/authContext";
import axios from "axios";
import LoadingSpinner from "../../../UI/LoadingSpinner/LoadingSpinner";
import ImageUpload from "../../ImageUpload/ImageUpload";

const SignUp = (props) => {
  const history = useHistory();
  const [userInfos, setUserInfos] = useState({
    email: {
      value: "",
      isValid: false,
    },
    username: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });
  const [isAllValid, setIsAllValid] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const signUpHandler = async (e) => {
    e.preventDefault();
    const { username, email, password } = userInfos;
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    try {
      setIsLoading(true);
      const resp = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/signup`,
        data
      );
      console.log(resp);
      authContext.login(resp.data.userData);
      setIsLoading(false);
      history.push("/");
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setError(err.response.data);
      }
      console.log(err);
    }
  };

  const inputValuesHandler = (value, isValid, id) => {
    const newValue = { ...userInfos[id] };
    newValue.value = value;
    newValue.isValid = isValid;
    setUserInfos({
      ...userInfos,
      [id]: newValue,
    });
  };

  useEffect(() => {
    const overallValid = [];
    for (let key in userInfos) {
      overallValid.push(userInfos[key].isValid);
    }
    if (overallValid.every((v) => v)) {
      setIsAllValid(true);
    } else {
      setIsAllValid(false);
    }
  }, [userInfos]);

  return (
    <>
      <LoadingSpinner showSpinner={isLoading} />
      <div className="login-container">
        <div className="login">
          <h4 className="login__title">Create an account</h4>
          <form onSubmit={signUpHandler} className="form">
            <Input
              element="input"
              type="text"
              label="Username"
              id="username"
              validRules={{ type: "REQUIRE" }}
              invalidText="This field can't be empty!"
              inputValues={(value, isValid, id) =>
                inputValuesHandler(value, isValid, id)
              }
            />
            <Input
              element="input"
              type="text"
              id="email"
              label="Email"
              validRules={{ type: "REQUIRE" }}
              invalidText="This field can't be empty"
              inputValues={(value, isValid, id) =>
                inputValuesHandler(value, isValid, id)
              }
            />
            <Input
              element="input"
              type="password"
              id="password"
              label="Password"
              validRules={{ type: "MIN_LENGTH", count: 5 }}
              invalidText="minimal length must be 5!"
              inputValues={(value, isValid, id) =>
                inputValuesHandler(value, isValid, id)
              }
            />
            <ImageUpload />
            <Button disabled={!isAllValid} className="form__btn">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
