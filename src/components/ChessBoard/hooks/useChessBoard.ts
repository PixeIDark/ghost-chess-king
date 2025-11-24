import { useState } from "react";
import { movePiece } from "../utils/movePiece.ts";
import { getValidMoves } from "../../../utils/legalityChecker.ts";
import { hasFriendlyPiece } from "../../../utils/squareValidator.ts";
import { getActualCoords } from "../../../utils/boardUtils.ts";
import type { Board } from "../../../types/chess.ts";

export type SelectedSquare = { row: number; col: number } | null;

export const useChessBoard = (
  board: Board,
  playerColor: "white" | "black",
  currentTurn: "white" | "black",
  onUpdateGameState: (newBoard: Board) => void,
  gameMode: "solo" | "ai" | null
) => {
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const handleSquareClick = (displayRow: number, displayCol: number) => {
    if (gameMode === "ai" && currentTurn !== playerColor) return;

    const [row, col] = getActualCoords(displayRow, displayCol, playerColor);

    const clickedPiece = board[row][col];

    if (!selectedSquare && clickedPiece?.color === currentTurn) {
      setSelectedSquare({ row, col });
      setValidMoves(getValidMoves(board, row, col, currentTurn));
      return;
    }

    if (!selectedSquare) return;

    const { row: fromRow, col: fromCol } = selectedSquare;
    const selectedPiece = board[fromRow][fromCol];
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
    const isCastling =
      (selectedPiece?.type === "king" && clickedPiece?.type === "rook") ||
      (selectedPiece?.type === "rook" && clickedPiece?.type === "king");

    if (isCastling && isValidMove) {
      let finalToCol = col;

      if (selectedPiece?.type === "king" && clickedPiece?.type === "rook") {
        if (col === 7) finalToCol = 6;
        if (col === 0) finalToCol = 2;
      }

      const newBoard = movePiece(board, fromRow, fromCol, row, finalToCol);
      setSelectedSquare(null);
      setValidMoves([]);
      onUpdateGameState(newBoard);
      return;
    }

    if (hasFriendlyPiece(board, row, col, currentTurn) || !isValidMove) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const newBoard = movePiece(board, fromRow, fromCol, row, col);
    setSelectedSquare(null);
    setValidMoves([]);
    onUpdateGameState(newBoard);
  };

  return { selectedSquare, validMoves, handleSquareClick };
};
