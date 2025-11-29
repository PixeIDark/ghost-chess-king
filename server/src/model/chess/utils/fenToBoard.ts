import type { Board, Cell, Piece, Side } from "../../../types/chess.ts";
import { FEN_CHAR_TO_PIECE } from "../chess.constants.ts";

export const fenToBoard = (fen: string): Board => {
  const ranks = fen.split(" ")[0].split("/");
  return ranks.map(parseRank);
};

const parseRank = (rank: string): Cell[] => {
  const row: Cell[] = [];

  for (const char of rank) {
    if (!isNaN(Number(char))) row.push(...Array(Number(char)).fill(null));
    else row.push(createPiece(char));
  }

  return row;
};

const createPiece = (char: string): Piece => {
  return {
    type: FEN_CHAR_TO_PIECE[
      char.toLowerCase() as keyof typeof FEN_CHAR_TO_PIECE
    ],
    color: getColorFromChar(char),
  };
};

const getColorFromChar = (char: string): Side => {
  if (char === char.toUpperCase()) return "white";
  return "black";
};
