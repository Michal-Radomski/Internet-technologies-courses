import React from "react";

import CameraButtonImg from "../../resources/images/camera.svg";
import CameraButtonImgOff from "../../resources/images/cameraOff.svg";
// import * as webRTCHandler from "../../utils/webRTCHandler";

const CameraButton = (): JSX.Element => {
  const [isLocalVideoDisabled, setIsLocalVideoDisabled] = React.useState<boolean>(false);

  const handleCameraButtonPressed = (): void => {
    // webRTCHandler.toggleCamera(isLocalVideoDisabled);

    setIsLocalVideoDisabled(!isLocalVideoDisabled);
  };

  return (
    <React.Fragment>
      <div className="video_button_container">
        <img
          src={isLocalVideoDisabled ? CameraButtonImgOff : CameraButtonImg}
          className="video_button_image"
          onClick={handleCameraButtonPressed}
        />
      </div>
    </React.Fragment>
  );
};

export default CameraButton;
