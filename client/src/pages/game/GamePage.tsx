import { useState, useEffect, useCallback } from "react";
import Square from "./components/Square.tsx";
import type { Side } from "../../types/chess.ts";
import type { GameState } from "../../types/game.ts";
import type { Square as SquareType } from "../../types/chess.ts";
import { createBoardViewModel } from "../../viewModel/board.ts";
import { useAi } from "./hooks/useAi.ts";
import { getOppositeSide } from "../../utils/squareUtils.ts";
import { TimerDisplay } from "./components/TimerDisplay.tsx";
import { useSocket } from "../../contexts/SocketContext.tsx";
import type { GameOverData } from "../../types/socket.ts";

function GamePage() {
  const socket = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<SquareType[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [mySide, setMySide] = useState<Side>("white");
  const [gameResult, setGameResult] = useState<GameOverData | null>(null);

  useEffect(() => {
    socket.emit("start-ai-game");

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
      console.warn("치트 시도 감지:", data);
    });

    socket.on("game-over", (data) => {
      console.log("게임 종료:", data.winner, data.reason);
      setGameResult(data);
    });

    return () => {
      socket.off("connect");
      socket.off("game-start");
      socket.off("game-state");
      socket.off("invalid-move");
    };
  }, [socket]);

  const handleAiMove = useCallback(
    (from: SquareType, to: SquareType) => {
      if (!roomId) return;
      console.log("AI 수:", from, "->", to);
      socket.emit("move", { roomId, from, to });
    },
    [roomId, socket]
  );

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.turn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 20,
    onAiMove: handleAiMove,
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
      console.warn("해당 위치에는 둘 수 없습니다.");
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
      {gameResult && (
        <div>
          {gameResult.winner}이 {gameResult.reason}로 승리!
        </div>
      )}
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
      <TimerDisplay
        key={`${gameState.timeState.whiteTime}-${gameState.timeState.blackTime}`}
        whiteTime={gameState.timeState.whiteTime}
        blackTime={gameState.timeState.blackTime}
        currentTurn={gameState.turn}
        isGameActive={gameState.status.state === "normal" || gameState.status.state === "check"}
      />
    </div>
  );
}

export default GamePage;
