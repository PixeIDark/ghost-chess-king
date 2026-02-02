import { useSocket } from "@/contexts/SessionContext";
import { UserInfo } from "@ghost-chess-king/shared";
import { useEffect, useState } from "react";

export function useLobbyUsers() {
  const socket = useSocket();
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    const handleUserList = (data: UserInfo[]) => setUsers(data);

    socket.on("userList", handleUserList);
    return () => {
      socket.off("userList", handleUserList);
    };
  }, [socket]);

  return users;
}
