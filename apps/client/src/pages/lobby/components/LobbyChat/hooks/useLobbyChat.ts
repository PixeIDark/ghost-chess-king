import { useMessage } from "@/contexts/MessageContext.tsx";
import { ChangeEvent, useRef, useState } from "react";

export function useLobbyChat() {
  const { lobbyMessages, sendLobbyMessage } = useMessage();
  const [inputMessage, setInputMessage] = useState("");
  const lastSentTime = useRef(0);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const now = Date.now();
    if (now - lastSentTime.current < 100) return;

    lastSentTime.current = now;
    sendLobbyMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") sendMessage();
  };

  const handleChangeInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  return { messages: lobbyMessages, inputMessage, sendMessage, handleKeyDown, handleChangeInputMessage };
}
