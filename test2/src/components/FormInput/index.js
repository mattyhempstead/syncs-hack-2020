import React, { useState } from "react";
import "./index.scss";

// const FormInput = () => {
//   return (
// <label className="mdc-text-field mdc-text-field--outlined">
//   <input
//     type="text"
//     className="mdc-text-field__input"
//     aria-labelledby="my-label-id"
//     onChange={console.log("hi")}
//   />
//   <span className="mdc-notched-outline">
//     <span className="mdc-notched-outline__leading"></span>
//     <span className="mdc-notched-outline__notch"></span>
//     <span className="mdc-notched-outline__trailing"></span>
//   </span>
// </label>
//   );
// };

const FormInput = () => {
  const [msg, setMsg] = useState("www.google.com");

  return (
    <input
      type="text"
      className="text-field"
      onChange={(e) => setMsg(e.target.value)}
      value={msg}
    />
  );
};

export default FormInput;
