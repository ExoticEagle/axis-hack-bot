import React from "react";
import Home from "./Home";
import History from "./History";
import Login from "./Login";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/history" component={History} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
