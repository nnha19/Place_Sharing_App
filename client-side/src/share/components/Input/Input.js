import React, { useReducer, useEffect } from "react";

import "./Input.css";

const checkValid = (value, validRules) => {
  if (validRules.type === "REQUIRE") {
    return value.length > 0;
  } else if (validRules.type === "MIN_LENGTH") {
    return value.length >= validRules.count;
  }
};

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: action.checkValidity(action.value, action.validRules),
        isTouched: true,
      };
  }
};

const Input = (props) => {
  const [enteredVal, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    isTouched: false,
  });

  const changeHandler = (e) => {
    dispatch({
      type: "CHANGE",
      value: e.target.value,
      validRules: props.validRules,
      checkValidity: (value, validRules) => checkValid(value, validRules),
    });
  };
  const { value, isValid } = enteredVal;

  useEffect(() => {
    props.inputValues(value, isValid, props.id);
  }, [value, isValid]);

  let element;
  if (props.element === "input") {
    element = (
      <input
        name={props.id}
        onChange={changeHandler}
        type={props.type}
        id={props.id}
        className={`input ${props.className}`}
        value={
          props.editValues ? props.editValues[props.id].value : enteredVal.value
        }
      />
    );
  } else if (props.element === "textarea") {
    element = (
      <textarea
        name={props.id}
        rows="4"
        cols="40"
        onChange={changeHandler}
        // value={props.EditValues?"Hello":enteredVal.value}
        value={
          props.editValues ? props.editValues[props.id].value : enteredVal.value
        }
        className={`input textarea ${props.className}`}
      ></textarea>
    );
  } else if (props.element === "fileUpload") {
    element = (
      <input
        name={props.id}
        onChange={changeHandler}
        type={props.type}
        id={props.id}
        className={`${props.className}`}
        value={
          props.editValues ? props.editValues[props.id].value : enteredVal.value
        }
      />
    );
  }
  return (
    <div className="input-container">
      <label className="label" htmlFor={props.id}>
        {props.label}
      </label>
      {element}
      {!enteredVal.isValid && enteredVal.isTouched && (
        <p className="invalid-text">{props.invalidText}</p>
      )}
    </div>
  );
};

export default Input;
