import React from "react";

const LeaveRoomButton = (): JSX.Element => {
  const handleRoomDisconnection = (): void => {
    const siteUrl = window.location.origin;
    window.location.href = siteUrl;
  };

  return (
    <React.Fragment>
      <div className="video_button_container">
        <button className="video_button_end" onClick={handleRoomDisconnection}>
          Leave Room
        </button>
      </div>
    </React.Fragment>
  );
};

export default LeaveRoomButton;
