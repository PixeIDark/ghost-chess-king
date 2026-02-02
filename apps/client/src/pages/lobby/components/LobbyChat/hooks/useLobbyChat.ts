import { useSocket } from "@/contexts/SessionContext.tsx";
import { ChatMessage } from "@ghost-chess-king/shared";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export function useLobbyChat() {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const lastSentTime = useRef(0);

  useEffect(() => {
    const handleLobbyMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("lobbyMessage", handleLobbyMessage);
    return () => {
      socket.off("lobbyMessage", handleLobbyMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const now = Date.now();
    if (now - lastSentTime.current < 100) return;

    lastSentTime.current = now;
    socket.emit("lobbyMessage", inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") sendMessage();
  };

  const handleChangeInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  return { messages, inputMessage, sendMessage, handleKeyDown, handleChangeInputMessage };
}
