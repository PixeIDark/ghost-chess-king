import { router } from "./route/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "./contexts/SessionContext";
import ServerStatus from "@/layouts/ServerStatus.tsx";

function App() {
  return (
    <SocketProvider>
      <div className="flex h-screen flex-col items-center">
        <ServerStatus />
        <RouterProvider router={router}></RouterProvider>
      </div>
    </SocketProvider>
  );
}

export default App;
