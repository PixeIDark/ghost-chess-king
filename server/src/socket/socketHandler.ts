import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GameService } from "../service/GameService.ts";
import { LobbyService } from "../service/LobbyService.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

export function setupSocketHandlers(io: Server<ClientToServerEvents, ServerToClientEvents>) {
  const lobbyService = new LobbyService(io);
  const gameService = new GameService(io);

  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    socket.on("register", ({ odId }) => {
      const existingUser = lobbyService.getUser(odId);

      if (existingUser) {
        lobbyService.updateSocketId(odId, socket.id);
        gameService.updateSocketId(odId, socket.id);

        socket.emit("registered", {
          odId,
          nickname: existingUser.nickname,
          currentRoomId: existingUser.currentRoomId,
        });

        if (existingUser.currentRoomId) {
          const restoreData = gameService.getGameStateForRestore(existingUser.currentRoomId, odId);
          if (restoreData) {
            socket.join(existingUser.currentRoomId);
            socket.emit("game-restored", {
              roomId: existingUser.currentRoomId,
              yourSide: restoreData.yourSide,
              gameState: restoreData.gameState,
            });
          } else {
            lobbyService.setInGame(odId, false, null);
          }
        }
      } else {
        const user = lobbyService.addUser(odId, socket.id);
        gameService.updateSocketId(odId, socket.id);

        socket.emit("registered", {
          odId,
          nickname: user.nickname,
          currentRoomId: null,
        });
      }

      socket.emit("userList", lobbyService.getUserList());
    });

    socket.on("lobbyMessage", (message) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;
      lobbyService.handleChatMessage(user.odId, message);
    });

    socket.on("challenge-player", (targetOdId: string) => {
      const challenger = lobbyService.getUserBySocketId(socket.id);
      const target = lobbyService.getUser(targetOdId);

      if (!challenger || !target) {
        socket.emit("error", { message: "Not found Enemy" });
        return;
      }

      if (challenger.inGame || target.inGame) {
        socket.emit("error", { message: "Already running game" });
        return;
      }

      const isWhite = Math.random() < 0.5;
      const whiteOdId = isWhite ? challenger.odId : targetOdId;
      const blackOdId = isWhite ? targetOdId : challenger.odId;
      const roomId = uuidv4();

      gameService.createRoom(roomId, whiteOdId, blackOdId, "pvp");

      socket.join(roomId);
      io.sockets.sockets.get(target.socketId)?.join(roomId);

      lobbyService.setInGame(challenger.odId, true, roomId);
      lobbyService.setInGame(targetOdId, true, roomId);

      socket.emit("game-start", {
        roomId,
        mode: "pvp",
        whitePlayer: lobbyService.getUser(whiteOdId)?.nickname,
        blackPlayer: lobbyService.getUser(blackOdId)?.nickname,
        yourSide: challenger.odId === whiteOdId ? "white" : "black",
      });

      io.to(target.socketId).emit("game-start", {
        roomId,
        mode: "pvp",
        whitePlayer: lobbyService.getUser(whiteOdId)?.nickname,
        blackPlayer: lobbyService.getUser(blackOdId)?.nickname,
        yourSide: targetOdId === whiteOdId ? "white" : "black",
      });
    });

    socket.on("start-ai-game", () => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      if (user.inGame && user.currentRoomId) {
        socket.emit("error", {
          message: "Already running game",
          roomId: user.currentRoomId,
        });
        return;
      }

      if (user.inGame) {
        socket.emit("error", { message: "Already running game" });
        return;
      }

      const roomId = uuidv4();
      const isWhite = Math.random() < 0.5;

      gameService.createRoom(roomId, isWhite ? user.odId : "AI", isWhite ? "AI" : user.odId, "ai");

      socket.join(roomId);
      lobbyService.setInGame(user.odId, true, roomId);

      socket.emit("game-start", {
        roomId,
        mode: "ai",
        yourSide: isWhite ? "white" : "black",
      });

      gameService.sendGameState(roomId, socket.id);
    });

    socket.on("reconnect-game", () => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user || !user.currentRoomId) {
        socket.emit("game-not-found");
        return;
      }

      const restoreData = gameService.getGameStateForRestore(user.currentRoomId, user.odId);
      if (restoreData) {
        socket.join(user.currentRoomId);
        socket.emit("game-restored", {
          roomId: user.currentRoomId,
          yourSide: restoreData.yourSide,
          gameState: restoreData.gameState,
        });
      } else {
        lobbyService.setInGame(user.odId, false, null);
        socket.emit("game-not-found");
      }
    });

    socket.on("get-valid-moves", ({ roomId, from }) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      const validMoves = gameService.getValidMoves(roomId, user.odId, from);
      socket.emit("valid-moves", { from, moves: validMoves });
    });

    socket.on("move", ({ roomId, from, to }) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      const success = gameService.makeMove(roomId, user.odId, from, to);
      if (!success) socket.emit("invalid-move", { from, to });
    });

    socket.on("rejoin-game", ({ roomId }) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      const restoreData = gameService.getGameStateForRestore(roomId, user.odId);
      if (!restoreData) {
        socket.emit("game-not-found");
        return;
      }

      socket.join(roomId);
      lobbyService.setInGame(user.odId, true, roomId);
      socket.emit("game-restored", {
        roomId,
        yourSide: restoreData.yourSide,
        gameState: restoreData.gameState,
      });
    });

    socket.on("resign", ({ roomId }) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      gameService.resign(roomId, user.odId);
      lobbyService.setInGame(user.odId, false, null);
    });

    socket.on("leave-game", ({ roomId }) => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      lobbyService.setInGame(user.odId, false, null);
      gameService.leaveRoom(roomId, user.odId);
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      const user = lobbyService.getUserBySocketId(socket.id);
      if (!user) return;

      setTimeout(
        () => {
          const currentUser = lobbyService.getUser(user.odId);
          if (currentUser && currentUser.socketId === socket.id) {
            if (currentUser.currentRoomId) {
              gameService.leaveRoom(currentUser.currentRoomId, user.odId);
            }
            lobbyService.removeUser(user.odId);
            gameService.removeSocketId(user.odId);
          }
        },
        5 * 60 * 1000
      );
    });
  });
}
