import { type Socket } from "socket.io-client";
import type { ClientToServerEvents, GameOverData, ServerToClientEvents } from "../../../types/socket.ts";
import { useEffect, useState } from "react";
import type { GameState } from "../../../types/game.ts";
import type { Side, Square as SquareType } from "../../../types/chess.ts";
import { useAi } from "./useAi.ts";
import { getOppositeSide } from "../../../utils/squareUtils.ts";
import { useUserInfo } from "../../../contexts/SessionContext.tsx";

export const useChessGame = (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  const { currentRoomId, isRegistered } = useUserInfo();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [mySide, setMySide] = useState<Side>("white");
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<SquareType[]>([]);
  const [gameResult, setGameResult] = useState<GameOverData | null>(null);

  useEffect(() => {
    if (!isRegistered) return;

    const handleGameStart = (data: { roomId: string; yourSide: Side }) => {
      setMySide(data.yourSide);
      setRoomId(data.roomId);
      setGameResult(null);
    };

    const handleGameState = (data: GameState) => {
      setGameState(data);
    };

    const handleGameRestored = (data: { roomId: string; yourSide: Side; gameState: GameState }) => {
      setRoomId(data.roomId);
      setMySide(data.yourSide);
      setGameState(data.gameState);
      setGameResult(null);
    };

    const handleGameOver = (data: GameOverData) => {
      setGameResult(data);
    };

    const handleGameNotFound = () => {
      socket.emit("start-ai-game");
    };

    socket.on("game-start", handleGameStart);
    socket.on("game-state", handleGameState);
    socket.on("game-restored", handleGameRestored);
    socket.on("game-over", handleGameOver);
    socket.on("game-not-found", handleGameNotFound);

    if (currentRoomId) socket.emit("reconnect-game");
    else socket.emit("start-ai-game");

    return () => {
      socket.off("game-start", handleGameStart);
      socket.off("game-state", handleGameState);
      socket.off("game-restored", handleGameRestored);
      socket.off("game-over", handleGameOver);
      socket.off("game-not-found", handleGameNotFound);
    };
  }, [socket, isRegistered, currentRoomId]);

  const handleAiMove = (from: SquareType, to: SquareType) => {
    if (!roomId) return;
    socket.emit("move", { roomId, from, to });
  };

  const handleSquareClick = (square: SquareType, selectedColor: Side | undefined) => {
    if (!roomId || gameState?.turn !== mySide || gameResult) return;
    if (!fromSquare && selectedColor !== mySide) return;

    if (!fromSquare) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => setValidMoves(data.moves || []));
      return;
    }

    if (selectedColor === mySide) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => setValidMoves(data.moves || []));
      return;
    }

    if (!validMoves.includes(square)) {
      setFromSquare(null);
      setValidMoves([]);
      return;
    }

    socket.emit("move", { roomId, from: fromSquare, to: square });
    setFromSquare(null);
    setValidMoves([]);
  };

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.turn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 20,
    onAiMove: handleAiMove,
  });

  return {
    gameState,
    mySide,
    roomId,
    gameResult,
    validMoves,
    fromSquare,
    handleSquareClick,
  };
};
