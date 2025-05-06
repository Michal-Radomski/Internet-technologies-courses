import React from "react";
import { connect } from "react-redux";

import ChatSection from "./ChatSection/ChatSection";
import ParticipantsSection from "./ParticipantsSection/ParticipantsSection";
import VideoSection from "./VideoSection/VideoSection";
import RoomLabel from "./RoomLabel";
import Overlay from "./Overlay";
import * as webRTCHandler from "../utils/webRTCHandler";
import "./RoomPage.scss";
import { RootState } from "../Interfaces";

interface Props {
  roomId?: string;
  identity?: string;
  isRoomHost?: boolean;
  showOverlay?: boolean;
  connectOnlyWithAudio?: boolean;
}

const RoomPage = ({ roomId, identity, isRoomHost, showOverlay, connectOnlyWithAudio }: Props): JSX.Element => {
  console.log({ identity, connectOnlyWithAudio });

  React.useEffect(() => {
    if (!isRoomHost && !roomId) {
      const siteUrl = window.location.origin;
      window.location.href = siteUrl;
    } else {
      webRTCHandler.getLocalPreviewAndInitRoomConnection(
        isRoomHost as boolean,
        identity as string,
        roomId as string,
        connectOnlyWithAudio as boolean
      );
    }
  }, [connectOnlyWithAudio, identity, isRoomHost, roomId]);

  return (
    <div className="room_container">
      <ParticipantsSection />
      <VideoSection />
      <ChatSection />
      <RoomLabel roomId={roomId as string} />
      {showOverlay ? <Overlay /> : null}
    </div>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(RoomPage);
