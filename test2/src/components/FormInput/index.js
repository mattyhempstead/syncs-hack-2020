import React, { useState } from "react";
import "./index.css";

const FormInput = () => {
  const [msg, setMsg] = useState("");

  return (
    <input
      type="text"
      className="text-field"
      onChange={(e) => setMsg(e.target.value)}
      value={msg}
      placeholder="Type here..."
    />
  );
};

export default FormInput;
