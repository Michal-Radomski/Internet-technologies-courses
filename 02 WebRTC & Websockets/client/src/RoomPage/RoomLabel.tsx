import React from "react";

const RoomLabel = ({ roomId }: { roomId: string }): JSX.Element => {
  return (
    <React.Fragment>
      <div className="room_label">
        <p className="room_label_paragraph">ID: {roomId} </p>
      </div>
    </React.Fragment>
  );
};

export default RoomLabel;
