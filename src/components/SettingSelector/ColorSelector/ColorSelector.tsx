interface ColorSelector {
  onSelectWhite: () => void;
  onSelectBlack: () => void;
}

function ColorSelector({ onSelectWhite, onSelectBlack }: ColorSelector) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-white">색상 선택</h1>
      <button
        onClick={onSelectWhite}
        className="w-30 cursor-pointer rounded bg-gray-100 py-3 text-black hover:bg-gray-200"
      >
        백(White)
      </button>
      <button
        onClick={onSelectBlack}
        className="w-30 cursor-pointer rounded bg-black py-3 text-white hover:bg-gray-900"
      >
        흑(Black)
      </button>
    </div>
  );
}

export default ColorSelector;
