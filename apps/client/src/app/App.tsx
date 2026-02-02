import { router } from "../route/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "../contexts/SessionContext.tsx";
import ServerStatus from "@/components/ServerStatus.tsx";
import "./global.css";

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
