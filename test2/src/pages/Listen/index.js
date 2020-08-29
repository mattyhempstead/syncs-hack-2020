import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import sketch from "./sketch";
import P5Wrapper from "react-p5-wrapper";

const stop = () => {
  // console.log("stop");
};

const start = () => {
  // console.log("start");
};

const Listen = () => {
  start();
  return (
    <div className="Listen">
      <div>
        <Link to="/" className="link">
          <button className="back-button material-icons" onClick={() => stop()}>
            arrow_back
          </button>
        </Link>
      </div>
      <div className="title">
        <h1>listening...</h1>
      </div>
      <div className="plot">
        <P5Wrapper sketch={sketch} />
      </div>
    </div>
  );
};

export default Listen;
