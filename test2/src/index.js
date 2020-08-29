import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { MDCRipple } from "@material/ripple";
import { MDCTextField } from "@material/textfield";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

const buttonRipple = new MDCRipple(document.querySelector(".mdc-button"));

// const textField = new MDCTextField(document.querySelector(".mdc-text-field"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
