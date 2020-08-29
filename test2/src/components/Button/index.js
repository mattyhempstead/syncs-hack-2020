import React from "react";
import "./index.scss";

const Button = (props) => {
  return (
    <button className="mdc-button mdc-button--outlined custom-button">
      <div className="mdc-button__ripple"></div>
      <i className="material-icons mdc-button__icon" aria-hidden="true">
        {props.icon}
      </i>
      <span className="mdc-button__label">{props.message}</span>
    </button>
  );
};

export default Button;
