/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, RegisteredData, ServerToClientEvents } from "../types/socket.ts";
import { loadLocalStorage, saveLocalStorage } from "../utils/storage.ts";

interface SocketContextValue {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  odId: string;
  nickname: string | null;
  currentRoomId: string | null;
  isRegistered: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

const OD_ID_KEY = "odId";

const getOrCreateOdId = (): string => {
  const stored = loadLocalStorage<string>(OD_ID_KEY);
  if (stored) return stored;

  const newOdId = crypto.randomUUID();
  saveLocalStorage(OD_ID_KEY, newOdId);
  return newOdId;
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() => io("http://localhost:3001"));
  const [odId] = useState(getOrCreateOdId);
  const [nickname, setNickname] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("register", { odId });
    };

    const handleRegistered = (data: RegisteredData) => {
      setNickname(data.nickname);
      setCurrentRoomId(data.currentRoomId);
      setIsRegistered(true);
    };

    socket.on("connect", handleConnect);
    socket.on("registered", handleRegistered);

    if (socket.connected) socket.emit("register", { odId });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("registered", handleRegistered);
    };
  }, [socket, odId]);

  return (
    <SocketContext.Provider value={{ socket, odId, nickname, currentRoomId, isRegistered }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");

  return context.socket;
};

export const useUserInfo = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useUserInfo must be used within SocketProvider");

  return {
    odId: context.odId,
    nickname: context.nickname,
    currentRoomId: context.currentRoomId,
    isRegistered: context.isRegistered,
  };
};
