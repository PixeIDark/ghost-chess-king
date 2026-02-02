export const ROUTES = {
  LOBBY: "/",
  AI: "/ai/:roomId",
} as const;

export const routes = {
  lobby: () => "/",
  ai: (roomId: string) => `/ai/${roomId}`,
} as const;
