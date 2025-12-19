import { router } from "./pages/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "./contexts/SocketContext.tsx";

function App() {
  return (
    <SocketProvider>
      <div className="flex justify-center">
        <RouterProvider router={router}></RouterProvider>
      </div>
    </SocketProvider>
  );
}

export default App;
