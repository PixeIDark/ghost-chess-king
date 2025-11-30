import { useEffect } from "react";
import { useStockfish } from "./useStockfish.ts";
import { delay } from "../utils/helper.ts";
import type { Square as SquareType } from "../types/chess.ts";

interface UseAiOptions {
  fen: string;
  currentTurn: "white" | "black";
  aiSide: "white" | "black";
  onAiMove: (from: SquareType, to: SquareType) => void;
  depth?: number;
}

export const useAi = ({ fen, currentTurn, aiSide, onAiMove, depth }: UseAiOptions) => {
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
