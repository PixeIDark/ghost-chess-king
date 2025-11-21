import type { Board, Color, Piece } from "../constants/board.ts";

export type GameResult = "white" | "black" | "draw" | null;
export type GameStatus = "checkmate" | "stalemate" | "check" | "in_progress" | "insufficient_material" | "timeout";

interface GameState {
  winner: GameResult;
  status: GameStatus;
  reason: string;
}

const findKing = (board: Board, color: Color): [number, number] | null => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col]?.type === "king" && board[row][col]?.color === color) {
        return [row, col];
      }
    }
  }
  return null;
};

const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

const isSquareUnderAttack = (board: Board, row: number, col: number, byColor: Color): boolean => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const pawnDirection = byColor === "white" ? -1 : 1;
  for (const dc of [-1, 1]) {
    const newRow = row - pawnDirection;
    const newCol = col + dc;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece?.type === "pawn" && piece.color === byColor) {
        return true;
      }
    }
  }

  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  for (const [dr, dc] of knightMoves) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece?.type === "knight" && piece.color === byColor) {
        return true;
      }
    }
  }

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece?.type === "king" && piece.color === byColor) {
        return true;
      }
    }
  }

  for (const [dr, dc] of directions.slice(1, 5)) {
    let newRow = row + dr;
    let newCol = col + dc;
    while (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece) {
        if ((piece.type === "rook" || piece.type === "queen") && piece.color === byColor) {
          return true;
        }
        break;
      }
      newRow += dr;
      newCol += dc;
    }
  }

  for (const [dr, dc] of [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]) {
    let newRow = row + dr;
    let newCol = col + dc;
    while (isValidPosition(newRow, newCol)) {
      const piece = board[newRow][newCol];
      if (piece) {
        if ((piece.type === "bishop" || piece.type === "queen") && piece.color === byColor) {
          return true;
        }
        break;
      }
      newRow += dr;
      newCol += dc;
    }
  }

  return false;
};

export const isKingInCheck = (board: Board, color: Color): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const enemyColor = color === "white" ? "black" : "white";
  return isSquareUnderAttack(board, kingPos[0], kingPos[1], enemyColor);
};

const hasValidMove = (board: Board, color: Color): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece?.color !== color) continue;

      if (canPieceMove(board, row, col, piece)) {
        return true;
      }
    }
  }
  return false;
};

const canPieceMove = (board: Board, row: number, col: number, piece: Piece): boolean => {
  const moves = getPossibleMoves(board, row, col, piece);
  return moves.length > 0;
};

const getPossibleMoves = (board: Board, row: number, col: number, piece: Piece): Array<[number, number]> => {
  const possibleSquares: Array<[number, number]> = [];
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  if (piece.type === "pawn") {
    const direction = piece.color === "white" ? -1 : 1;
    const newRow = row + direction;
    if (isValidPosition(newRow, col) && !board[newRow][col]) {
      possibleSquares.push([newRow, col]);
    }
  } else if (piece.type === "knight") {
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of knightMoves) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValidPosition(newRow, newCol) && (!board[newRow][newCol] || board[newRow][newCol]?.color !== piece.color)) {
        possibleSquares.push([newRow, newCol]);
      }
    }
  } else if (piece.type === "king") {
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValidPosition(newRow, newCol) && (!board[newRow][newCol] || board[newRow][newCol]?.color !== piece.color)) {
        possibleSquares.push([newRow, newCol]);
      }
    }
  } else if (piece.type === "rook" || piece.type === "queen") {
    const lineDirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dr, dc] of lineDirs) {
      let newRow = row + dr;
      let newCol = col + dc;
      while (isValidPosition(newRow, newCol)) {
        if (!board[newRow][newCol]) {
          possibleSquares.push([newRow, newCol]);
        } else if (board[newRow][newCol]?.color !== piece.color) {
          possibleSquares.push([newRow, newCol]);
          break;
        } else {
          break;
        }
        newRow += dr;
        newCol += dc;
      }
    }
  }

  if (piece.type === "bishop" || piece.type === "queen") {
    const diagDirs = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    for (const [dr, dc] of diagDirs) {
      let newRow = row + dr;
      let newCol = col + dc;
      while (isValidPosition(newRow, newCol)) {
        if (!board[newRow][newCol]) {
          possibleSquares.push([newRow, newCol]);
        } else if (board[newRow][newCol]?.color !== piece.color) {
          possibleSquares.push([newRow, newCol]);
          break;
        } else {
          break;
        }
        newRow += dr;
        newCol += dc;
      }
    }
  }

  return possibleSquares.filter(([newRow, newCol]) => {
    const testBoard = board.map((r) => [...r]);
    testBoard[newRow][newCol] = testBoard[row][col];
    testBoard[row][col] = null;
    return !isKingInCheck(testBoard, piece.color);
  });
};

export const getGameState = (board: Board, currentTurn: Color): GameState => {
  const whiteKingExists = findKing(board, "white") !== null;
  const blackKingExists = findKing(board, "black") !== null;

  if (!whiteKingExists) {
    return {
      winner: "black",
      status: "checkmate",
      reason: "White king captured",
    };
  }

  if (!blackKingExists) {
    return {
      winner: "white",
      status: "checkmate",
      reason: "Black king captured",
    };
  }

  const inCheck = isKingInCheck(board, currentTurn);
  const hasMove = hasValidMove(board, currentTurn);

  if (inCheck && !hasMove) {
    const winner = currentTurn === "white" ? "black" : "white";
    return {
      winner,
      status: "checkmate",
      reason: `${currentTurn} is checkmated`,
    };
  }

  if (!inCheck && !hasMove) {
    return {
      winner: "draw",
      status: "stalemate",
      reason: `${currentTurn} is stalemated`,
    };
  }

  if (inCheck) {
    return {
      winner: null,
      status: "check",
      reason: `${currentTurn} is in check`,
    };
  }

  return {
    winner: null,
    status: "in_progress",
    reason: "Game continues",
  };
};
