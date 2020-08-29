import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./index.css";

import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { initAudio } from "../Listen/sketch";

const Main = () => {
  const [formMsg, setFormMsg] = useState("");
  const handleForm = useCallback((formMsg) => {
    setFormMsg(formMsg);
  }, []);

  const play = () => {
    if (formMsg !== "") {
      console.log(formMsg);
    }
  };

  return (
    <div className="Main">
      <div></div>
      <div>
        <h1> 1. send </h1>
        <div>
          <FormInput handleForm={handleForm} onEnter={(e) => play()} />
        </div>
        <Button
          className="play-button"
          message="play"
          icon="play_arrow"
          onClick={(e) => play()}
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
          Created by{" "}
          <a href="https://github.com/mattyhempstead/syncs-hack-2020/tree/master">
            leprachauns
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Main;
