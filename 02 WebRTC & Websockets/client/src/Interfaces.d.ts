// Types and Interfaces
import store from "./redux/store";

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export type Fetch = () => RootState;
export type Action = typeof store.action;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectI = { [key: string]: any };

export interface Participant {
  onlyAudio: boolean;
  identity: string;
  socketId: string;
}

export interface Message {
  isAuthor?: boolean;
  messageContent?: string;
  content: string;
  identity?: string;
  messageCreatedByMe: boolean;
  author?: string;
  sameAuthor?: boolean;
}
