import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.scss";
import IntroductionPage from "./IntroductionPage/IntroductionPage";
import JoinRoomPage from "./JoinRoomPage/JoinRoomPage";
import RoomPage from "./RoomPage/RoomPage";
import { connectWithSocketIOServer } from "./utils/wss";

// Todo: fix the bugs - node versions compatibility!
const App = (): JSX.Element => {
  React.useEffect(() => {
    connectWithSocketIOServer();
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/join-room">
            <JoinRoomPage />
          </Route>
          <Route path="/room">
            <RoomPage />
          </Route>
          <Route path="/" exact={true}>
            <IntroductionPage />
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
