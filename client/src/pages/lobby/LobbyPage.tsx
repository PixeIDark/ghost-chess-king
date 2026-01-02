import { useNavigate } from "react-router";
import { links } from "../../route/routes.constant.ts";
import { useSocket } from "../../contexts/SessionContext.tsx";

function LobbyPage() {
  const socket = useSocket();
  const navigate = useNavigate();

  const handleGameStart = () => {
    socket.once("game-start", (data) => navigate(links.ai(data.roomId)));
    socket.once("error", (data) => {
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
