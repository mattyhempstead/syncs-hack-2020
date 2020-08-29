import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

const Main = () => {
  return (
    <div className="Main">
      <div></div>
      <div>
        <h1> send: </h1>
        <div>
          <FormInput />
        </div>
        <Button
          message="play"
          icon="play_arrow"
          onClick={(e) => console.log("hi")}
        />
      </div>
      <div>
        <h1> receive: </h1>
        <br></br>
        <Link to="/listen" class="link">
          <Button
            message="listen"
            icon="mic"
            onClick={(e) => console.log("ho")}
          />
        </Link>
      </div>
      <div></div>
      <div>
        <p>
          Created by <a href="https://www.benbraham.com">leprachauns</a>.
        </p>
      </div>
    </div>
  );
};

export default Main;
