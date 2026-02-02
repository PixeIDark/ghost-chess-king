import { useNavigate } from "react-router";
import { useServerStatus, useSocket } from "@/contexts/SessionContext.tsx";
import { GameErrorData, GameStartData } from "@ghost-chess-king/shared";
import { links } from "@/route/routes.constant.ts";

function LobbyGameStart() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { isConnected, isRegistered } = useServerStatus();

  const handleGameStart = () => {
    socket.once("game-start", (data: GameStartData) => navigate(links.ai(data.roomId)));
    socket.once("error", (data: GameErrorData) => {
      if (data.roomId) navigate(links.ai(data.roomId));
      else console.error("Duplicated game error");
    });

    socket.emit("start-ai-game");
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <button
        disabled={!isRegistered || !isConnected}
        className="cursor-alias rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
        onClick={handleGameStart}
        type="button"
      >
        AI 게임 시작
      </button>
    </div>
  );
}

export default LobbyGameStart;
