import React from "react";

import ParticipantsLabel from "./ParticipantsLabel";
import Participants from "./Participants";
import DirectChat from "./DirectChat/DirectChat";

const ParticipantsSection = (): JSX.Element => {
  return (
    <React.Fragment>
      <div className="participants_section_container">
        <ParticipantsLabel />
        <Participants />
        <DirectChat />
      </div>
    </React.Fragment>
  );
};

export default ParticipantsSection;
