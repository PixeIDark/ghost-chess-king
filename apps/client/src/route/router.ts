import { createBrowserRouter } from "react-router";
import { ROUTES } from "@/route/routes.constant";
import LobbyPage from "@/pages/lobby/LobbyPage";
import GamePage from "@/pages/game/GamePage";

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
