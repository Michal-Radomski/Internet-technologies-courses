import React from "react";
import { connect } from "react-redux";

import sendMessageButton from "../../../resources/images/sendMessageButton.svg";
import * as wss from "../../../utils/wss";
import { RootState } from "../../../Interfaces";

const NewMessage = ({
  activeConversation,
  identity,
}: {
  activeConversation?: { socketId: string };
  identity?: string;
}): JSX.Element => {
  const [message, setMessage] = React.useState<string>("");

  const sendMessage = (): void => {
    wss.sendDirectMessage({
      receiverSocketId: activeConversation!.socketId,
      identity: identity as string,
      messageContent: message,
    });

    setMessage("");
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <React.Fragment>
      <div className="new_message_container new_message_direct_border">
        <input
          className="new_message_input"
          value={message}
          onChange={handleTextChange}
          placeholder="Type your message.."
          type="text"
          onKeyDown={handleKeyPressed}
        />
        <img className="new_message_button" src={sendMessageButton} onClick={sendMessage} />
      </div>
    </React.Fragment>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(NewMessage);
