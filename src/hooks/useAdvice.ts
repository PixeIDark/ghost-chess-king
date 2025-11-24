import { useState } from "react";
import { parseMove } from "../utils/coordinate.ts";
import { boardToFen } from "../utils/fen.ts";
import { useStockfish } from "./useStockfish.ts";
import { getActualCoords } from "../utils/boardUtils.ts";
import { HIGH_ADVICE_COUNT, LOW_ADVICE_COUNT, MID_ADVICE_COUNT } from "../constants/game.ts";
import type { Board, Color } from "../types/chess.ts";

export type Advice = {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
} | null;

export const useAdvice = (playerColor: Color | null, currentTurn: Color, board: Board) => {
  const [advisors, setAdvisors] = useState({
    lowAdvisor: LOW_ADVICE_COUNT,
    midAdvisor: MID_ADVICE_COUNT,
    highAdvisor: HIGH_ADVICE_COUNT,
  });
  const [advice, setAdvice] = useState<Advice>(null);
  const [hasReceivedAdvice, setHasReceivedAdvice] = useState(false);
  const { isReady, getBestMove } = useStockfish();

  const adviceMap = {
    lowAdvisor: () => getAdviceMove(3),
    midAdvisor: () => getAdviceMove(13),
    highAdvisor: () => getAdviceMove(20),
  };

  const getAdviceMove = async (level: number) => {
    if (!isReady || !playerColor) return;
    const fen = boardToFen(board, playerColor);

    return getBestMove(fen, level);
  };

  const handleRequestAdvice = async (advisor: keyof typeof adviceMap) => {
    if (playerColor !== currentTurn || hasReceivedAdvice) return;

    const advisorCount = advisors[advisor];
    if (advisorCount < 1) return;

    const moveStr = await adviceMap[advisor]();
    if (!moveStr || moveStr.length < 4) return;

    setAdvisors({ ...advisors, [advisor]: advisorCount - 1 });
    setHasReceivedAdvice(true);

    let { fromRow, fromCol, toRow, toCol } = parseMove(moveStr);

    const castleMapping: Record<number, number> = {
      6: 7,
      2: 0,
    };
    const piece = board[fromRow][fromCol];
    if (piece?.type === "king" && Math.abs(fromCol - toCol) === 2) toCol = castleMapping[toCol] ?? toCol;

    [fromRow, fromCol] = getActualCoords(fromRow, fromCol, playerColor);
    [toRow, toCol] = getActualCoords(toRow, toCol, playerColor);
    setAdvice({ fromRow, fromCol, toRow, toCol });
  };

  const resetAdvice = () => {
    setAdvice(null);
    setHasReceivedAdvice(false);
  };

  const resetAdvisorChance = () => {
    setAdvisors({ lowAdvisor: LOW_ADVICE_COUNT, midAdvisor: MID_ADVICE_COUNT, highAdvisor: HIGH_ADVICE_COUNT });
  };

  return { advice, advisors, handleRequestAdvice, resetAdvice, resetAdvisorChance };
};
