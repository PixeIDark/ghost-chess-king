import type { Piece } from "../../constants/board.ts";

const colors = {
  white: "bg-white text-black",
  black: "bg-black text-white",
  none: "",
};

interface SquareProps {
  square: Piece | null;
  onSquareClick: (row: number, col: number) => void;
  rowIndex: number;
  colIndex: number;
}

function Square({ square, onSquareClick, rowIndex, colIndex }: SquareProps) {
  const type = square?.type ?? null;
  const color = colors[square?.color ?? "none"];

  return (
    <button
      className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center border border-blue-200 ${color}`}
      type="button"
      onClick={() => onSquareClick(rowIndex, colIndex)}
    >
      <p>{type}</p>
    </button>
  );
}

export default Square;
