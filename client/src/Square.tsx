import type { Cell, Square as SquareType } from "./types/chess.ts";
import { squareToIndices } from "./utils/squareUtils.ts";

interface SquareProps {
  position: SquareType;
  cell: Cell;
  state: "selected" | "moved" | "kingInChecked" | "none";
  onSquareClick: (position: SquareType) => void;
}

const PIECE_IMAGES = {
  pawn: {
    black: "/pieces/black_pawn.svg",
    white: "/pieces/white_pawn.svg",
  },
  knight: {
    black: "/pieces/black_knight.svg",
    white: "/pieces/white_knight.svg",
  },
  rook: {
    black: "/pieces/black_rook.svg",
    white: "/pieces/white_rook.svg",
  },
  bishop: {
    black: "/pieces/black_bishop.svg",
    white: "/pieces/white_bishop.svg",
  },
  queen: {
    black: "/pieces/black_queen.svg",
    white: "/pieces/white_queen.svg",
  },
  king: {
    black: "/pieces/black_king.svg",
    white: "/pieces/white_king.svg",
  },
} as const;

const SQUARE_STYLES = {
  selected: "ring-4 ring-inset ring-blue-400",
  moved: "ring-4 ring-inset ring-green-400",
  kingInChecked: "ring-4 ring-inset ring-red-400",
  none: "",
} as const;

function Square({ position, cell, state, onSquareClick }: SquareProps) {
  const { row, col } = squareToIndices(position);
  const isLight = (row + col) % 2 === 0;
  const bgColor = isLight ? "bg-amber-50" : "bg-amber-800";

  const squareStyle = SQUARE_STYLES[state];

  return (
    <button
      onClick={() => onSquareClick(position)}
      type="button"
      className={`flex h-full w-full items-center justify-center ${bgColor} ${squareStyle}`}
    >
      {cell && (
        <img
          src={PIECE_IMAGES[cell.type][cell.color]}
          alt={`${cell.color} ${cell.type}`}
          className="h-4/5 w-4/5 object-contain"
        />
      )}
    </button>
  );
}

export default Square;
