import React from "react";
import { useHistory } from "react-router-dom";

const Button = ({
  buttonText,
  cancelButton = false,
  onClickHandler,
}: {
  buttonText: string;
  cancelButton?: boolean;
  onClickHandler: () => void;
}): JSX.Element => {
  const buttonClass: string = cancelButton ? "join_room_cancel_button" : "join_room_success_button";

  return (
    <React.Fragment>
      <button onClick={onClickHandler} className={buttonClass}>
        {buttonText}
      </button>
    </React.Fragment>
  );
};

const JoinRoomButtons = ({
  handleJoinRoom,
  isRoomHost,
}: {
  handleJoinRoom: () => void;
  isRoomHost: boolean;
}): JSX.Element => {
  const successButtonText: string = isRoomHost ? "Host" : "Join";

  const history = useHistory();

  const pushToIntroductionPage = (): void => {
    history.push("/");
  };

  return (
    <React.Fragment>
      <div className="join_room_buttons_container">
        <Button buttonText={successButtonText} onClickHandler={handleJoinRoom} />
        <Button buttonText="Cancel" cancelButton onClickHandler={pushToIntroductionPage} />
      </div>
    </React.Fragment>
  );
};

export default JoinRoomButtons;
