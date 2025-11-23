import type { Piece, PieceType } from "../constants/board.ts";

const calculateCastlingRights = (board: (Piece | null)[][]): string => {
  let rights = "";
  const whiteKing = board[7][4];
  const whiteRookKingside = board[7][7];
  const whiteRookQueenside = board[7][0];
  const blackKing = board[0][4];
  const blackRookKingside = board[0][7];
  const blackRookQueenside = board[0][0];

  if (
    whiteKing?.type === "king" &&
    !whiteKing.hasMoved &&
    whiteRookKingside?.type === "rook" &&
    !whiteRookKingside.hasMoved
  ) {
    rights += "K";
  }

  if (
    whiteKing?.type === "king" &&
    !whiteKing.hasMoved &&
    whiteRookQueenside?.type === "rook" &&
    !whiteRookQueenside.hasMoved
  ) {
    rights += "Q";
  }

  if (
    blackKing?.type === "king" &&
    !blackKing.hasMoved &&
    blackRookKingside?.type === "rook" &&
    !blackRookKingside.hasMoved
  ) {
    rights += "k";
  }

  if (
    blackKing?.type === "king" &&
    !blackKing.hasMoved &&
    blackRookQueenside?.type === "rook" &&
    !blackRookQueenside.hasMoved
  ) {
    rights += "q";
  }

  return rights || "-";
};

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

  let enPassantSquare = "-";

  const searchRow = currentTurn === "white" ? 3 : 4;

  for (let col = 0; col < 8; col++) {
    const pawn = board[searchRow][col];
    if (pawn?.type === "pawn" && pawn?.hasEnPassant && pawn?.color !== currentTurn) {
      const enPassantTargetRow = currentTurn === "white" ? "6" : "3";
      enPassantSquare = String.fromCharCode(97 + col) + enPassantTargetRow;
      break;
    }
  }

  const castlingRights = calculateCastlingRights(board);
  const turn = currentTurn === "white" ? "w" : "b";
  fen += ` ${turn} ${castlingRights} ${enPassantSquare} 0 1`;

  return fen;
};
