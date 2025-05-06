export interface ConnectedUser {
  identity: string;
  id: string;
  socketId: string;
  roomId: string;
  onlyAudio: boolean;
}

export interface Room {
  connectedUsers: ConnectedUser[];
  id: string;
}
