import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { GameManager } from "./controller/GameManager.ts";
import { LobbyManager } from "./controller/LobbyManager.ts";
import { ClientToServerEvents, ServerToClientEvents } from "./types/socket.ts";

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

const PORT = Number(process.env.PORT) || 3001;
const lobbyManager = new LobbyManager(io);
const gameManager = new GameManager(io);

io.on("connection", (socket) => {
  const user = lobbyManager.addUser(socket.id);

  socket.emit("nicknameReceived", user.nickname);
  socket.emit("userList", lobbyManager.getUserList());
  socket.on("lobbyMessage", (message) => {
    lobbyManager.handleChatMessage(socket.id, message);
  });
  socket.on("challenge-player", (targetSocketId: string) => {
    const challenger = lobbyManager.getUser(socket.id);
    const target = lobbyManager.getUser(targetSocketId);

    if (!challenger || !target) {
      socket.emit("error", { message: "상대를 찾을 수 없습니다" });
      return;
    }

    if (challenger.inGame || target.inGame) {
      socket.emit("error", { message: "이미 게임 중입니다" });
      return;
    }

    const isWhite = Math.random() < 0.5;
    const whitePlayer = isWhite ? socket.id : targetSocketId;
    const blackPlayer = isWhite ? targetSocketId : socket.id;
    const roomId = uuidv4();

    gameManager.createRoom(roomId, whitePlayer, blackPlayer, "pvp");

    socket.join(roomId);
    io.sockets.sockets.get(targetSocketId)?.join(roomId);

    lobbyManager.setInGame(socket.id, true);
    lobbyManager.setInGame(targetSocketId, true);

    socket.emit("game-start", {
      roomId,
      mode: "pvp",
      whitePlayer: lobbyManager.getUser(whitePlayer)?.nickname,
      blackPlayer: lobbyManager.getUser(blackPlayer)?.nickname,
      yourSide: socket.id === whitePlayer ? "white" : "black",
    });

    io.to(targetSocketId).emit("game-start", {
      roomId,
      mode: "pvp",
      whitePlayer: lobbyManager.getUser(whitePlayer)?.nickname,
      blackPlayer: lobbyManager.getUser(blackPlayer)?.nickname,
      yourSide: targetSocketId === whitePlayer ? "white" : "black",
    });
  });

  socket.on("start-ai-game", () => {
    const user = lobbyManager.getUser(socket.id);
    if (!user) return;

    if (user.inGame) {
      socket.emit("error", { message: "이미 게임 중입니다" });
      return;
    }

    const roomId = uuidv4();
    const isWhite = Math.random() < 0.5;

    gameManager.createRoom(roomId, isWhite ? socket.id : "AI", isWhite ? "AI" : socket.id, "ai");

    socket.join(roomId);
    lobbyManager.setInGame(socket.id, true);

    socket.emit("game-start", {
      roomId,
      mode: "ai",
      yourSide: isWhite ? "white" : "black",
    });
  });

  socket.on("get-valid-moves", ({ roomId, from }) => {
    const validMoves = gameManager.getValidMoves(roomId, socket.id, from);
    socket.emit("valid-moves", { from, moves: validMoves });
  });

  socket.on("move", ({ roomId, from, to }) => {
    const success = gameManager.makeMove(roomId, socket.id, from, to);
    if (!success) socket.emit("invalid-move", { from, to });
  });

  socket.on("rejoin-game", ({ roomId }) => {
    const room = gameManager.getRoomByRoomId(roomId);
    if (!room) {
      socket.emit("game-not-found");
      return;
    }

    socket.join(roomId);
    gameManager.sendGameState(roomId, socket.id);
  });

  socket.on("resign", ({ roomId }) => {
    gameManager.resign(roomId, socket.id);
  });

  socket.on("leave-game", ({ roomId }) => {
    lobbyManager.setInGame(socket.id, false);
    gameManager.leaveRoom(roomId, socket.id);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    const user = lobbyManager.getUser(socket.id);

    const room = gameManager.getRoomBySocketId(socket.id);
    if (room) gameManager.leaveRoom(room.roomId, socket.id);

    lobbyManager.removeUser(socket.id);
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Chess Server is running" });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중: ${PORT}`);
});
