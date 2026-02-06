import { formatKoreanTime } from "@ghost-chess-king/shared";
import { useLobbyChat } from "@/pages/lobby/components/LobbyChat/hooks/useLobbyChat.ts";
import { useAutoScroll } from "@/hooks/useAutoScroll.ts";
import { useServerStatus } from "@/contexts/SessionContext";

function LobbyChat() {
  const { isConnected, isRegistered } = useServerStatus();
  const { messages, inputMessage, sendMessage, handleKeyDown, handleChangeInputMessage } = useLobbyChat();
  const messagesEndRef = useAutoScroll(messages);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">메시지가 없습니다</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li key={`${msg.odId}-${msg.timestamp}-${index}`} className="flex items-start gap-1">
                <div className="text-sm">
                  <span className="mr-1 inline-block text-xs whitespace-nowrap text-gray-500">
                    [{formatKoreanTime(Number(msg.timestamp))}]
                  </span>
                  <span className="mr-1 inline font-semibold whitespace-nowrap text-blue-400">{msg.nickname}:</span>
                  <span className="inline break-all text-gray-300">{msg.message}</span>
                </div>
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
  );
}

export default LobbyChat;
