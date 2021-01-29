import React from "react";

import "./Button.css";
const Button = (props) => {
  const btnCls = `btn ${props.className}`;
  return (
    <button
      disabled={props.disabled}
      style={props.style}
      className={btnCls}
      type={props.type}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default Button;
