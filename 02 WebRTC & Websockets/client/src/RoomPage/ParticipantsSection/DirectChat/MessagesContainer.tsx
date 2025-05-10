import React from "react";

import { Message } from "../../../Interfaces";

const SingleMessage = ({ isAuthor, messageContent }: { isAuthor: boolean; messageContent: string }): JSX.Element => {
  const messageStyling = isAuthor ? "author_direct_message" : "receiver_direct_message";

  const containerStyling = isAuthor ? "direct_message_container_author" : "direct_message_container_receiver";

  return (
    <React.Fragment>
      <div className={containerStyling}>
        <p className={messageStyling}>{messageContent}</p>
      </div>
    </React.Fragment>
  );
};

const MessagesContainer = ({ messages }: { messages: Message[] }): JSX.Element => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <React.Fragment>
      <div className="direct_messages_container">
        {messages?.map((message: Message) => {
          return (
            <SingleMessage
              messageContent={message.messageContent as string}
              isAuthor={message.isAuthor as boolean}
              key={`${message.messageContent}-${message.identity}`}
            />
          );
        })}
        <div ref={scrollRef}></div>
      </div>
    </React.Fragment>
  );
};

export default MessagesContainer;
