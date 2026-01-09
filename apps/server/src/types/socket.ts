import { ClientToServerEvents, ServerToClientEvents } from "@ghost-chess-king/shared";
import { Server, Socket } from "socket.io";

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
