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
  socket.on("register", ({ odId }) => {
    const existingUser = lobbyManager.getUser(odId);

    if (existingUser) {
      lobbyManager.updateSocketId(odId, socket.id);
      gameManager.updateSocketId(odId, socket.id);

      socket.emit("registered", {
        odId,
        nickname: existingUser.nickname,
        currentRoomId: existingUser.currentRoomId,
      });

      if (existingUser.currentRoomId) {
        const restoreData = gameManager.getGameStateForRestore(existingUser.currentRoomId, odId);
        if (restoreData) {
          socket.join(existingUser.currentRoomId);
          socket.emit("game-restored", {
            roomId: existingUser.currentRoomId,
            yourSide: restoreData.yourSide,
            gameState: restoreData.gameState,
          });
        } else {
          lobbyManager.setInGame(odId, false, null);
        }
      }
    } else {
      const user = lobbyManager.addUser(odId, socket.id);
      gameManager.updateSocketId(odId, socket.id);

      socket.emit("registered", {
        odId,
        nickname: user.nickname,
        currentRoomId: null,
      });
    }

    socket.emit("userList", lobbyManager.getUserList());
  });

  socket.on("lobbyMessage", (message) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;
    lobbyManager.handleChatMessage(user.odId, message);
  });

  socket.on("challenge-player", (targetOdId: string) => {
    const challenger = lobbyManager.getUserBySocketId(socket.id);
    const target = lobbyManager.getUser(targetOdId);

    if (!challenger || !target) {
      socket.emit("error", { message: "상대를 찾을 수 없습니다" });
      return;
    }

    if (challenger.inGame || target.inGame) {
      socket.emit("error", { message: "이미 게임 중입니다" });
      return;
    }

    const isWhite = Math.random() < 0.5;
    const whiteOdId = isWhite ? challenger.odId : targetOdId;
    const blackOdId = isWhite ? targetOdId : challenger.odId;
    const roomId = uuidv4();

    gameManager.createRoom(roomId, whiteOdId, blackOdId, "pvp");

    socket.join(roomId);
    io.sockets.sockets.get(target.socketId)?.join(roomId);

    lobbyManager.setInGame(challenger.odId, true, roomId);
    lobbyManager.setInGame(targetOdId, true, roomId);

    socket.emit("game-start", {
      roomId,
      mode: "pvp",
      whitePlayer: lobbyManager.getUser(whiteOdId)?.nickname,
      blackPlayer: lobbyManager.getUser(blackOdId)?.nickname,
      yourSide: challenger.odId === whiteOdId ? "white" : "black",
    });

    io.to(target.socketId).emit("game-start", {
      roomId,
      mode: "pvp",
      whitePlayer: lobbyManager.getUser(whiteOdId)?.nickname,
      blackPlayer: lobbyManager.getUser(blackOdId)?.nickname,
      yourSide: targetOdId === whiteOdId ? "white" : "black",
    });
  });

  socket.on("start-ai-game", () => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    if (user.inGame) {
      socket.emit("error", { message: "이미 게임 중입니다" });
      return;
    }

    const roomId = uuidv4();
    const isWhite = Math.random() < 0.5;

    gameManager.createRoom(roomId, isWhite ? user.odId : "AI", isWhite ? "AI" : user.odId, "ai");

    socket.join(roomId);
    lobbyManager.setInGame(user.odId, true, roomId);

    socket.emit("game-start", {
      roomId,
      mode: "ai",
      yourSide: isWhite ? "white" : "black",
    });

    gameManager.sendGameState(roomId, socket.id);
  });

  socket.on("reconnect-game", () => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user || !user.currentRoomId) {
      socket.emit("game-not-found");
      return;
    }

    const restoreData = gameManager.getGameStateForRestore(user.currentRoomId, user.odId);
    if (restoreData) {
      socket.join(user.currentRoomId);
      socket.emit("game-restored", {
        roomId: user.currentRoomId,
        yourSide: restoreData.yourSide,
        gameState: restoreData.gameState,
      });
    } else {
      lobbyManager.setInGame(user.odId, false, null);
      socket.emit("game-not-found");
    }
  });

  socket.on("get-valid-moves", ({ roomId, from }) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    const validMoves = gameManager.getValidMoves(roomId, user.odId, from);
    socket.emit("valid-moves", { from, moves: validMoves });
  });

  socket.on("move", ({ roomId, from, to }) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    const success = gameManager.makeMove(roomId, user.odId, from, to);
    if (!success) socket.emit("invalid-move", { from, to });
  });

  socket.on("rejoin-game", ({ roomId }) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    const restoreData = gameManager.getGameStateForRestore(roomId, user.odId);
    if (!restoreData) {
      socket.emit("game-not-found");
      return;
    }

    socket.join(roomId);
    lobbyManager.setInGame(user.odId, true, roomId);
    socket.emit("game-restored", {
      roomId,
      yourSide: restoreData.yourSide,
      gameState: restoreData.gameState,
    });
  });

  socket.on("resign", ({ roomId }) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    gameManager.resign(roomId, user.odId);
    lobbyManager.setInGame(user.odId, false, null);
  });

  socket.on("leave-game", ({ roomId }) => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    lobbyManager.setInGame(user.odId, false, null);
    gameManager.leaveRoom(roomId, user.odId);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    const user = lobbyManager.getUserBySocketId(socket.id);
    if (!user) return;

    setTimeout(
      () => {
        const currentUser = lobbyManager.getUser(user.odId);
        if (currentUser && currentUser.socketId === socket.id) {
          if (currentUser.currentRoomId) {
            gameManager.leaveRoom(currentUser.currentRoomId, user.odId);
          }
          lobbyManager.removeUser(user.odId);
          gameManager.removeSocketId(user.odId);
        }
      },
      5 * 60 * 1000
    );
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
