import { useNavigate } from "react-router";
import { useServerStatus, useSocket } from "@/contexts/SessionContext";
import { links } from "@/route/routes.constant";
import { GameErrorData, GameStartData } from "@ghost-chess-king/shared";

function LobbyPage() {
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
    <div>
      <button
        disabled={!isRegistered || !isConnected}
        className="cursor-alias text-green-400 disabled:cursor-text disabled:text-black"
        onClick={handleGameStart}
        type="button"
      >
        AI Game Start
      </button>
    </div>
  );
}

export default LobbyPage;
