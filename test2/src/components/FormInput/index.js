import React, { useState } from "react";
import "./index.scss";

const FormInput = () => {
  const [msg, setMsg] = useState("type here...");

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
