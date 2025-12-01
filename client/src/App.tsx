import { router } from "./pages/router.ts";
import { RouterProvider } from "react-router";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
