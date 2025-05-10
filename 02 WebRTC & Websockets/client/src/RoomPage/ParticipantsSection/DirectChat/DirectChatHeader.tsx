import React from "react";

const DirectChatHeader = ({ activeConversation }: { activeConversation: { identity?: string } }): JSX.Element => {
  return (
    <React.Fragment>
      <div className="direct_chat_header">
        <p className="direct_chat_header_paragraph">{activeConversation ? activeConversation?.identity : ""}</p>
      </div>
    </React.Fragment>
  );
};

export default DirectChatHeader;
