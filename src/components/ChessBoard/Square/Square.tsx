import type { Piece } from "../../../constants/board.ts";

interface SquareProps {
  square: Piece | null;
  onSquareClick: (row: number, col: number) => void;
  rowIndex: number;
  colIndex: number;
  borderState: "selected" | "movable" | "check" | "none";
}

const pieceImages = {
  pawn: {
    white: "/pieces/white_pawn.svg",
    black: "/pieces/black_pawn.svg",
  },
  knight: {
    white: "/pieces/white_knight.svg",
    black: "/pieces/black_knight.svg",
  },
  bishop: {
    white: "/pieces/white_bishop.svg",
    black: "/pieces/black_bishop.svg",
  },
  rook: {
    white: "/pieces/white_rook.svg",
    black: "/pieces/black_rook.svg",
  },
  queen: {
    white: "/pieces/white_queen.svg",
    black: "/pieces/black_queen.svg",
  },
  king: {
    white: "/pieces/white_king.svg",
    black: "/pieces/black_king.svg",
  },
} as const;

const borderClasses: Record<SquareProps["borderState"], string> = {
  selected: "border-4 border-blue-500",
  movable: "border-4 border-green-500",
  check: "border-4 border-red-500",
  none: "",
} as const;

function Square({ square, onSquareClick, rowIndex, colIndex, borderState }: SquareProps) {
  const floorColor = (rowIndex + colIndex) % 2 === 0 ? "bg-amber-800" : "bg-amber-100";
  const piece = square ? pieceImages[square.type][square.color] : null;

  return (
    <button
      className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center text-3xl ${floorColor} ${borderClasses[borderState]}`}
      type="button"
      onClick={() => onSquareClick(rowIndex, colIndex)}
    >
      {piece && <img src={piece} alt={`${square?.color}-${square?.type}`} />}
    </button>
  );
}

export default Square;
