import type { PromotionPieceName } from "@ghost-chess-king/shared";

interface PromotionModalProps {
  onSelectPromotion: (selectedPiece: PromotionPieceName) => void;
  isOpen: boolean;
  color: "white" | "black";
}

const promotionPieces: PromotionPieceName[] = ["queen", "rook", "bishop", "knight"];

function PromotionModal({ onSelectPromotion, isOpen, color }: PromotionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-lg font-semibold">Select Promotion</h2>
        <div className="flex justify-center gap-4">
          {promotionPieces.map((piece) => (
            <button
              type="button"
              key={piece}
              onClick={() => onSelectPromotion(piece)}
              className="rounded-lg bg-gray-100 p-4 hover:bg-gray-200"
            >
              <img src={`/pieces/${color}_${piece}.svg`} alt={piece} className="h-12 w-12" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromotionModal;
