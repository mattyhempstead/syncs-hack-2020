import React from "react";
import "./index.scss";

import { MDCTextField } from "@material/textfield";
// const textField = new MDCTextField(document.querySelector(".mdc-text-field"));

const Main = () => {
  return (
    <div className="Main">
      <div>
        <label className="mdc-text-field mdc-text-field--outlined">
          <input
            type="text"
            className="mdc-text-field__input"
            aria-labelledby="my-label-id"
          />
          <span className="mdc-notched-outline">
            <span className="mdc-notched-outline__leading"></span>
            <span className="mdc-notched-outline__notch"></span>
            <span className="mdc-notched-outline__trailing"></span>
          </span>
        </label>
      </div>
      <div>
        <p> Test </p>
      </div>
      <div></div>
    </div>
  );
};

export default Main;
