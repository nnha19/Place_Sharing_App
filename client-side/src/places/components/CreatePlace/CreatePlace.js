import React, { useState, useEffect, useContext } from "react";
import Input from "../../../share/components/Input/Input";
import Button from "../../../share/UI/Button/Button";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../context/authContext";
import ImageUpload from "../../../share/components/ImageUpload/ImageUpload";
import moment from "moment";
const CreatePlace = (props) => {
  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [inputValues, setInputValues] = useState({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    image: {
      value: "",
      isValid: false,
    },
  });

  const [allValid, setAllValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputValuesHandler = (value, isValid, id) => {
    const changedInput = { ...inputValues[id], value, isValid };
    setInputValues({ ...inputValues, [id]: changedInput });
  };

  useEffect(() => {
    const valids = [];
    const keys = Object.keys(inputValues);
    keys.forEach((k) => {
      valids.push(inputValues[k].isValid);
    });
    valids.every((v) => v) ? setAllValid(true) : setAllValid(false);
  }, [inputValues]);

  const creatingPlaceHandler = async (e) => {
    e.preventDefault();
    try {
      const place = {
        title: inputValues.title.value,
        description: inputValues.description.value,
        image: inputValues.image.value,
        creator: {
          username: authContext.userData.username,
          author: authContext.userData.userId,
        },
      };

      const formData = new FormData();
      // formData.append("title", inputValues.title.value);
      // formData.append("description", inputValues.description.value);
      // formData.append("image", inputValues.image.value);
      // formData.append("username", authContext.userData.username);
      // formData.append("author", authContext.userData.userId);
      const resp = await axios.post("http://localhost:5000/place", place, {
        headers: {
          Authorization: authContext.token,
        },
      });
      const newPlace = resp.data;
      history.push("/");
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  return (
    <div className="login">
      <form onSubmit={creatingPlaceHandler} className="form">
        <Input
          element="input"
          type="text"
          label="Title"
          id="title"
          validRules={{ type: "REQUIRE" }}
          invalidText="This field can't be empty!"
          inputValues={(value, isValid, id) =>
            inputValuesHandler(value, isValid, id)
          }
        />
        <Input
          element="input"
          id="image"
          type="text"
          label="image"
          validRules={{ type: "REQUIRE" }}
          invalidText="Choose an image."
          inputValues={(value, isValid, id) =>
            inputValuesHandler(value, isValid, id)
          }
        />
        <Input
          element="textarea"
          label="Description"
          id="description"
          validRules={{ type: "MIN_LENGTH", count: 30 }}
          invalidText="minnimal length 30 characters."
          inputValues={(value, isValid, id) =>
            inputValuesHandler(value, isValid, id)
          }
          rows="4"
          cols="40"
        />
        {/* <ImageUpload
          id="image"
          inputValues={(value, isValid, id) =>
            inputValuesHandler(value, isValid, id)
          }
        /> */}
        <Button disabled={!allValid} className="form__btn">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreatePlace;
