import { GameOverData, Side, MatchResultType } from "@ghost-chess-king/shared";

type Title = "Draw" | "Win" | "Lose";

type MatchOutcome = "win" | "lose" | "draw";

export interface GameResultViewModel {
  title: Title;
  description: string;
}

const titleText = {
  win: "Win",
  lose: "Lose",
  draw: "Draw",
} as const satisfies Record<MatchOutcome, Title>;

const reasonText = {
  CHECKMATE: "The game ended by checkmate",
  TIMEOUT: "The game ended by timeout",
  STALEMATE: "The game ended in a stalemate",
  RESIGNATION: "The game ended by resignation",
  DRAW_AGREEMENT: "The game ended by mutual agreement",
  INSUFFICIENT_MATERIAL: "The game ended due to insufficient material",
  THREEFOLD_REPETITION: "The game ended by threefold repetition",
  PLAYING: "The game is still in progress",
  CHECK: "The king is in check",
} as const satisfies Record<MatchResultType, string>;

const getMatchOutcome = (winner: Side | "draw" | undefined, mySide: Side): MatchOutcome => {
  if (winner === "draw") return "draw";
  if (winner === mySide) return "win";
  return "lose";
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
