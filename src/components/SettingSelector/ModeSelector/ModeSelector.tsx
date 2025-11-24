interface ModeSelectorProps {
  onSelectSolo: () => void;
  onSelectAI: () => void;
}

function ModeSelector({ onSelectSolo, onSelectAI }: ModeSelectorProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-white">게임 모드 선택</h1>
      <button
        onClick={onSelectSolo}
        className="w-30 cursor-pointer rounded bg-blue-500 py-3 text-white hover:bg-blue-600"
      >
        혼자 두기
      </button>
      <button
        onClick={onSelectAI}
        className="w-30 cursor-pointer rounded bg-green-500 py-3 text-white hover:bg-green-600"
      >
        ai와 두기
      </button>
    </div>
  );
}

export default ModeSelector;
