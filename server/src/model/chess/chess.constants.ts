export const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const BOARD_SIZE = 8;

export const FEN_CHAR_TO_PIECE = {
  p: "pawn",
  n: "knight",
  r: "rook",
  b: "bishop",
  q: "queen",
  k: "king",
} as const;

export const PIECE_TO_FEN_CHAR = {
  pawn: "p",
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
  king: "k",
} as const;
