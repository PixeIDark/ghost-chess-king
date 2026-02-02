import { router } from "../route/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "../contexts/SessionContext.tsx";
import "./global.css";

function App() {
  return (
    <SocketProvider>
      <RouterProvider router={router}></RouterProvider>
    </SocketProvider>
  );
}

export default App;
