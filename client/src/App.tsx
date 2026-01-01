import { router } from "./route/router.ts";
import { RouterProvider } from "react-router";
import { SocketProvider } from "./contexts/SessionContext.tsx";

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
