import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import "./index.css";
import sketch, { stopAudio } from "./sketch";
import P5Wrapper from "react-p5-wrapper";

const stop = () => {
  stopAudio();
  // console.log("stop");
};

const start = () => {
  // console.log("start");
};

const Listen = (props) => {
  let [redir, setRedir] = useState(false);

  start();
  props.update(false);
  return (
    <div className="Listen">
      {redir && <Redirect to="/result" />}
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
        <P5Wrapper
          sketch={sketch}
          updateFunction={(msg) => {
            setRedir(true);
            props.update(msg);
          }}
        />
      </div>
    </div>
  );
};

export default Listen;
