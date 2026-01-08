import type { SquareState, BoardViewModel } from "@/types/viewModel";
import { Cell, indicesToSquare, Square } from "@ghost-chess-king/shared";

const getSquareState = (isValidMove: boolean, isSelected: boolean, isKingInCheck: boolean): SquareState => {
  if (isSelected) return "selected";
  if (isValidMove) return "moved";
  if (isKingInCheck) return "kingInChecked";

  return "none";
};

export const createBoardViewModel = (
  board: (Cell | null)[][],
  validMoves: Square[],
  fromSquare: Square | null
): BoardViewModel => {
  return board.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const position = indicesToSquare(rowIndex, colIndex);
      const isValidMove = validMoves.includes(position);
      const isSelected = fromSquare === position;

      return {
        position,
        cell,
        state: getSquareState(isValidMove, isSelected, false),
      };
    });
  });
};
