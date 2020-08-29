import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const Listen = () => {
  return (
    <div class="Listen">
      <div>
        <Link to="/" class="link">
          <button class="mdc-icon-button material-icons">arrow_back</button>
        </Link>
      </div>
    </div>
  );
};

export default Listen;
