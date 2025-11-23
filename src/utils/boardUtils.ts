import type { Board, Color } from "../constants/board.ts";

export const getDisplayBoard = (board: Board, playerColor: Color): Board => {
  if (playerColor === "black") return board.map((row) => [...row].reverse()).reverse();
  else return board;
};

export const getActualCoords = (displayRow: number, displayCol: number, playerColor: Color): [number, number] => {
  if (playerColor === "black") return [7 - displayRow, 7 - displayCol];
  else return [displayRow, displayCol];
};
