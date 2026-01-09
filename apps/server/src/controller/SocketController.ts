import { v4 as uuidv4 } from "uuid";
import { LobbyService } from "@/service/LobbyService";
import { GameService } from "@/service/GameService";
import {
    RegisterData,
    GetValidMovesData,
    MoveData,
    ResignData,
    LeaveGameData,
    RejoinGameData,
} from "@ghost-chess-king/shared";
import { AppServer, ServerSocket } from "@/types/socket";

export class SocketController {
    constructor(
        private readonly io: AppServer,
        private readonly gameService: GameService,
        private readonly lobbyService: LobbyService
    ) {}

    public init() {
        this.io.on("connection", (socket: ServerSocket) => {
            this.setupEventListeners(socket);
        });
    }

    private setupEventListeners(socket: ServerSocket) {
        socket.on("register", (data) => this.handleRegister(socket, data));
        socket.on("lobbyMessage", (message) => this.handleLobbyMessage(socket, message));
        socket.on("challenge-player", (targetOdId) => this.handleChallenge(socket, targetOdId));
        socket.on("start-ai-game", () => this.handleStartAiGame(socket));
        socket.on("reconnect-game", () => this.handleReconnect(socket));
        socket.on("rejoin-game", (data) => this.handleRejoin(socket, data));
        socket.on("get-valid-moves", (data) => this.handleGetValidMoves(socket, data));
        socket.on("move", (data) => this.handleMove(socket, data));
        socket.on("resign", (data) => this.handleResign(socket, data));
        socket.on("leave-game", (data) => this.handleLeaveGame(socket, data));
        socket.on("disconnect", () => this.handleDisconnect(socket));
    }

    private handleRegister(socket: ServerSocket, { odId }: RegisterData) {
        const existingUser = this.lobbyService.getUser(odId);

        if (existingUser) {
            this.lobbyService.updateSocketId(odId, socket.id);
            this.gameService.updateSocketId(odId, socket.id);

            socket.emit("registered", {
                odId,
                nickname: existingUser.nickname,
                currentRoomId: existingUser.currentRoomId,
            });

            if (existingUser.currentRoomId) {
                const restoreData = this.gameService.getGameStateForRestore(existingUser.currentRoomId, odId);
                if (restoreData) {
                    socket.join(existingUser.currentRoomId);
                    socket.emit("game-restored", {
                        roomId: existingUser.currentRoomId,
                        yourSide: restoreData.yourSide,
                        gameState: restoreData.gameState,
                    });
                } else {
                    this.lobbyService.setInGame(odId, false, null);
                }
            }
        } else {
            const user = this.lobbyService.addUser(odId, socket.id);
            this.gameService.updateSocketId(odId, socket.id);
            socket.emit("registered", { odId, nickname: user.nickname, currentRoomId: null });
        }
        socket.emit("userList", this.lobbyService.getUserList());
    }

    private handleLobbyMessage(socket: ServerSocket, message: string) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;
        this.lobbyService.handleChatMessage(user.odId, message);
    }

    private handleChallenge(socket: ServerSocket, targetOdId: string) {
        const challenger = this.lobbyService.getUserBySocketId(socket.id);
        const target = this.lobbyService.getUser(targetOdId);

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

        this.gameService.createRoom(roomId, whiteOdId, blackOdId, "pvp");
        socket.join(roomId);
        this.io.sockets.sockets.get(target.socketId)?.join(roomId);

        this.lobbyService.setInGame(challenger.odId, true, roomId);
        this.lobbyService.setInGame(targetOdId, true, roomId);

        socket.emit("game-start", {
            roomId,
            mode: "pvp",
            whitePlayer: this.lobbyService.getUser(whiteOdId)?.nickname || "",
            blackPlayer: this.lobbyService.getUser(blackOdId)?.nickname || "",
            yourSide: challenger.odId === whiteOdId ? "white" : "black",
        });

        this.io.to(target.socketId).emit("game-start", {
            roomId,
            mode: "pvp",
            whitePlayer: this.lobbyService.getUser(whiteOdId)?.nickname || "",
            blackPlayer: this.lobbyService.getUser(blackOdId)?.nickname || "",
            yourSide: targetOdId === whiteOdId ? "white" : "black",
        });
    }

    private handleStartAiGame(socket: ServerSocket) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        if (user.inGame) {
            socket.emit("error", { message: "Already running game", roomId: user.currentRoomId ?? undefined });
            return;
        }

        const roomId = uuidv4();
        const isWhite = Math.random() < 0.5;

        this.gameService.createRoom(roomId, isWhite ? user.odId : "AI", isWhite ? "AI" : user.odId, "ai");
        socket.join(roomId);
        this.lobbyService.setInGame(user.odId, true, roomId);

        socket.emit("game-start", {
            roomId,
            mode: "ai",
            yourSide: isWhite ? "white" : "black",
        });

        this.gameService.sendGameState(roomId, socket.id);
    }

    private handleReconnect(socket: ServerSocket) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user || !user.currentRoomId) {
            socket.emit("game-not-found");
            return;
        }

        const restoreData = this.gameService.getGameStateForRestore(user.currentRoomId, user.odId);
        if (restoreData) {
            socket.join(user.currentRoomId);
            socket.emit("game-restored", {
                roomId: user.currentRoomId,
                yourSide: restoreData.yourSide,
                gameState: restoreData.gameState,
            });
        } else {
            this.lobbyService.setInGame(user.odId, false, null);
            socket.emit("game-not-found");
        }
    }

    private handleRejoin(socket: ServerSocket, { roomId }: RejoinGameData) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        const restoreData = this.gameService.getGameStateForRestore(roomId, user.odId);
        if (!restoreData) {
            socket.emit("game-not-found");
            return;
        }

        socket.join(roomId);
        this.lobbyService.setInGame(user.odId, true, roomId);
        socket.emit("game-restored", {
            roomId,
            yourSide: restoreData.yourSide,
            gameState: restoreData.gameState,
        });
    }

    private handleGetValidMoves(socket: ServerSocket, { roomId, from }: GetValidMovesData) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        const validMoves = this.gameService.getValidMoves(roomId, user.odId, from);
        socket.emit("valid-moves", { from, moves: validMoves });
    }

    private handleMove(socket: ServerSocket, { roomId, from, to }: MoveData) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        const success = this.gameService.makeMove(roomId, user.odId, from, to);
        if (!success) socket.emit("invalid-move", { from, to });
    }

    private handleResign(socket: ServerSocket, { roomId }: ResignData) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        this.gameService.resign(roomId, user.odId);
        this.lobbyService.setInGame(user.odId, false, null);
    }

    private handleLeaveGame(socket: ServerSocket, { roomId }: LeaveGameData) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        this.lobbyService.setInGame(user.odId, false, null);
        this.gameService.leaveRoom(roomId, user.odId);
        socket.leave(roomId);
    }

    private handleDisconnect(socket: ServerSocket) {
        const user = this.lobbyService.getUserBySocketId(socket.id);
        if (!user) return;

        setTimeout(
            () => {
                const currentUser = this.lobbyService.getUser(user.odId);
                if (currentUser && currentUser.socketId === socket.id) {
                    if (currentUser.currentRoomId) {
                        this.gameService.leaveRoom(currentUser.currentRoomId, user.odId);
                    }
                    this.lobbyService.removeUser(user.odId);
                    this.gameService.removeSocketId(user.odId);
                }
            },
            5 * 60 * 1000
        );
    }
}
