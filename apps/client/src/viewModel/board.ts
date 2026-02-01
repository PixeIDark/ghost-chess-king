import type { SquareState, BoardViewModel } from "@/types/viewModel";
import { BoardDTO, Position, isSamePosition } from "@ghost-chess-king/shared";

const getSquareState = (
  isValidMove: boolean,
  isSelected: boolean,
  isKingInCheck: boolean,
  isLatest: boolean
): SquareState => {
  if (isSelected) return "selected";
  if (isValidMove) return "moved";
  if (isKingInCheck) return "kingInChecked";
  if (isLatest) return "latest";

  return "none";
};

export const createBoardViewModel = (
  board: BoardDTO,
  validMoves: Position[],
  fromSquare: Position | null,
  checkPosition: Position | null,
  latestPositions: Position[]
): BoardViewModel => {
  return board.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const position: Position = { row: rowIndex, col: colIndex };
      const isValidMove = validMoves.some((move) => isSamePosition(move, position));
      const isSelected = fromSquare ? isSamePosition(fromSquare, position) : false;
      const isKingInCheck = checkPosition ? isSamePosition(position, checkPosition) : false;
      const isLatest = latestPositions.some((move) => isSamePosition(move, position));

      return {
        id: `${rowIndex}-${colIndex}`,
        position,
        cell,
        state: getSquareState(isValidMove, isSelected, isKingInCheck, isLatest),
      };
    });
  });
};
