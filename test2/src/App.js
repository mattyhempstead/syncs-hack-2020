import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";
import Listen from "./pages/Listen";
import About from "./pages/About";
import Result from "./pages/Result";

const App = (props) => {
  let [msg, setMsg] = useState(false);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Main} />
        <Route
          exact
          path="/listen"
          render={() => <Listen update={(_msg) => setMsg(_msg)} />}
        />
        <Route exact path="/about" component={About} />
        <Route exact path="/result" render={() => <Result url={msg} />} />
      </Switch>
    </div>
  );
};

export default App;
