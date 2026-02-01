import { Cell, Position } from "@ghost-chess-king/shared";

export type SquareState = "selected" | "moved" | "kingInChecked" | "latest" | "none";

export interface SquareViewModel {
  id: string;
  position: Position;
  cell: Cell;
  state: SquareState;
}

export type BoardViewModel = SquareViewModel[][];
