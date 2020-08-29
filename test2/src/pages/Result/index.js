import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

function is_url(str) {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}

const Result = (props) => {
  return (
    <div className="Result">
      {props.url && (
        <>
          <div>
            <Link to="/" className="link">
              <button className="back-button material-icons">arrow_back</button>
            </Link>
          </div>
          <div className="title">
            <h1>result</h1>
          </div>
          <div className="redir-text">
            {is_url(props.url) ? (
              <a href={props.url}>{props.url}</a>
            ) : (
              <p>{props.url}</p>
            )}
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default Result;
