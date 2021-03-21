import React from "react";
import Home from "./Home";
import History from "./History";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/history" component={History} />
      </Switch>
    </Router>
  );
}

export default App;
