export const ROUTES = {
  LOBBY: "/",
  AI: "/ai/:roomId",
} as const;

export const links = {
  lobby: () => "/",
  ai: (roomId: string) => `/ai/${roomId}`,
};
