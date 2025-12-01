export const ROUTES = {
  LOBBY: () => "/",
  GAME: (roomId: number | string = ":roomId") => `/game/${roomId}`,
} as const;
