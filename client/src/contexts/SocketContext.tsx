/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState(() => io("http://localhost:3001"));

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("only can able to Provider");

  return socket;
};
