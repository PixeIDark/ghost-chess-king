import { useState } from "react";
import { type GameResult, type GameStatus, getGameState } from "../utils/gameState.ts";
import { useGameTimer } from "./useGameTimer.ts";
import { initialBoard } from "../constants/board.ts";
import type { Board } from "../types/chess.ts";
import { UNDO_COUNT } from "../constants/game.ts";

export const useGameState = (isReadyToPlay: boolean) => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [winner, setWinner] = useState<GameResult>(null);
  const [status, setStatus] = useState<GameStatus>("in_progress");
  const [undoCount, setUndoCount] = useState(UNDO_COUNT);
  const [chessHistory, setChessHistory] = useState<Board[]>([initialBoard]);

  const onTimeOut = (losingColor: "white" | "black") => {
    const winnerColor = losingColor === "white" ? "black" : "white";
    setWinner(winnerColor);
    setStatus("timeout");
  };

  const { whiteTime, blackTime, addTime, resetTime } = useGameTimer(currentTurn, isReadyToPlay, onTimeOut);

  const proceedToNextTurn = (newBoard: Board) => {
    const nextTurn = currentTurn === "white" ? "black" : "white";
    const { winner: nextWinner, status: nextStatus } = getGameState(newBoard, nextTurn);

    addTime(currentTurn);
    setChessHistory((prev) => [...prev, newBoard]);
    setBoard(newBoard);
    setWinner(nextWinner);
    setStatus(nextStatus);
    setCurrentTurn(nextTurn);
  };

  const loadPreviousBoard = (): void => {
    const previousIndex = chessHistory.length - 3;
    if (previousIndex < 0) return;

    setBoard(chessHistory[previousIndex]);
    setChessHistory(chessHistory.slice(0, -2));
    setUndoCount((prev) => prev - 1);
  };

  const resetGame = (): void => {
    setBoard(initialBoard);
    setCurrentTurn("white");
    setWinner(null);
    setStatus("in_progress");
    setChessHistory([initialBoard]);
    setUndoCount(UNDO_COUNT);
    resetTime();
  };

  return {
    board,
    currentTurn,
    winner,
    status,
    whiteTime,
    blackTime,
    undoCount,
    proceedToNextTurn,
    loadPreviousBoard,
    resetGame,
  };
};
