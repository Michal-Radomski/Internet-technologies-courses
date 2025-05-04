import React from "react";
import { useHistory } from "react-router-dom";

import ConnectingButton from "./ConnectingButton";

const ConnectingButtons = (): JSX.Element => {
  const history = useHistory();

  const pushToJoinRoomPage = (): void => {
    history.push("/join-room");
  };

  const pushToJoinRoomPageAsHost = (): void => {
    history.push("/join-room?host=true");
  };

  return (
    <React.Fragment>
      <div className="connecting_buttons_container">
        <ConnectingButton buttonText="Join a meeting" onClickHandler={pushToJoinRoomPage} />
        <ConnectingButton createRoomButton buttonText="Host a meeting" onClickHandler={pushToJoinRoomPageAsHost} />
      </div>
    </React.Fragment>
  );
};

export default ConnectingButtons;
