import type { Color } from "../constants/board.ts";
import { useState } from "react";

interface SettingSelectorProps {
  onSelectMode: (mode: "solo" | "ai") => void;
  onSelectColor: (color: Color) => void;
}

function SettingSelector({ onSelectMode, onSelectColor }: SettingSelectorProps) {
  const [settingStep, setSettingStep] = useState<"mode" | "color" | "end">("mode");

  if (settingStep === "mode") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">게임 모드 선택</h1>
        <button
          onClick={() => {
            onSelectMode("solo");
            onSelectColor("white");
            setSettingStep("end");
          }}
          className="w-30 cursor-pointer rounded bg-blue-500 py-3 text-white hover:bg-blue-600"
        >
          혼자 두기
        </button>
        <button
          onClick={() => {
            onSelectMode("ai");
            setSettingStep("color");
          }}
          className="w-30 cursor-pointer rounded bg-green-500 py-3 text-white hover:bg-green-600"
        >
          ai와 두기
        </button>
      </div>
    );
  }

  if (settingStep === "color") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-white">색상 선택</h1>
        <button
          onClick={() => onSelectColor("white")}
          className="w-30 cursor-pointer rounded bg-gray-100 py-3 text-black hover:bg-gray-200"
        >
          백(White)
        </button>
        <button
          onClick={() => onSelectColor("black")}
          className="w-30 cursor-pointer rounded bg-black py-3 text-white hover:bg-gray-900"
        >
          흑(Black)
        </button>
      </div>
    );
  }
}

export default SettingSelector;
