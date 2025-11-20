interface ColorSelectorProps {
  onColorSelect: (color: "white" | "black") => void;
}

function ColorSelector({ onColorSelect }: ColorSelectorProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-center text-lg font-bold">색깔을 선택하세요</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => onColorSelect("white")} className="rounded bg-blue-500 px-6 py-3 text-white">
          백(플레이어)
        </button>
        <button onClick={() => onColorSelect("black")} className="rounded bg-gray-600 px-6 py-3 text-white">
          흑(플레이어)
        </button>
      </div>
    </div>
  );
}

export default ColorSelector;
