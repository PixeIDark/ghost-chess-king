export interface User {
  odId: string;
  socketId: string;
  nickname: string;
  lastMessageTime: number;
  inGame: boolean;
  currentRoomId: string | null;
}

export interface UserInfo {
  odId: string;
  socketId: string;
  nickname: string;
  inGame: boolean;
}

export interface ChatMessage {
  odId: string;
  nickname: string;
  message: string;
  timestamp: number;
}
