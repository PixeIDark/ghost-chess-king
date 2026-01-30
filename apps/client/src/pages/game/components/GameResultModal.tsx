import { GameResultViewModel } from "@/viewModel/gameResult";

interface GameResultProps {
  gameResult: GameResultViewModel;
  onClose: () => void;
}

function GameResultModal({ gameResult, onClose }: GameResultProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-in fade-in zoom-in-95 mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-2 text-center text-3xl font-bold tracking-tight text-neutral-900">{gameResult.title}</div>
        <div className="mb-8 text-center text-neutral-500">{gameResult.description}</div>
        <button
          onClick={onClose}
          type="button"
          className="w-full rounded-xl bg-neutral-800 py-3 font-medium text-white shadow-sm transition-all hover:bg-neutral-700 active:scale-[0.98]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default GameResultModal;
