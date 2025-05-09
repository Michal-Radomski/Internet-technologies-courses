import React from "react";

import SwitchImg from "../../resources/images/switchToScreenSharing.svg";
import LocalScreenSharingPreview from "./LocalScreenSharingPreview";
import * as webRTCHandler from "../../utils/webRTCHandler";

const constraints = {
  audio: false,
  video: true,
};

const SwitchToScreenSharingButton = (): JSX.Element => {
  const [isScreenSharingActive, setIsScreenSharingActive] = React.useState<boolean>(false);
  const [screenSharingStream, setScreenSharingStream] = React.useState<MediaStream | null>(null);

  const handleScreenShareToggle = async (): Promise<void> => {
    if (!isScreenSharingActive) {
      let stream = null;
      try {
        stream = (await navigator.mediaDevices.getDisplayMedia(constraints)) as MediaStream;
        console.log("stream:", stream);
      } catch (err) {
        console.log("error occurred when trying to get an access to screen share stream", err);
      }
      if (stream) {
        setScreenSharingStream(stream);

        webRTCHandler.toggleScreenShare(isScreenSharingActive, stream);
        setIsScreenSharingActive(true);
        // Execute here function to switch the video track which we are sending to other users
      }
    } else {
      webRTCHandler.toggleScreenShare(isScreenSharingActive);
      setIsScreenSharingActive(false);

      // Stop screen share stream
      screenSharingStream?.getTracks().forEach((t) => t.stop());
      setScreenSharingStream(null);
    }
  };

  return (
    <React.Fragment>
      <div className="video_button_container">
        <img src={SwitchImg} onClick={handleScreenShareToggle} className="video_button_image" />
      </div>
      {isScreenSharingActive ? <LocalScreenSharingPreview stream={screenSharingStream} /> : null}
    </React.Fragment>
  );
};

export default SwitchToScreenSharingButton;
