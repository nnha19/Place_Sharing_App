import React from "react"

import "./Model.css"
const Model =props => {
    let modelCls;
    props.showModel?modelCls="model show-model":modelCls ="model"
    return (
        <div className={modelCls}>
          <h4 className="model__header">{props.header}</h4>
            <div className="model__infos">
             <div className="model__content">
                 {props.content}
             </div>
           <div className="model__footer">
              {props.footer}
           </div>
            </div>
        </div>
    )
}

export default Model