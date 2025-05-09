import React from "react";
import { connect } from "react-redux";

import { Message, RootState } from "../../Interfaces";

const MessageComponent = ({ author, content, sameAuthor, messageCreatedByMe }: Message): JSX.Element => {
  const alignClass = messageCreatedByMe ? "message_align_right" : "message_align_left";

  const authorText = messageCreatedByMe ? "You" : author;

  const contentAdditionalStyles = messageCreatedByMe ? "message_right_styles" : "message_left_styles";

  return (
    <React.Fragment>
      <div className={`message_container ${alignClass}`}>
        {!sameAuthor ? <p className="message_title">{authorText}</p> : null}
        <p className={`message_content ${contentAdditionalStyles}`}>{content}</p>
      </div>
    </React.Fragment>
  );
};

const Messages = ({ messages }: { messages?: Message[] }): JSX.Element => {
  return (
    <div className="messages_container">
      {messages?.map((message: Message, index: number): JSX.Element => {
        const sameAuthor: boolean = index > 0 && message.identity === messages[index - 1].identity;

        return (
          <MessageComponent
            key={`${message.content}${index}`}
            author={message.identity}
            content={message.content}
            sameAuthor={sameAuthor}
            messageCreatedByMe={message.messageCreatedByMe}
          />
        );
      })}
    </div>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(Messages);
