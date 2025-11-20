import type { Piece, PieceType } from "../constants/board.ts";

export const boardToFen = (board: (Piece | null)[][], currentTurn: "white" | "black" = "white"): string => {
  const pieceToChar: { [key in PieceType]: string } = {
    pawn: "p",
    rook: "r",
    knight: "n",
    bishop: "b",
    queen: "q",
    king: "k",
  };
  let fen = "";

  for (let row = 0; row < board.length; row++) {
    let emptyCount = 0;

    for (let col = 0; col < board[0].length; col++) {
      const square = board[row][col];

      if (square === null) {
        emptyCount++;
        continue;
      }

      if (emptyCount > 0) {
        fen += emptyCount;
        emptyCount = 0;
      }

      const char = pieceToChar[square.type];
      const symbol = square.color === "white" ? char.toUpperCase() : char.toLowerCase();
      fen += symbol;
    }

    if (emptyCount > 0) fen += emptyCount;

    if (row < 7) fen += "/";
  }

  const turn = currentTurn === "white" ? "w" : "b";
  fen += ` ${turn} KQkq - 0 1`;

  return fen;
};
