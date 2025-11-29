import type { Cell, Square } from "./chess";

export type SquareState = "selected" | "moved" | "kingInChecked" | "none";

export interface SquareViewModel {
  position: Square;
  cell: Cell;
  state: SquareState;
}

export type BoardViewModel = SquareViewModel[][];
