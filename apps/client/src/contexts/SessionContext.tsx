/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GameStartData, loadLocalStorage, RegisteredData, saveLocalStorage } from "@ghost-chess-king/shared";
import { ClientSocket } from "@/types/socket.ts";
import { config } from "@/config.ts";
import { useNavigate } from "react-router";
import { routes } from "@/route/path.ts";

interface SocketContextValue {
  socket: ClientSocket;
  odId: string;
  nickname: string | null;
  currentRoomId: string | null;
  isRegistered: boolean;
  isConnected: boolean;
}

const SessionContext = createContext<SocketContextValue | null>(null);

const OD_ID_KEY = "odId";

const getOrCreateOdId = (): string => {
  const stored = loadLocalStorage<string>(OD_ID_KEY);
  if (stored) return stored;

  const newOdId = crypto.randomUUID();
  saveLocalStorage(OD_ID_KEY, newOdId);
  return newOdId;
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<ClientSocket>(() => io(config.apiUrl));
  const [odId] = useState(getOrCreateOdId);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("register", { odId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsRegistered(false);
    };

    const handleRegistered = (data: RegisteredData) => {
      setNickname(data.nickname);
      setCurrentRoomId(data.currentRoomId);
      setIsRegistered(true);
    };

    const handleGameStart = (data: GameStartData) => {
      navigate(routes.game(data.mode, data.roomId), {
        state: { key: Date.now() }, // TODO: 상태를 초기화 함으로써 상대가 게임 종료 모달이 떠잇어도 새로운 보드판으로 이동하게 하기위함
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("registered", handleRegistered);
    socket.on("game-start", handleGameStart);

    if (socket.connected) socket.emit("register", { odId });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("registered", handleRegistered);
      socket.off("game-start", handleGameStart);
    };
  }, [socket, odId, navigate]);

  return (
    <SessionContext.Provider value={{ socket, odId, nickname, currentRoomId, isRegistered, isConnected }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useServerStatus = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useServerStatus must be used within SocketProvider");

  return {
    isConnected: context.isConnected,
    isRegistered: context.isRegistered,
  };
};

export const useSocket = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");

  return context.socket;
};

export const useUserInfo = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useUserInfo must be used within SocketProvider");

  return {
    odId: context.odId,
    nickname: context.nickname,
    currentRoomId: context.currentRoomId,
    isRegistered: context.isRegistered,
  };
};
