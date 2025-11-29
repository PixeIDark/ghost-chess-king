import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { indicesToSquare } from "./utils/squareUtils.ts";
import Square from "./Square.tsx";
import type { Side } from "./types/chess.ts";
import type { ServerToClientEvents, ClientToServerEvents } from "./types/socket.ts";
import type { GameState } from "./types/game.ts";
import type { Square as SquareType } from "./types/chess.ts";

function App() {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() => io("http://localhost:3001"));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
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

  const handleSquareClick = (square: SquareType) => {
    if (!roomId || gameState.turn !== mySide) return;

    if (!fromSquare) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => {
        setValidMoves(data.moves as string[]);
      });

      return;
    }

    socket.emit("move", { roomId, from: fromSquare, to: square });
    setFromSquare(null);
    setValidMoves([]);
  };

  // TODO: 아래 함수와 타입들 분리하기
  type SquareState = "selected" | "moved" | "kingInChecked" | "none";

  const getSquareView = (isValidMove: boolean, isSelected: boolean, isKingInCheck: boolean): SquareState => {
    if (isSelected) return "selected";
    if (isValidMove) return "moved";
    if (isKingInCheck) return "kingInChecked";

    return "none";
  };

  const boardViewModel = gameState.board.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      const position = indicesToSquare(rowIndex, colIndex);
      const isValidMove = validMoves.includes(position);
      const isSelected = fromSquare === position;

      return {
        position,
        cell,
        state: getSquareView(isValidMove, isSelected, false),
      };
    });
  });

  return (
    <div>
      <div>현재 턴: {gameState.turn === "white" ? "백" : "흑"}</div>
      <div>상태: {gameState.status.state}</div>
      <div className="grid aspect-square w-full max-w-[640px] min-w-[160px] grid-cols-8 grid-rows-8">
        {boardViewModel.flat().map((square) => (
          <Square
            key={square.position}
            position={square.position}
            cell={square.cell}
            state={square.state}
            onSquareClick={handleSquareClick}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
