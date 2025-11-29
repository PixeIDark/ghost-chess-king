import type { Cell, Square as SquareType } from "./types/chess.ts";

interface SquareProps {
  position: SquareType;
  cell: Cell;
}

function Square({ position, cell }: SquareProps) {
  const text = cell?.type ?? "빈칸";

  return (
    <button onClick={() => onSquareClick(position)} type="button">
      {text}
    </button>
  );
}

export default Square;
