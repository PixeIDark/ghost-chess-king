import type { Board, Cell, Piece } from "../../../types/chess.ts";
import { PIECE_TO_FEN_CHAR } from "../chess.constants.ts";

export const boardToFen = (board: Board, originalFen: string): string => {
  const boardPlacement = boardToBoardPlacement(board);
  const fenParts = originalFen.split(" ");
  fenParts[0] = boardPlacement;
  return fenParts.join(" ");
};

const boardToBoardPlacement = (board: Board): string => {
  return board.map(rankToBoardPlacement).join("/");
};

const rankToBoardPlacement = (rank: Cell[]): string => {
  let result = "";
  let emptyCount = 0;

  for (const cell of rank) {
    if (cell === null) {
      emptyCount++;
      continue;
    }

    if (emptyCount > 0) result += emptyCount;
    emptyCount = 0;
    result += pieceToFenChar(cell);
  }

  if (emptyCount > 0) result += emptyCount;
  return result;
};

const pieceToFenChar = (piece: Piece): string => {
  const char = PIECE_TO_FEN_CHAR[piece.type];
  return piece.color === "white" ? char.toUpperCase() : char;
};
