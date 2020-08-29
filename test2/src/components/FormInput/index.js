import React, { useState, useEffect } from "react";
import "./index.css";

const FormInput = ({ handleForm, onEnter }) => {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    handleForm(msg);
  }, [msg, handleForm]);

  return (
    <input
      type="text"
      className="text-field"
      onChange={(e) => setMsg(e.target.value)}
      onKeyPress={(e) => {
        if (e.charCode === 13) onEnter();
      }}
      // value={msg}
      placeholder="Type here..."
    />
  );
};

export default FormInput;
