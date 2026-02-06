import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSocket } from "@/contexts/SessionContext.tsx";
import { ChatMessage } from "@ghost-chess-king/shared";

interface MessageContextValue {
  lobbyMessages: ChatMessage[];
  sendLobbyMessage: (message: string) => void;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const [lobbyMessages, setLobbyMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const handleLobbyMessage = (data: ChatMessage[]) => {
      setLobbyMessages([...data]);
    };

    socket.on("load-lobby-message", handleLobbyMessage);
    return () => {
      socket.off("load-lobby-message", handleLobbyMessage);
    };
  }, [socket]);

  const sendLobbyMessage = (message: string) => {
    if (!message.trim()) return;
    socket.emit("save-lobby-message", message);
  };

  return <MessageContext.Provider value={{ lobbyMessages, sendLobbyMessage }}>{children}</MessageContext.Provider>;
}

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage must be used within MessageProvider");
  return context;
};
