import type { GameOverData } from "../types/socket.ts";
import type { GameEndReason, Side } from "../types/chess.ts";

type Title = "Draw" | "Win" | "Lose";

type MatchOutCome = "win" | "lose" | "draw";

export interface GameResultViewModel {
  title: Title;
  description: (typeof reasonText)[keyof typeof reasonText];
}

const titleText = {
  win: "Win",
  lose: "Lose",
  draw: "Draw",
} as const satisfies Record<MatchOutCome, Title>;

const reasonText = {
  checkmate: "The game ended by checkmate",
  timeout: "The game ended by timeout",
  stalemate: "The game ended in a stalemate",
  resignation: "The game ended by resignation",
} as const satisfies Record<GameEndReason, string>;

const getMatchOutcome = (winner: Side | "draw", mySide: Side) => {
  if (mySide === winner) return "win";
  if (mySide !== winner) return "lose";

  return "draw";
};

export const createGameResultViewModel = (result: GameOverData, mySide: Side): GameResultViewModel => {
  const match = getMatchOutcome(result.winner, mySide);
  const title = titleText[match];
  const description = reasonText[result.reason];

  return {
    title,
    description,
  };
};
