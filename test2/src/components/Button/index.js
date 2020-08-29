import React from "react";
import "./index.css";

const Button = (props) => {
  return (
    <button className={"custom-button-" + props.color} onClick={props.onClick}>
      <i className="material-icons mdc-button__icon" aria-hidden="true">
        {props.icon}
      </i>
      <span className="button-label">{props.message}</span>
    </button>
  );
};

export default Button;
