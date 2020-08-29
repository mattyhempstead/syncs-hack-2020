import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./index.css";

import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { initAudio } from "../Listen/sketch";
import { play } from "./play";

const Main = () => {
  const [formMsg, setFormMsg] = useState("");
  const handleForm = useCallback((formMsg) => {
    setFormMsg(formMsg);
  }, []);

  const playButton = () => {
    if (formMsg !== "") {
      console.log(formMsg);
      play(formMsg);
    }
  };

  return (
    <div className="Main">
      <div></div>
      <div>
        <h1> 1. send </h1>
        <div>
          <FormInput handleForm={handleForm} onEnter={(e) => playButton()} />
        </div>
        <Button
          className="play-button"
          message="play"
          icon="play_arrow"
          onClick={(e) => playButton()}
          color="red"
        />
      </div>
      <div>
        <h1> 2. receive </h1>
        <br></br>
        <Link to="/listen" className="link">
          <Button
            className="listen-button"
            message="listen"
            icon="mic"
            color="green"
            onClick={() => initAudio()}
          />
        </Link>
      </div>
      <div></div>
      <div>
        <p>
          About <Link to="/about">this</Link>. About{" "}
          <a href="https://github.com/mattyhempstead/syncs-hack-2020/tree/master">
            us
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Main;
