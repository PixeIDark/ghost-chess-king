import {
  ChatMessage,
  NICKNAME_PREFIXES,
  NICKNAME_PROVINCES,
  NICKNAME_TITLES,
  User,
  UserInfo,
} from "@ghost-chess-king/shared";
import { AppServer } from "@/types/socket";

export class LobbyService {
  private users: Map<string, User> = new Map();

  constructor(private readonly io: AppServer) {}

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
    const province = NICKNAME_PROVINCES[Math.floor(Math.random() * NICKNAME_PROVINCES.length)];
    const prefix = NICKNAME_PREFIXES[Math.floor(Math.random() * NICKNAME_PREFIXES.length)];
    const title = NICKNAME_TITLES[Math.floor(Math.random() * NICKNAME_TITLES.length)];
    const nickname = `${province} ${prefix}${title}`;

    if (Array.from(this.users.values()).some((user) => user.nickname === nickname)) return this.generateNickname();
    else return `${province} ${prefix}${title}`;
  }
}
