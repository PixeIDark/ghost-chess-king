import { createBrowserRouter } from "react-router";
import LobbyPage from "./lobby/LobbyPage.tsx";
import GamePage from "./game/GamePage.tsx";
import { ROUTES } from "../constants/routes.ts";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOBBY,
    Component: LobbyPage,
  },
  {
    path: ROUTES.GAME,
    Component: GamePage,
  },
]);
