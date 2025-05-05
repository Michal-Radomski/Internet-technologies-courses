const Actions = {
  SET_IS_ROOM_HOST: "SET_IS_ROOM_HOST",
  SET_CONNECT_ONLY_WITH_AUDIO: "SET_CONNECT_ONLY_WITH_AUDIO",
  SET_IDENTITY: "SET_IDENTITY",
  SET_ROOM_ID: "SET_ROOM_ID",
  SET_SHOW_OVERLAY: "SET_SHOW_OVERLAY",
  SET_PARTICIPANTS: "SET_PARTICIPANTS",
  SET_MESSAGES: "SET_MESSAGES",
  SET_ACTIVE_CONVERSATION: "SET_ACTIVE_CONVERSATION",
  SET_DIRECT_CHAT_HISTORY: "SET_DIRECT_CHAT_HISTORY",
  SET_SOCKET_ID: "SET_SOCKET_ID",
};

export default Actions;

export const setIsRoomHost = (isRoomHost: boolean) => {
  return {
    type: Actions.SET_IS_ROOM_HOST,
    isRoomHost,
  };
};

export const setConnectOnlyWithAudio = (onlyWithAudio: boolean) => {
  return {
    type: Actions.SET_CONNECT_ONLY_WITH_AUDIO,
    onlyWithAudio,
  };
};

export const setIdentity = (identity: string) => {
  return {
    type: Actions.SET_IDENTITY,
    identity,
  };
};

export const setRoomId = (roomId: string) => {
  return {
    type: Actions.SET_ROOM_ID,
    roomId,
  };
};

// export const setShowOverlay = (showOverlay: any) => {
//   return {
//     type: Actions.SET_SHOW_OVERLAY,
//     showOverlay,
//   };
// };

// export const setParticipants = (participants: any) => {
//   return {
//     type: Actions.SET_PARTICIPANTS,
//     participants,
//   };
// };

// export const setMessages = (messages: any) => {
//   return {
//     type: Actions.SET_MESSAGES,
//     messages,
//   };
// };

export const setActiveConversation = (activeConversation: boolean) => {
  return {
    type: Actions.SET_ACTIVE_CONVERSATION,
    activeConversation,
  };
};

// export const setDirectChatHistory = (directChatHistory: any) => {
//   return {
//     type: Actions.SET_DIRECT_CHAT_HISTORY,
//     directChatHistory,
//   };
// };

// export const setSocketId = (socketId: string) => {
//   return {
//     type: Actions.SET_SOCKET_ID,
//     socketId,
//   };
// };
