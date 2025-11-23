interface RetractButtonProps {
  undoCount: number;
  onLoadBoard: () => void;
}

function RetractButton({ undoCount, onLoadBoard }: RetractButtonProps) {
  return (
    <button
      onClick={onLoadBoard}
      disabled={undoCount === 0}
      className={`w-full rounded-lg px-6 py-4 font-semibold text-white transition ${
        undoCount > 0
          ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 cursor-pointer"
          : "bg-gray-600 cursor-not-allowed opacity-50"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div>
          <p className="text-sm">한 수 무르기</p>
          <p className="text-xs opacity-75">{undoCount}회 남음</p>
        </div>
      </div>
    </button>
  );
}

export default RetractButton;