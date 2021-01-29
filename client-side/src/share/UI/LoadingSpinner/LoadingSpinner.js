import React from "react"

import "./LoadingSpinner.css"

const LoadingSpinner =props => {
    let spinnerCls;
    props.showSpinner?spinnerCls="spinner show-spinner" :spinnerCls ="spinner";
    return ( 
        <div className={spinnerCls}></div>
    )
}

export default LoadingSpinner