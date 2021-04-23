import React, { useState, useEffect, useContext } from "react";
import Input from "../../../share/components/Input/Input";
import Button from "../../../share/UI/Button/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../context/authContext";
import LoadingSpinner from "../../../share/UI/LoadingSpinner/LoadingSpinner";
import ImageUpload from "../../../share/components/ImageUpload/ImageUpload";


const EditPlace = (props) => {
  const placeId = useParams().id;
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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`
        );
        const place = resp.data;

        const placeWithValues = {
          title: {
            value: place.title,
            isValid: true,
          },
          description: {
            value: place.description,
            isValid: true,
          },
          image: {
            value: place.image,
            isValid: true,
          },
        };
        setInputValues(placeWithValues);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        console.log(err);
        setIsLoading(false);
      }
    })();
  }, []);

  
  const editingPlaceHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      formData.append("title", inputValues.title.value);
      formData.append("description", inputValues.description.value);
      formData.append("image", inputValues.image.value);
      formData.append("username", authContext.userData.username);
      formData.append("author", authContext.userData.userId);
      formData.append("date", new Date().toDateString(),);

      const resp = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/place/${placeId}`,
        formData,
        {
          headers: {
            Authorization: authContext.token,
            userId: authContext.userData.userId,
          },
        }
      );
      const newPlace = resp.data;
      console.log(newPlace);
      history.push("/");
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  return (
    <>
      <LoadingSpinner showSpinner={isLoading} />
      <div className="login">
        <form onSubmit={editingPlaceHandler} className="form">
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
            editValues={inputValues}
          />
         <ImageUpload 
            id="image" inputValues={(value, isValid, id) =>
            inputValuesHandler(value, isValid, id)
          }  />
          <Input
            element="textarea"
            label="Description"
            id="description"
            validRules={{ type: "MIN_LENGTH", count: 5 }}
            invalidText="This field can't be empty!"
            inputValues={(value, isValid, id) =>
              inputValuesHandler(value, isValid, id)
            }
            rows="4"
            cols="40"
            editValues={inputValues}
          />
          <Button disabled={!allValid} className="form__btn">
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default EditPlace;
