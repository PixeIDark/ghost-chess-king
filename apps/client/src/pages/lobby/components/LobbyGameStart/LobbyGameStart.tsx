import { useServerStatus, useSocket } from "@/contexts/SessionContext.tsx";

function LobbyGameStart() {
  const socket = useSocket();
  const { isConnected, isRegistered } = useServerStatus();

  const handleAiGameStart = () => {
    socket.emit("start-ai-game");
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <button
        disabled={!isRegistered || !isConnected}
        className="cursor-alias rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
        onClick={handleAiGameStart}
        type="button"
      >
        AI 게임 시작
      </button>
    </div>
  );
}

export default LobbyGameStart;
