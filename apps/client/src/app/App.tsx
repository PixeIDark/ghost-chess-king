import { router } from "../route/router.ts";
import { RouterProvider } from "react-router";
import "./global.css";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
