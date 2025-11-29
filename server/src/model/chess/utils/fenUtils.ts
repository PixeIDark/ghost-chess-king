import type { Cell, Side, Square } from "../../../types/chess.ts";

export const getRanks = (fen: string): string[] => {
  return fen.split(" ")[0].split("/");
};

export const getTurn = (fen: string): Side => {
  if (fen.split(" ")[1] === "w") return "white";
  return "black";
};

export const getCastlingRights = (fen: string): string => {
  return fen.split(" ")[2];
};

export const getEnPassantTarget = (fen: string): string => {
  return fen.split(" ")[3];
};

export const getHalfmoveClock = (fen: string): number => {
  return parseInt(fen.split(" ")[4]);
};

export const getFullmoveNumber = (fen: string): number => {
  return parseInt(fen.split(" ")[5]);
};

export const updateTurn = (fen: string): string => {
  const parts = fen.split(" ");
  parts[1] = parts[1] === "w" ? "b" : "w";

  return parts.join(" ");
};

export const updateCastlingRights = (
  fen: string,
  from: Square,
  piece: Cell,
): string => {
  const parts = fen.split(" ");
  let rights = parts[2];

  if (piece?.type === "king")
    rights =
      piece.color === "white"
        ? rights.replace(/[KQ]/g, "")
        : rights.replace(/[kq]/g, "");

  if (piece?.type === "rook") {
    if (from === "a1") rights = rights.replace("Q", "");
    if (from === "h1") rights = rights.replace("K", "");
    if (from === "a8") rights = rights.replace("q", "");
    if (from === "h8") rights = rights.replace("k", "");
  }

  parts[2] = rights || "-";
  return parts.join(" ");
};

export const updateEnPassantTarget = (
  fen: string,
  from: Square,
  to: Square,
  piece: Cell,
): string => {
  const parts = fen.split(" ");

  if (
    piece?.type === "pawn" &&
    Math.abs(Number(from[1]) - Number(to[1])) === 2
  ) {
    const file = from[0];
    const rank = piece.color === "white" ? "3" : "6";
    parts[3] = `${file}${rank}`;
  } else parts[3] = "-";

  return parts.join(" ");
};

export const updateHalfmoveClock = (
  fen: string,
  piece: Cell,
  captured: boolean,
): string => {
  const parts = fen.split(" ");
  const isPawn = piece?.type === "pawn";
  parts[4] = captured || isPawn ? "0" : String(Number(parts[4]) + 1);

  return parts.join(" ");
};

export const updateFullmoveNumber = (fen: string): string => {
  const parts = fen.split(" ");
  if (parts[1] === "b") parts[5] = String(Number(parts[5]) + 1);

  return parts.join(" ");
};
