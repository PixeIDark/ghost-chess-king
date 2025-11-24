import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface LobbyMessage {
  nickname: string;
  message: string;
  timestamp: number;
  socketId: string;
}

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [lobbyMessages, setLobbyMessages] = useState<LobbyMessage[]>([]);

  useEffect(() => {
    if (socketInstance) {
      socketRef.current = socketInstance;
      return;
    }

    // TODO: 환경변수로 해야함
    const serverUrl = "https://chess-server-5x11.onrender.com/";
    const socket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      setSocketId(socket.id || "");
      console.log("소켓 연결됨:", socket.id);
    });

    socket.on("nickameReceived", (nick: string | undefined) => {
      if (nick) {
        setNickname(nick);
        console.log("닉네임 할당됨:", nick);
      }
    });

    socket.on("userConnected", (data: { nickname: string; totalUsers: number }) => {
      console.log(`${data.nickname} 입장 (총 ${data.totalUsers}명)`);
    });

    socket.on("lobbyMessage", (message: LobbyMessage) => {
      setLobbyMessages((prev) => [...prev, message]);
    });

    socket.on("userDisconnected", (data: { totalUsers: number }) => {
      console.log(`유저 나감 (남은 인원: ${data.totalUsers}명)`);
    });

    socketInstance = socket;
    socketRef.current = socket;

    return () => {};
  }, []);

  const sendLobbyMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("lobbyMessage", message);
    }
  };

  return {
    socketId,
    nickname,
    lobbyMessages,
    sendLobbyMessage,
  };
};
