import { useEffect } from "react";
import { useStockfish } from "../../../hooks/useStockfish.ts";
import { delay } from "../../../utils/helper.ts";
import type { Square as SquareType } from "../../../types/chess.ts";

interface UseAiParams {
  fen: string;
  currentTurn: "white" | "black";
  aiSide: "white" | "black";
  depth?: number;
  onAiMove: (from: SquareType, to: SquareType) => void;
}

export const useAi = ({ fen, currentTurn, aiSide, depth, onAiMove }: UseAiParams) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!isReady || currentTurn !== aiSide || !fen) return;

    let cancelled = false;

    (async () => {
      try {
        await delay(1000);
        const bestMove = await getBestMove(fen, depth);
        const from = bestMove.slice(0, 2) as SquareType;
        const to = bestMove.slice(2, 4) as SquareType;

        if (!cancelled) onAiMove(from, to);
      } catch (err) {
        console.error("AI move error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getBestMove, onAiMove, fen, currentTurn, aiSide, isReady, depth]);
};
