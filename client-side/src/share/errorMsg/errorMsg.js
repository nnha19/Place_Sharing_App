import React from "react";

import "./errorMsg.css";

const ErrorMsg = (props) => {
  return (
    <div className="error-msg">
      <p className="error-msg__text">
        {props.errorMessage && props.errorMessage}
      </p>
    </div>
  );
};

export default ErrorMsg;
