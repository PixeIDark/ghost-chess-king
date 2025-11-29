export interface User {
  socketId: string;
  nickname: string;
  lastMessageTime: number;
  inGame: boolean;
}

export interface UserInfo {
  socketId: string;
  nickname: string;
  inGame: boolean;
}

export interface ChatMessage {
  nickname: string;
  message: string;
  timestamp: number;
  socketId: string;
}
