import React from "react";

import MicButtonImg from "../../resources/images/mic.svg";
import MicButtonImgOff from "../../resources/images/micOff.svg";
// import * as webRTCHandler from "../../utils/webRTCHandler";

const MicButton = (): JSX.Element => {
  const [isMicMuted, setIsMicMuted] = React.useState<boolean>(false);

  const handleMicButtonPressed = (): void => {
    // webRTCHandler.toggleMic(isMicMuted);

    setIsMicMuted(!isMicMuted);
  };

  return (
    <React.Fragment>
      <div className="video_button_container">
        <img
          src={isMicMuted ? MicButtonImgOff : MicButtonImg}
          onClick={handleMicButtonPressed}
          className="video_button_image"
        />
      </div>
    </React.Fragment>
  );
};

export default MicButton;
