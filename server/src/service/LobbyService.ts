import { Server } from "socket.io";
import { ChatMessage, User, UserInfo } from "../types/lobby.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

export class LobbyManager {
  private users: Map<string, User> = new Map(); // odId -> User
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(io: Server) {
    this.io = io;
  }

  addUser(odId: string, socketId: string): User {
    const nickname = this.generateNickname();
    const user: User = {
      odId,
      socketId,
      nickname,
      lastMessageTime: Date.now(),
      inGame: false,
      currentRoomId: null,
    };

    this.users.set(odId, user);
    this.io.emit("userConnected", { nickname, totalUsers: this.users.size });
    this.broadcastUserList();

    return user;
  }

  updateSocketId(odId: string, socketId: string): User | undefined {
    const user = this.users.get(odId);
    if (!user) return undefined;

    user.socketId = socketId;
    return user;
  }

  removeUser(odId: string): void {
    const user = this.users.get(odId);
    if (!user) return;

    this.users.delete(odId);
    this.io.emit("userDisconnected", { totalUsers: this.users.size });
    this.broadcastUserList();
  }

  getUser(odId: string): User | undefined {
    return this.users.get(odId);
  }

  getUserBySocketId(socketId: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.socketId === socketId) return user;
    }
    return undefined;
  }

  getUserList(): UserInfo[] {
    return Array.from(this.users.values()).map((u) => ({
      odId: u.odId,
      socketId: u.socketId,
      nickname: u.nickname,
      inGame: u.inGame,
    }));
  }

  setInGame(odId: string, inGame: boolean, roomId: string | null = null): void {
    const user = this.users.get(odId);
    if (!user) return;

    user.inGame = inGame;
    user.currentRoomId = roomId;
    this.broadcastUserList();
  }

  handleChatMessage(odId: string, message: string): void {
    const user = this.users.get(odId);
    if (!user) return;

    const timestamp = Date.now();
    user.lastMessageTime = timestamp;

    const chatData: ChatMessage = {
      nickname: user.nickname,
      message,
      timestamp,
      odId,
    };

    this.io.emit("lobbyMessage", chatData);
  }

  private broadcastUserList(): void {
    this.io.emit("userList", this.getUserList());
  }

  private generateNickname(): string {
    const adjectives = ["빠른", "영리한", "대담한", "강한", "똑똑한", "용감한"];
    const animals = ["독수리", "호랑이", "사자", "여우", "늑대", "곰"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${animal}${num}`;
  }
}
