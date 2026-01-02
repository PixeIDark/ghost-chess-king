import type { GameResultViewModel } from "../../../viewModel/gameResult.ts";

interface GameResultProps {
  gameResult: GameResultViewModel;
  onClose: () => void;
}

function GameResultModal({ gameResult, onClose }: GameResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 text-center text-2xl font-bold">{gameResult.title}</div>
        <div className="mb-6 text-center text-gray-600">{gameResult.description}</div>
        <button
          onClick={onClose}
          type="button"
          className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2 text-gray-700 transition hover:bg-gray-200 active:scale-[0.98]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default GameResultModal;
