import type { SquareState, BoardViewModel } from "@/types/viewModel";
import { BoardDTO, Position, isSamePosition } from "@ghost-chess-king/shared";

const getSquareState = (isValidMove: boolean, isSelected: boolean, isKingInCheck: boolean): SquareState => {
  if (isSelected) return "selected";
  if (isValidMove) return "moved";
  if (isKingInCheck) return "kingInChecked";

  return "none";
};

export const createBoardViewModel = (
  board: BoardDTO,
  validMoves: Position[],
  fromSquare: Position | null
): BoardViewModel => {
  return board.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const position: Position = { row: rowIndex, col: colIndex };
      const isValidMove = validMoves.some((move) => isSamePosition(move, position));
      const isSelected = fromSquare ? isSamePosition(fromSquare, position) : false;

      return {
        id: `${rowIndex}-${colIndex}`,
        position,
        cell,
        state: getSquareState(isValidMove, isSelected, false),
      };
    });
  });
};
