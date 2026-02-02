import { Outlet } from "react-router";
import ServerStatus from "@/components/ServerStatus.tsx";

function Layout() {
  return (
    <div className="flex h-screen flex-col items-center">
      <ServerStatus />
      <Outlet />
    </div>
  );
}

export default Layout;
