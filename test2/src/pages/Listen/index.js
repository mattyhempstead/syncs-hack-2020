import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import "./script";

const Listen = () => {
  return (
    <div className="Listen">
      <div>
        <Link to="/" className="link">
          <button className="mdc-icon-button material-icons">arrow_back</button>
        </Link>
      </div>
    </div>
  );
};

export default Listen;
