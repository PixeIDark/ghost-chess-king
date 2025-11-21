import { useState } from "react";
import { type Board, type Color, initialBoard } from "../constants/board.ts";
import { type GameResult, type GameStatus, getGameState } from "../utils/gameState.ts";
import { useGameTimer } from "./useGameTimer.ts";

export const useGameState = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [winner, setWinner] = useState<GameResult>(null);
  const [status, setStatus] = useState<GameStatus>("in_progress");
  const onTimeOut = (losingColor: Color) => {
    setWinner(losingColor);
    setStatus("timeout");
  };
  const { whiteTime, blackTime, addTime } = useGameTimer(currentTurn, onTimeOut);

  const updateGameState = (newBoard: Board) => {
    if (winner !== null) return;

    const nextTurn = currentTurn === "white" ? "black" : "white";
    const { winner: nextWinner, status: nextStatus } = getGameState(newBoard, nextTurn);

    addTime(currentTurn);
    setBoard(newBoard);
    setWinner(nextWinner);
    setStatus(nextStatus);
    setCurrentTurn(nextTurn);
  };

  return { board, currentTurn, winner, status, whiteTime, blackTime, updateGameState };
};
