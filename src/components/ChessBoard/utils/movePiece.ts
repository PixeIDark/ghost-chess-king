import type { Board, King, Piece, Rook } from "../../../types/chess.ts";

const markPieceMoved = (piece: King | Rook): void => {
  piece.hasMoved = true;
};

const handleEnPassant = (board: Board, movingPiece: Piece, fromCol: number, toRow: number, toCol: number): void => {
  if (movingPiece.type === "pawn" && fromCol !== toCol && !board[toRow][toCol]) {
    const captureRow = movingPiece.color === "white" ? toRow + 1 : toRow - 1;
    board[captureRow][toCol] = null;
  }
};

const handleCastling = (
  board: Board,
  movingPiece: Piece,
  fromRow: number,
  fromCol: number,
  toCol: number
): Board | null => {
  if (movingPiece.type === "king") {
    if (fromCol === 4 && toCol === 6) {
      const rook = board[fromRow][7] as Rook;
      if (rook?.type === "rook") {
        board[fromRow][5] = rook;
        markPieceMoved(rook);
        board[fromRow][7] = null;
        board[fromRow][6] = movingPiece as King;
        board[fromRow][fromCol] = null;
        markPieceMoved(movingPiece as King);
        return board;
      }
    }

    if (fromCol === 4 && toCol === 2) {
      const rook = board[fromRow][0] as Rook;
      if (rook?.type === "rook") {
        board[fromRow][3] = rook;
        markPieceMoved(rook);
        board[fromRow][0] = null;
        board[fromRow][2] = movingPiece as King;
        board[fromRow][fromCol] = null;
        markPieceMoved(movingPiece as King);
        return board;
      }
    }
  }

  if (movingPiece.type === "rook") {
    const king = board[fromRow].find((p) => p?.type === "king" && p?.color === movingPiece.color) as King | undefined;
    if (king) {
      const kingCol = board[fromRow].indexOf(king);

      if (fromCol === 7 && toCol === kingCol) {
        board[fromRow][5] = movingPiece as Rook;
        markPieceMoved(movingPiece as Rook);
        board[fromRow][7] = null;
        board[fromRow][6] = king;
        board[fromRow][kingCol] = null;
        markPieceMoved(king);
        return board;
      }

      if (fromCol === 0 && toCol === kingCol) {
        board[fromRow][3] = movingPiece as Rook;
        markPieceMoved(movingPiece as Rook);
        board[fromRow][0] = null;
        board[fromRow][2] = king;
        board[fromRow][kingCol] = null;
        markPieceMoved(king);
        return board;
      }
    }
  }

  return null;
};

const resetEnPassant = (board: Board, movingPiece: Piece): void => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece?.type === "pawn" && piece !== movingPiece) {
        piece.hasEnPassant = false;
      }
    }
  }
};

export const movePiece = (board: Board, fromRow: number, fromCol: number, toRow: number, toCol: number): Board => {
  const newBoard = structuredClone(board);
  const movingPiece = newBoard[fromRow][fromCol];
  if (!movingPiece) return newBoard;

  if (movingPiece.type === "pawn") movingPiece.hasEnPassant = Math.abs(toRow - fromRow) === 2;
  if (movingPiece.type === "king") markPieceMoved(movingPiece as King);
  if (movingPiece.type === "rook") markPieceMoved(movingPiece as Rook);

  handleEnPassant(newBoard, movingPiece, fromCol, toRow, toCol);

  const castlingResult = handleCastling(newBoard, movingPiece, fromRow, fromCol, toCol);
  if (castlingResult) return castlingResult;

  newBoard[toRow][toCol] = movingPiece;
  newBoard[fromRow][fromCol] = null;

  resetEnPassant(newBoard, movingPiece);

  return newBoard;
};
