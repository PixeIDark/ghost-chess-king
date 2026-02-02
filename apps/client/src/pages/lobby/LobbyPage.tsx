import { useNavigate } from "react-router";
import { useServerStatus, useSocket } from "@/contexts/SessionContext";
import { links } from "@/route/routes.constant";
import { formatKoreanTime, GameErrorData, GameStartData } from "@ghost-chess-king/shared";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useLobbyUsers } from "@/pages/lobby/hooks/useLobbyUsers.ts";
import { useLobbyChat } from "@/pages/lobby/hooks/useLobbyChat.ts";

function LobbyPage() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { isConnected, isRegistered } = useServerStatus();
  const { messages, inputMessage, sendMessage, handleKeyDown, handleChangeInputMessage } = useLobbyChat();
  const users = useLobbyUsers();
  const messagesEndRef = useAutoScroll(messages);

  const handleGameStart = () => {
    socket.once("game-start", (data: GameStartData) => navigate(links.ai(data.roomId)));
    socket.once("error", (data: GameErrorData) => {
      if (data.roomId) navigate(links.ai(data.roomId));
      else console.error("Duplicated game error");
    });

    socket.emit("start-ai-game");
  };

  return (
    <div className="flex h-full gap-4 p-4">
      <div className="w-64 rounded-lg border border-gray-700 bg-gray-800 p-4">
        <h2 className="mb-4 text-lg font-bold text-white">접속자 ({users.length})</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.odId} className="flex items-center justify-between text-gray-300">
              <span>{user.nickname}</span>
              {user.inGame && <span className="text-xs text-yellow-500">게임중</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-96 flex-1 flex-col gap-4">
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

        <div className="flex flex-1 flex-col rounded-lg border border-gray-700 bg-gray-800">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">메시지가 없습니다</p>
            ) : (
              <ul className="space-y-2">
                {messages.map((msg, index) => (
                  <li key={`${msg.odId}-${msg.timestamp}-${index}`} className="flex items-start gap-1">
                    <h3 className="flex shrink-0 items-center gap-1">
                      <span className="text-xs text-gray-500">[{formatKoreanTime(msg.timestamp)}]</span>
                      <span className="font-semibold text-blue-400">{msg.nickname}:</span>
                    </h3>
                    <span className="break-all text-gray-300">{msg.message}</span>
                  </li>
                ))}
                <div ref={messagesEndRef} />
              </ul>
            )}
          </div>

          <div className="flex gap-2 border-t border-gray-700 p-4">
            <input
              type="text"
              value={inputMessage}
              onChange={handleChangeInputMessage}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={!isRegistered || !isConnected}
              className="flex-1 rounded bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-600"
            />
            <button
              onClick={sendMessage}
              disabled={!isRegistered || !isConnected || !inputMessage.trim()}
              className="cursor-alias rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600"
              type="button"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LobbyPage;
