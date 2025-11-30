import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Square from "./Square.tsx";
import type { Side } from "./types/chess.ts";
import type { ServerToClientEvents, ClientToServerEvents } from "./types/socket.ts";
import type { GameState } from "./types/game.ts";
import type { Square as SquareType } from "./types/chess.ts";
import { createBoardViewModel } from "./viewModel/board.ts";
import { useAi } from "./hooks/useAi.ts";
import { getOppositeSide } from "./utils/squareUtils.ts";

function App() {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() => io("http://localhost:3001"));
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<SquareType[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [mySide, setMySide] = useState<Side>("white");

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
      console.log("gameState 수신:", data);
      setGameState(data);
    });

    socket.on("invalid-move", (data) => {
      console.log("Invalid move 수신:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("game-start");
      socket.off("game-state");
      socket.off("invalid-move");
    };
  }, [socket]);

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.turn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 15,
    onAiMove: (from: SquareType, to: SquareType) => {
      if (!roomId) return;
      console.log("AI 수:", from, "->", to);
      socket.emit("move", { roomId, from, to });
    },
  });

  if (!gameState) return <div>게임 로딩 중...</div>;

  const handleSquareClick = (square: SquareType, selectedColor: Side | undefined) => {
    if (!roomId || gameState.turn !== mySide) return;

    if (!fromSquare && selectedColor !== mySide) return;

    if (!fromSquare) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => {
        setValidMoves(data.moves as SquareType[]);
      });
      return;
    }

    if (selectedColor === mySide) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => {
        setValidMoves(data.moves as SquareType[]);
      });
      return;
    }

    if (!validMoves.includes(square)) {
      setFromSquare(null);
      setValidMoves([]);
      return;
    }

    socket.emit("move", { roomId, from: fromSquare, to: square });
    setFromSquare(null);
    setValidMoves([]);
  };

  const boardViewModel = createBoardViewModel(gameState.board, validMoves, fromSquare);

  return (
    <div>
      <div>현재 턴: {gameState.turn === "white" ? "백" : "흑"}</div>
      <div>내 진영: {mySide === "white" ? "백" : "흑"}</div>
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
