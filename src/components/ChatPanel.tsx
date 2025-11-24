import { useState, useRef, useEffect } from "react";
import { type LobbyMessage } from "../hooks/useSocket.ts";

interface ChatPanelProps {
  nickname: string;
  lobbyMessages: LobbyMessage[];
  sendLobbyMessage: (message: string) => void;
}

function ChatPanel({ nickname, lobbyMessages, sendLobbyMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lobbyMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    sendLobbyMessage(inputValue);
    setInputValue("");
  };

  const processedMessages = lobbyMessages.map((msg) => ({
    isOwn: msg.nickname === nickname,
    timestamp: new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    nickname: msg.nickname,
    message: msg.message,
  }));

  return (
    <div className="fixed top-0 right-0 bottom-0 flex w-80 flex-col border-l border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl">
      <div className="border-b border-gray-700 bg-gray-800 p-4">
        <h2 className="text-lg font-bold text-gray-100">채팅</h2>
        <p className="mt-1 text-xs text-gray-400">
          닉네임: <span className="text-blue-300">{nickname}</span>
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {processedMessages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-gray-500">채팅을 시작해보세요</div>
        ) : (
          processedMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              <div>
                {!msg.isOwn && <p className="mb-1 text-xs text-gray-400">{msg.nickname}</p>}
                <div
                  className={`rounded-lg px-4 py-2 text-sm ${
                    msg.isOwn ? "rounded-br-none bg-blue-600 text-white" : "rounded-bl-none bg-gray-700 text-gray-100"
                  }`}
                >
                  {msg.message}
                </div>
                <p className={`mt-1 text-xs text-gray-500 ${msg.isOwn ? "text-right" : ""}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
