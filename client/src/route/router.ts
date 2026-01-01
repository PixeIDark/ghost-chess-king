import { createBrowserRouter } from "react-router";
import LobbyPage from "../pages/lobby/LobbyPage.tsx";
import GamePage from "../pages/game/GamePage.tsx";
import { ROUTES } from "./routes.constant.ts";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOBBY,
    Component: LobbyPage,
  },
  {
    path: ROUTES.AI,
    Component: GamePage,
  },
]);
