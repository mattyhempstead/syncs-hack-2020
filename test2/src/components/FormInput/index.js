import React, { useState, useEffect } from "react";
import "./index.css";

const FormInput = (props) => {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    props.handleForm(msg);
  }, [msg]);

  return (
    <input
      type="text"
      className="text-field"
      onChange={(e) => setMsg(e.target.value)}
      onKeyPress={(e) => {
        if (e.charCode === 13) props.onEnter();
      }}
      // value={msg}
      placeholder="Type here..."
    />
  );
};

export default FormInput;
