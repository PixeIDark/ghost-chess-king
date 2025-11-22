import { useState } from "react";
import { type Board } from "../../../constants/board.ts";
import { getValidMoves } from "../utils/moveRule.ts";
import { isSameColor } from "../utils/team.ts";
import { movePiece } from "../utils/move.ts";
import { getActualCoords } from "../utils/boardView.ts";

export type SelectedSquare = { row: number; col: number } | null;

export const useChessBoard = (
  board: Board,
  playerColor: "white" | "black",
  currentTurn: "white" | "black",
  updateGameState: (newBoard: Board) => void
) => {
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const handleSquareClick = (displayRow: number, displayCol: number) => {
    if (currentTurn !== playerColor) return;

    const [actualRow, actualCol] = getActualCoords(displayRow, displayCol, playerColor);

    if (selectedSquare === null && board[actualRow][actualCol]?.color === playerColor) {
      setSelectedSquare({ row: actualRow, col: actualCol });
      setValidMoves(getValidMoves(board, actualRow, actualCol));
      return;
    }

    if (selectedSquare === null) return;

    const { row: fromRow, col: fromCol } = selectedSquare;
    const isValidMove = validMoves.some(([r, c]) => r === actualRow && c === actualCol);
    const clickedPiece = board[actualRow][actualCol];
    const selectedPiece = board[fromRow][fromCol];

    if (isSameColor(clickedPiece, selectedPiece) || !isValidMove) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const newBoard = movePiece(board, fromRow, fromCol, actualRow, actualCol);
    setSelectedSquare(null);
    setValidMoves([]);
    updateGameState(newBoard);
  };

  return { selectedSquare, validMoves, handleSquareClick };
};
