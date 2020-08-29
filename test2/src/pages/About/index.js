import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

const About = () => {
  return (
    <div className="About">
      <div>
        <Link to="/" className="link">
          <button className="back-button material-icons">arrow_back</button>
        </Link>
      </div>
      <div className="title">
        <h1>About This</h1>
      </div>
      <div className="about-text">
        <p>Quite Easy is exactly that - quite easy!</p>
        <p>
          Quite Easy codes or QE codes are a way of transmitting information
          such as URLs or short pieces of texts to those around you.
        </p>
        <p>
          Unlike our brother, the QR code, we don't require people to huddle
          around a small piece of paper. Instead, we use something else: a
          speaker and a microphone! QE Codes digitally encode your message into
          a short audio clip, which is then received by your
          friends/colleagues/family/ lawyers/enemies/dogs!
        </p>
        <p> Easy!</p>
      </div>
    </div>
  );
};

export default About;
