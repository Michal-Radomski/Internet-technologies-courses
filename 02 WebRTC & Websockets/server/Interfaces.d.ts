export interface ConnectedUser {
  name: string;
  id: string;
}

export interface Room {
  connectedUsers: ConnectedUser[];
  name: string;
  id: string;
}
