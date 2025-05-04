import React from "react";

const JoinRoomTitle = ({ isRoomHost }: { isRoomHost: boolean }): JSX.Element => {
  const titleText: string = isRoomHost ? "Host meeting" : "Join meeting";

  return (
    <React.Fragment>
      <p className="join_room_title">{titleText}</p>
    </React.Fragment>
  );
};

export default JoinRoomTitle;
