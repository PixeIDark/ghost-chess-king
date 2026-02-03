import { Outlet } from "react-router";
import ServerStatus from "@/components/ServerStatus.tsx";
import { SocketProvider } from "@/contexts/SessionContext.tsx";

function Layout() {
  return (
    <div className="flex h-screen flex-col items-center">
      <SocketProvider>
        <ServerStatus />
        <Outlet />
      </SocketProvider>
    </div>
  );
}

export default Layout;
