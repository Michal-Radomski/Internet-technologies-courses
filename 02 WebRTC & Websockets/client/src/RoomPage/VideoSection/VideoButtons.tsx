import React from "react";
import { connect } from "react-redux";

import CameraButton from "./CameraButton";
import LeaveRoomButton from "./LeaveRoomButton";
import MicButton from "./MicButton";
import SwitchToScreenSharingButton from "./SwitchToScreenSharingButton";
import { RootState } from "../../Interfaces";

const VideoButtons = (props: { connectOnlyWithAudio?: boolean }): JSX.Element => {
  const { connectOnlyWithAudio } = props;

  return (
    <React.Fragment>
      <div className="video_buttons_container">
        <MicButton />
        {!connectOnlyWithAudio ? <CameraButton /> : null}
        <LeaveRoomButton />
        {!connectOnlyWithAudio ? <SwitchToScreenSharingButton /> : null}
      </div>
    </React.Fragment>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(VideoButtons);
