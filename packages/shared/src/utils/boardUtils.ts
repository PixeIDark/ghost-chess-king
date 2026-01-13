import { Position } from "../types";

export function isValidPosition(pos: Position, maxRow: number, maxCol: number): boolean {
  return pos.row >= 0 && pos.row < maxRow && pos.col >= 0 && pos.col < maxCol;
}

export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function getDistance(pos1: Position, pos2: Position): number {
  return Math.max(Math.abs(pos1.row - pos2.row), Math.abs(pos1.col - pos2.col));
}

export function includesPosition(positions: Position[], target: Position): boolean {
  return positions.some((pos) => isSamePosition(pos, target));
}
