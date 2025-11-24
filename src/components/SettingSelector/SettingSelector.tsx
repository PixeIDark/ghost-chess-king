import { useState } from "react";
import { ModeSelector } from "./ModeSelector";
import { ColorSelector } from "./ColorSelector";
import type { Color } from "../../types/chess.ts";

interface SettingSelectorProps {
  onSelectMode: (mode: "solo" | "ai") => void;
  onSelectColor: (color: Color) => void;
}

function SettingSelector({ onSelectMode, onSelectColor }: SettingSelectorProps) {
  const [settingStep, setSettingStep] = useState<"mode" | "color" | "end">("mode");

  if (settingStep === "mode")
    return (
      <ModeSelector
        onSelectSolo={() => {
          onSelectMode("solo");
          onSelectColor("white");
          setSettingStep("end");
        }}
        onSelectAI={() => {
          onSelectMode("ai");
          setSettingStep("color");
        }}
      />
    );
  if (settingStep === "color")
    return <ColorSelector onSelectWhite={() => onSelectColor("white")} onSelectBlack={() => onSelectColor("black")} />;
}

export default SettingSelector;
