import React from "react";

const ConnectingButton = ({
  createRoomButton = false,
  buttonText,
  onClickHandler,
}: {
  createRoomButton?: boolean;
  buttonText: string;
  onClickHandler: () => void;
}): JSX.Element => {
  const buttonClass: string = createRoomButton ? "create_room_button" : "join_room_button";

  return (
    <React.Fragment>
      <button className={buttonClass} onClick={onClickHandler}>
        {buttonText}
      </button>
    </React.Fragment>
  );
};

export default ConnectingButton;
