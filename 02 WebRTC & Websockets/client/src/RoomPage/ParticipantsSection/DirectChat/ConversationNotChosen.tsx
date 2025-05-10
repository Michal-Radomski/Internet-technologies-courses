import React from "react";

const ConversationNotChosen = (): JSX.Element => {
  return (
    <React.Fragment>
      <div className="conversation_not_chosen_overlay">
        <p className="conversation_not_chosen_overlay_text">Conversation not chosen</p>
      </div>
    </React.Fragment>
  );
};

export default ConversationNotChosen;
