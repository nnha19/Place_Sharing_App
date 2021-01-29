import React from "react"

import "./BackDrop.css"
const BackDrop =props => {
    return (
        props.showBackDrop ?
        <div
         onClick={props.clicked}
         className='back-drop'></div>:null
    )
}

export default BackDrop