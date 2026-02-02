import { useSocket } from "@/contexts/SessionContext.tsx";
import { UserInfo } from "@ghost-chess-king/shared";
import { useEffect, useState } from "react";

export function useLobbyUsers() {
  const socket = useSocket();
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    const handleUserList = (data: UserInfo[]) => setUsers(data);

    socket.on("userList", handleUserList);
    socket.emit("request-user-list");

    return () => {
      socket.off("userList", handleUserList);
    };
  }, [socket]);

  return users;
}
