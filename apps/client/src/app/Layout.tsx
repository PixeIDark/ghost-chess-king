import { Outlet } from "react-router";
import ServerStatus from "@/components/ServerStatus.tsx";
import { SocketProvider } from "@/contexts/SessionContext.tsx";
import { MessageProvider } from "@/contexts/MessageContext.tsx";

function Layout() {
  return (
    <div className="flex h-screen flex-col items-center">
      <SocketProvider>
        <ServerStatus />
        <MessageProvider>
          <Outlet />
        </MessageProvider>
      </SocketProvider>
    </div>
  );
}

export default Layout;
