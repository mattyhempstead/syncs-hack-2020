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
        <p>This app is revolutionising the way we communicate.</p>
        <p>
          Why settle for boring transverse waves, when you can Amaze your
          Friends using Rarefactions and Compressions!
        </p>
        <p>
          Combining state of the art Quantum Fourier Transformations, with the
          power of Mobile Computing, you now have the abilitiy to send{" "}
          <b>any</b> link in the entire World Wide Web to your friends - For
          Free!
        </p>
      </div>
    </div>
  );
};

export default About;
