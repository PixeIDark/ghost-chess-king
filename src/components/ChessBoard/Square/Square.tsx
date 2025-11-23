import { type Piece, pieceImages } from "../../../constants/board.ts";
import { borderClasses, indicatorConfig } from "./Square.constants.ts";

interface SquareProps {
  square: Piece | null;
  onSquareClick: (row: number, col: number) => void;
  rowIndex: number;
  colIndex: number;
  borderState: "advisedFrom" | "advisedTo" | "selected" | "movable" | "checked" | "none";
}

function Square({ square, onSquareClick, rowIndex, colIndex, borderState }: SquareProps) {
  const backgroundColor = (rowIndex + colIndex) % 2 === 0 ? "bg-amber-800" : "bg-amber-100";
  const pieceImage = square ? pieceImages[square.type][square.color] : null;
  const indicator = indicatorConfig[borderState];

  return (
    <div className="relative">
      <button
        className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center text-3xl ${backgroundColor} ${borderClasses[borderState]}`}
        type="button"
        onClick={() => onSquareClick(rowIndex, colIndex)}
      >
        {pieceImage && <img src={pieceImage} alt={`${square?.color}-${square?.type}`} />}
      </button>
      {indicator && (
        <div
          className={`absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full ${indicator.bg} text-xs font-bold text-white`}
        >
          <p>{indicator.text}</p>
        </div>
      )}
    </div>
  );
}

export default Square;
