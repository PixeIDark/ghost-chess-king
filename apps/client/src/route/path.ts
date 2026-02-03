import { GameMode } from "@ghost-chess-king/shared";

export const ROUTES = {
  LOBBY: "/",
  GAME: "/:gameMode/:roomId",
} as const;

export const routes = {
  lobby: () => "/",
  game: (gameMode: GameMode, roomId: string) => `/${gameMode}/${roomId}`,
} as const;
