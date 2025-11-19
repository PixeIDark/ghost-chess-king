import type { Piece } from "./constants/board.ts";

interface CellProps {
  square: Piece | null;
  move: (row: number, col: number) => void;
  rowIndex: number;
  colIndex: number;
}

const colors = {
  white: "bg-white text-black",
  black: "bg-black text-white",
  none: "",
};

function Cell({ square, move, rowIndex, colIndex }: CellProps) {
  const type = square?.type ?? null;
  const color = colors[square?.color ?? "none"];

  return (
    <button
      className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center border border-blue-200 ${color}`}
      type="button"
      onClick={() => move(rowIndex, colIndex)}
    >
      <p>{type}</p>
    </button>
  );
}

export default Cell;
