import React from "react";
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
        <Button message="play" icon="star" />
      </div>
      <div>
        <h1> receive: </h1>
        <br></br>
        <Button message="listen" icon="speaker" />
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
