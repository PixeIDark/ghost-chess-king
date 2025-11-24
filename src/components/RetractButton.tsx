interface RetractButtonProps {
  undoCount: number;
  onLoadBoard: () => void;
}

const getButtonStyle = (undoCount: number): string => {
  if (undoCount > 0)
    return "cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500";
  return "cursor-not-allowed bg-gray-600 opacity-50";
};

function RetractButton({ undoCount, onLoadBoard }: RetractButtonProps) {
  const buttonStyle = getButtonStyle(undoCount);
  const isDisabled = undoCount === 0;

  return (
    <button
      onClick={onLoadBoard}
      disabled={isDisabled}
      className={`w-full rounded-lg px-6 py-4 font-semibold text-white transition ${buttonStyle}`}
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
