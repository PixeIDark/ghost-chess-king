import { findPiece } from "./pieceUtils.ts";
import { canPieceMove, isKingInCheck } from "./legalityChecker.ts";
import type { Board, Color } from "../types/chess.ts";

export type GameResult = "white" | "black" | "draw" | null;
export type GameStatus = "checkmate" | "stalemate" | "check" | "in_progress" | "insufficient_material" | "timeout";

interface GameState {
  winner: GameResult;
  status: GameStatus;
  reason: string;
}

export const getGameState = (board: Board, currentTurn: Color): GameState => {
  const whiteKingExists = findPiece(board, "white", "king") !== null;
  const blackKingExists = findPiece(board, "black", "king") !== null;
  const isCheck = isKingInCheck(board, currentTurn);
  const hasMove = canPieceMove(board, currentTurn);
  let state: GameStatus = "in_progress";

  if (!whiteKingExists || !blackKingExists) state = "checkmate";
  else if (isCheck && !hasMove) state = "checkmate";
  else if (!isCheck && !hasMove) state = "stalemate";
  else if (isCheck) state = "check";

  const gameState: Record<GameStatus, GameState> = {
    checkmate: {
      winner: currentTurn === "white" ? "black" : "white",
      status: "checkmate",
      reason: `${currentTurn} is checkmated`,
    },
    stalemate: {
      winner: "draw",
      status: "stalemate",
      reason: `${currentTurn} is stalemated`,
    },
    check: {
      winner: null,
      status: "check",
      reason: `${currentTurn} is in check`,
    },
    in_progress: {
      winner: null,
      status: "in_progress",
      reason: "Game continues",
    },
    insufficient_material: {
      winner: "draw",
      status: "insufficient_material",
      reason: "Insufficient material",
    },
    timeout: {
      winner: currentTurn === "white" ? "black" : "white",
      status: "timeout",
      reason: "Timeout",
    },
  };

  return gameState[state];
};
