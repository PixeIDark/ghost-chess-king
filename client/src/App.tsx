import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { indicesToSquare } from "./utils/squareUtils.ts";
import Square from "./Square.tsx";
import type { Side } from "./types/chess.ts";
import type { ServerToClientEvents, ClientToServerEvents } from "./types/socket.ts";
import type { GameState } from "./types/game.ts";

function App() {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() => io("http://localhost:3001"));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [mySide, setMySide] = useState<Side | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("서버 연결됨:", socket.id);
      socket.emit("start-ai-game");
    });

    socket.on("game-start", (data) => {
      console.log("내 진영:", data.yourSide);
      setMySide(data.yourSide);
      setRoomId(data.roomId);
    });

    socket.on("game-state", (data) => {
      console.log(data);
      setGameState(data);
    });

    return () => {
      socket.off("connect");
      socket.off("game-start");
      socket.off("game-state");
    };
  }, [socket]);

  if (!gameState) return <div>게임 로딩 중...</div>;

  return (
    <div>
      <div>현재 턴: {gameState.turn === "white" ? "백" : "흑"}</div>
      <div>상태: {gameState.status.state}</div>

      {gameState.board.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => {
              const position = indicesToSquare(rowIndex, colIndex);

              return <Square key={position} position={position} cell={cell} />;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
