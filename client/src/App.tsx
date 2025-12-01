import { router } from "./pages/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "./contexts/SocketContext.tsx";

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router}></RouterProvider>
    </SocketProvider>
  );
}

export default App;
