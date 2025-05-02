import React from "react";
import ReactDOM from "react-dom/client";
import { Router, Switch, Route } from "react-router-dom";

import App from "./App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import history from "./history";

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/blocks" component={Blocks} />
        <Route path="/conduct-transaction" component={ConductTransaction} />
        <Route path="/transaction-pool" component={TransactionPool} />
      </Switch>
    </Router>
  </React.StrictMode>
);
