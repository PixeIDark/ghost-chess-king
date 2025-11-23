import { useState } from "react";
import type {Color} from "../constants/board.ts";

interface GameResultModalProps {
  winner: "white" | "black" | "draw";
  playerColor: Color;
  status: string;
  onResetGame: () => void;
}

const resultMessages = {
  win: {
    emoji: "🏆",
    title: "당신이 승리했습니다!",
    color: "text-amber-300",
  },
  lose: {
    emoji: "💀",
    title: "당신이 패배했습니다!",
    color: "text-red-400",
  },
  draw: {
    emoji: "🤝",
    title: "무승부입니다!",
    color: "text-blue-300",
  },
} as const;

function GameResultModal({ winner, playerColor, status, onResetGame }: GameResultModalProps) {
  const [closeModal, setCloseModal] = useState(false);

  let resultType: "win" | "lose" | "draw";
  if (winner === "draw") resultType = "draw";
  else resultType = winner === playerColor ? "win" : "lose";

  const result = resultMessages[resultType];

  if (closeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[280px] rounded-2xl border border-amber-500 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="mb-2 text-4xl font-bold">{result.emoji}</p>
          <p className={`text-2xl font-bold ${result.color}`}>
            {result.title}
          </p>
          <p className="mt-3 text-sm text-amber-200">{status}</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={onResetGame}
            className="w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-amber-400"
          >
            새 게임 시작
          </button>
          <button
            onClick={() => setCloseModal(true)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 font-semibold text-gray-100 transition hover:bg-gray-600"
          >
            대기하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameResultModal;