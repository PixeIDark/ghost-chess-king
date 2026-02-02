import { createBrowserRouter } from "react-router";
import { ROUTES } from "@/route/path.ts";
import LobbyPage from "@/pages/lobby/LobbyPage";
import GamePage from "@/pages/game/GamePage";
import Layout from "@/app/Layout.tsx";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: ROUTES.LOBBY,
        Component: LobbyPage,
      },
      {
        path: ROUTES.AI,
        Component: GamePage,
      },
    ],
  },
]);
