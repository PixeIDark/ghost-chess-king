import { type Socket } from "socket.io-client";
import type { ClientToServerEvents, GameOverData, ServerToClientEvents } from "../../../types/socket.ts";
import { useEffect, useState } from "react";
import type { GameState } from "../../../types/game.ts";
import type { Side, Square as SquareType } from "../../../types/chess.ts";
import { useAi } from "./useAi.ts";
import { getOppositeSide } from "../../../utils/squareUtils.ts";

export const useChessGame = (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [mySide, setMySide] = useState<Side>("white");
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<SquareType[]>([]);
  const [gameResult, setGameResult] = useState<GameOverData | null>(null);

  useEffect(() => {
    socket.on("game-start", (data) => {
      console.log("게임 시작:", data);
      setMySide(data.yourSide);
      setRoomId(data.roomId);
    });

    socket.on("game-state", (data) => {
      setGameState(data);
    });

    socket.on("game-over", (data) => {
      setGameResult(data);
    });

    socket.emit("start-ai-game");

    return () => {
      socket.off("game-start");
      socket.off("game-state");
      socket.off("game-over");
    };
  }, [socket]);

  const handleAiMove = (from: SquareType, to: SquareType) => {
    if (!roomId) return;
    socket.emit("move", { roomId, from, to });
  };

  const handleSquareClick = (square: SquareType, selectedColor: Side | undefined) => {
    if (!roomId || gameState?.turn !== mySide) return;
    if (!fromSquare && selectedColor !== mySide) return;

    if (!fromSquare) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => {
        setValidMoves(data.moves || []);
      });
      return;
    }

    if (selectedColor === mySide) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => {
        setValidMoves(data.moves || []);
      });
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
