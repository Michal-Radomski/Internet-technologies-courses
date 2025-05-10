import React from "react";
import { connect } from "react-redux";

import MessagesContainer from "./MessagesContainer";
import NewMessage from "./NewMessage";
import ConversationNotChosen from "./ConversationNotChosen";
import DirectChatHeader from "./DirectChatHeader";
import { Message, RootState } from "../../../Interfaces";

interface DirectChatHistory {
  chatHistory: Message[];
  socketId: string;
}

interface ActiveConversation {
  socketId?: string;
  identity?: string;
}

const getDirectChatHistory = (directChatHistory: DirectChatHistory[], socketId: string | null = null): Message[] => {
  console.log("directChatHistory:", directChatHistory);
  console.log("socketId:", socketId);
  if (!socketId || !directChatHistory) {
    return [];
  }

  const history = directChatHistory.find((h: DirectChatHistory) => h.socketId === socketId) as DirectChatHistory;

  return history ? history.chatHistory : [];
};

const DirectChat = ({
  activeConversation,
  directChatHistory,
}: {
  activeConversation?: ActiveConversation;
  directChatHistory?: DirectChatHistory[];
}): JSX.Element => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    setMessages(
      getDirectChatHistory(directChatHistory as DirectChatHistory[], activeConversation ? activeConversation.socketId : null)
    );
  }, [activeConversation, directChatHistory]);

  return (
    <React.Fragment>
      <div className="direct_chat_container">
        <DirectChatHeader activeConversation={activeConversation as { identity?: string }} />
        <MessagesContainer messages={messages} />
        <NewMessage />
        {!activeConversation ? <ConversationNotChosen /> : null}
      </div>
    </React.Fragment>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(DirectChat);
