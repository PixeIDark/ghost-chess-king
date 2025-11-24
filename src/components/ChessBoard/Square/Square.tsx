import { borderClasses, indicatorConfig } from "./Square.constants.ts";
import { pieceImages } from "../../../constants/images.ts";
import type { Square as SquareType } from "../../../types/chess.ts";

interface SquareProps {
  square: SquareType;
  onSquareClick: (row: number, col: number) => void;
  rowIndex: number;
  colIndex: number;
  borderState: "advisedFrom" | "advisedTo" | "selected" | "movable" | "checked" | "none";
}

function Square({ square, onSquareClick, rowIndex, colIndex, borderState }: SquareProps) {
  const backgroundColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-amber-800 hover:bg-amber-700" : "bg-amber-100 hover:bg-amber-50";
  const pieceImage = square ? pieceImages[square.type][square.color] : null;
  const indicator = indicatorConfig[borderState];

  return (
    <div className="relative">
      <button
        className={`group relative flex h-16 w-16 cursor-pointer flex-col items-center justify-center transition ${backgroundColor} ${borderClasses[borderState]}`}
        type="button"
        onClick={() => onSquareClick(rowIndex, colIndex)}
      >
        {pieceImage && (
          <img
            src={pieceImage}
            alt={`${square?.color}-${square?.type}`}
            className="h-12 w-12 transition group-hover:scale-110"
          />
        )}
      </button>
      {indicator && (
        <div
          className={`absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full ${indicator.bg} text-xs font-bold text-white shadow-lg`}
        >
          <p className="text-[10px]">{indicator.text}</p>
        </div>
      )}
    </div>
  );
}

export default Square;
