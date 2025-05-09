import React from "react";

import SendMessageButton from "../../resources/images/sendMessageButton.svg";
import * as webRTCHandler from "../../utils/webRTCHandler";

const NewMessage = (): JSX.Element => {
  const [message, setMessage] = React.useState<string>("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();

      // Send message to other users
      sendMessage();
    }
  };

  const sendMessage = (): void => {
    if (message.length > 0) {
      webRTCHandler.sendMessageUsingDataChannel(message);
      setMessage("");
    }
  };

  return (
    <React.Fragment>
      <div className="new_message_container">
        <input
          className="new_message_input"
          value={message}
          onChange={handleTextChange}
          placeholder="Type your message ..."
          type="text"
          onKeyDown={handleKeyPressed}
        />
        <img className="new_message_button" src={SendMessageButton} onClick={sendMessage} />
      </div>
    </React.Fragment>
  );
};

export default NewMessage;
