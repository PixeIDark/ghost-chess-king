import { useEffect } from "react";
import { type Board } from "../constants/board.ts";
import { useStockfish } from "./useStockfish.ts";
import { boardToFen } from "../utils/fen.ts";
import { movePiece } from "../components/ChessBoard/move.ts";
import { parseMove } from "../utils/coordinate.ts";

export const useAIMove = (
  board: Board,
  currentTurn: "white" | "black",
  playerColor: "white" | "black" | null,
  onBoardChange: (newBoard: Board) => void
) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!isReady || playerColor === null || currentTurn === playerColor) return;

    const timer = setTimeout(async () => {
      const fen = boardToFen(board, currentTurn);
      const bestMove = await getBestMove(fen, 15);

      if (bestMove?.length !== 4) return;

      const { fromRow, fromCol, toRow, toCol } = parseMove(bestMove);
      const newBoard = movePiece(board, fromRow, fromCol, toRow, toCol);
      onBoardChange(newBoard);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentTurn, board, playerColor, isReady, getBestMove, onBoardChange]);
};
