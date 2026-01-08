import { useNavigate } from "react-router";
import { useSocket } from "@/contexts/SessionContext";
import { links } from "@/route/routes.constant";
import { GameErrorData, GameStartData } from "@ghost-chess-king/shared";

function LobbyPage() {
  const socket = useSocket();
  const navigate = useNavigate();

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
      <button onClick={handleGameStart} type="button">
        AI Game Start
      </button>
    </div>
  );
}

export default LobbyPage;
