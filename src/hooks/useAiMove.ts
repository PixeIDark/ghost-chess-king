import { useEffect } from "react";
import { useStockfish } from "./useStockfish.ts";
import { boardToFen } from "../utils/fen.ts";
import { movePiece } from "../components/ChessBoard/utils/movePiece.ts";
import { parseMove } from "../utils/coordinate.ts";
import type { Board, Color, GameMode, PieceType, PlayerColor } from "../types/chess.ts";

const promotedPieces: Record<string, PieceType> = {
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
};

export const useAIMove = (
  board: Board,
  currentTurn: Color,
  playerColor: PlayerColor,
  gameMode: GameMode,
  onBoardChange: (newBoard: Board) => void
) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (gameMode !== "ai" || !isReady || playerColor === null || currentTurn === playerColor) return;

    const timer = setTimeout(async () => {
      const fen = boardToFen(board, currentTurn);
      const bestMove = await getBestMove(fen, 20);

      if (bestMove.length < 4) return;

      const moveStr = bestMove.substring(0, 4);
      const { fromRow, fromCol, toRow, toCol } = parseMove(moveStr);
      const newBoard = movePiece(board, fromRow, fromCol, toRow, toCol);

      if (bestMove.length === 5 && newBoard[toRow][toCol]) newBoard[toRow][toCol]!.type = promotedPieces[bestMove[4]];

      onBoardChange(newBoard);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentTurn, isReady, playerColor, gameMode, board]);
};
