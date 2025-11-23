import { pieceImages, type PieceType } from "../constants/board.ts";

interface PromotionModalProps {
  onPromote: (type: PieceType) => void;
  color: "white" | "black";
}

function PromotionModal({ onPromote, color }: PromotionModalProps) {
  const pieces: PieceType[] = ["queen", "rook", "bishop", "knight"];

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6">
        <p className="text-lg font-bold">폰 승격 선택</p>
        <div className="flex gap-3">
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onPromote(piece)}
              className="flex flex-col items-center gap-2 rounded bg-blue-500 px-4 py-2 transition hover:bg-blue-600"
            >
              <img src={pieceImages[piece][color]} alt={`${color} ${piece}`} className="h-12 w-12" />
              <span className="text-sm font-semibold text-white">{piece.charAt(0).toUpperCase() + piece.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromotionModal;
