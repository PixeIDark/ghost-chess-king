import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { ChatMessage, ClientToServerEvents, ServerToClientEvents } from "@ghost-chess-king/shared";
import { SocketController } from "@/controller/SocketController";
import { GameService } from "@/service/gameService/GameService";
import { LobbyService } from "@/service/lobbyService/LobbyService";
import { createClient } from "redis";
import { MessageService } from "@/service/chatService/MessageService";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", function (err) {
  throw err;
});
await redis.connect();

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const gameService = new GameService(io);
const lobbyMessageService = new MessageService<ChatMessage>(redis, "lobby", 1000);
const lobbyService = new LobbyService(io, lobbyMessageService);
const socketController = new SocketController(io, gameService, lobbyService);
socketController.init();

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_, res) => {
  res.json({ message: "Chess Server is running" });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중: ${PORT}`);
});
