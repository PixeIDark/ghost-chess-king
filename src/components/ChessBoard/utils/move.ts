import type { Board } from "../../../constants/board.ts";

export const movePiece = (board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number): Board => {
  const newBoard = structuredClone(board);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;

  return newBoard;
};
