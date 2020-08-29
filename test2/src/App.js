import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";
import Listen from "./pages/Listen";

const App = (props) => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/listen" component={Listen} />
      </Switch>
    </div>
  );
};

export default App;
