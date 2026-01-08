import { Cell, Square } from "@ghost-chess-king/shared";

export type SquareState = "selected" | "moved" | "kingInChecked" | "none";

export interface SquareViewModel {
  position: Square;
  cell: Cell;
  state: SquareState;
}

export type BoardViewModel = SquareViewModel[][];
