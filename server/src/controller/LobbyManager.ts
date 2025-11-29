import { Server } from "socket.io";
import { ChatMessage, User, UserInfo } from "../types/lobby.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

export class LobbyManager {
  private users: Map<string, User> = new Map();
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(io: Server) {
    this.io = io;
  }

  addUser(socketId: string): User {
    const nickname = this.generateNickname();
    const user: User = {
      socketId,
      nickname,
      lastMessageTime: Date.now(),
      inGame: false,
    };

    this.users.set(socketId, user);
    this.io.emit("userConnected", { nickname, totalUsers: this.users.size });
    this.broadcastUserList();

    return user;
  }

  removeUser(socketId: string): void {
    const user = this.users.get(socketId);
    if (!user) return;

    this.users.delete(socketId);
    this.io.emit("userDisconnected", { totalUsers: this.users.size });
    this.broadcastUserList();
  }

  getUser(socketId: string): User | undefined {
    return this.users.get(socketId);
  }

  getUserList(): UserInfo[] {
    return Array.from(this.users.values()).map((u) => ({
      socketId: u.socketId,
      nickname: u.nickname,
      inGame: u.inGame,
    }));
  }

  setInGame(socketId: string, inGame: boolean): void {
    const user = this.users.get(socketId);
    if (!user) return;

    user.inGame = inGame;
    this.broadcastUserList();
  }

  handleChatMessage(socketId: string, message: string): void {
    const user = this.users.get(socketId);
    if (!user) return;

    const timestamp = Date.now();
    user.lastMessageTime = timestamp;

    const chatData: ChatMessage = {
      nickname: user.nickname,
      message,
      timestamp,
      socketId,
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
