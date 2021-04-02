import React, { useState, useContext, useEffect } from "react";
import Input from "../../Input/Input";
import { Link } from "react-router-dom";
import Button from "../../../UI/Button/Button";
import AuthContext from "../../../../context/authContext";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../../UI/LoadingSpinner/LoadingSpinner";

import "./Login.css";
import axios from "axios";
const Login = (props) => {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [inputValues, setInputValues] = useState({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });
  const [allValid, setAllValid] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    const { email, password } = inputValues;
    const data = { email: email.value, password: password.value };
    try {
      setIsLoading(true);
      const resp = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/login`,
        data
      );
      authContext.login(resp.data.userData);
      setIsLoading(false);
      history.push("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      }
      setIsLoading(false);
      console.log(err);
    }
  };
  const inputValuesHandler = (value, isValid, id) => {
    const changedValue = { ...inputValues[id] };
    changedValue.value = value;
    changedValue.isValid = isValid;
    setInputValues({ ...inputValues, [id]: changedValue });
  };

  useEffect(() => {
    const allValid = [];
    for (let key in inputValues) {
      allValid.push(inputValues[key].isValid);
    }
    allValid.every((v) => v) ? setAllValid(true) : setAllValid(false);
  }, [inputValues]);

  return (
    <>
      <LoadingSpinner showSpinner={isLoading} />
      <div className="login-container">
        <div className="login">
          <h4 className="login__title">Login</h4>
          <form onSubmit={loginHandler} className="form">
            <Input
              element="input"
              type="text"
              id="email"
              label="Email"
              validRules={{ type: "REQUIRE" }}
              invalidText="This field can't be empty."
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
              invalidText="min length 5 at least."
              inputValues={(value, isValid, id) =>
                inputValuesHandler(value, isValid, id)
              }
            />
            <Button disabled={!allValid} className="form__btn">
              Submit
            </Button>
            <p className="form__p">
              Don't have an account?
              <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
