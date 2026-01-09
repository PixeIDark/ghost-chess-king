import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@ghost-chess-king/shared";

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
