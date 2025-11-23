import { pieceImages, type PieceType } from "../constants/board.ts";

interface PromotionModalProps {
  onPromote: (type: PieceType) => void;
  color: "white" | "black";
}

const promotablePieces = {
  queen: "퀸",
  rook: "룩",
  bishop: "비숍",
  knight: "나이트",
} as const ;

function PromotionModal({ onPromote, color }: PromotionModalProps) {
  const pieces = Object.keys(promotablePieces) as (keyof typeof promotablePieces)[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-2xl border border-amber-500 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-100">
          어떤 기물로 승격할까요?
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onPromote(piece)}
              className="group relative overflow-hidden rounded-xl border border-transparent bg-gradient-to-br from-slate-600 to-slate-700 p-6 transition hover:border-amber-400 hover:from-slate-500 hover:to-slate-600"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={pieceImages[piece][color]}
                    alt={`${color} ${piece}`}
                    className="h-16 w-16 transition group-hover:scale-110"
                  />
                </div>
                <p className="font-semibold text-gray-200 group-hover:text-amber-300">
                  {promotablePieces[piece]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromotionModal;