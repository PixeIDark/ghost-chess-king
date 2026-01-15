import { useParams } from "react-router";
import { useSocket, useUserInfo } from "@/contexts/SessionContext";
import { useChessGame } from "@/pages/game/hooks/useChessGame";
import { useState } from "react";
import { useAi } from "@/pages/game/hooks/useAi";
import { getOppositeSide } from "@ghost-chess-king/shared";
import { createGameResultViewModel, GameResultViewModel } from "@/viewModel/gameResult";
import { createBoardViewModel } from "@/viewModel/board";
import GameResultModal from "@/pages/game/components/GameResultModal";
import Square from "@/pages/game/components/Square";
import { TimerDisplay } from "@/pages/game/components/TimerDisplay";

function GamePage() {
  const { roomId } = useParams() as { roomId: string };
  const socket = useSocket();
  const { isRegistered } = useUserInfo();
  const [isOpen, setIsOpen] = useState(true);
  const { gameState, mySide, gameResult, validMoves, fromSquare, handleSquareClick, handleMove } = useChessGame({
    socket,
    roomId,
    isRegistered,
  });

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.currentTurn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 20,
    onAiMove: handleMove,
  });

  if (!gameState) return <div>게임 로딩 중...</div>;

  const gameResultViewModel = gameResult ? createGameResultViewModel(gameResult, mySide) : null;
  const boardViewModel = createBoardViewModel(gameState.board, validMoves, fromSquare);

  return (
    <div className="flex w-full flex-col items-center">
      <div>현재 턴: {gameState.currentTurn === "white" ? "백" : "흑"}</div>
      <div>내 진영: {mySide === "white" ? "백" : "흑"}</div>
      <div>상태: {gameState.matchResult}</div>
      {gameResult && isOpen && (
        <GameResultModal gameResult={gameResultViewModel as GameResultViewModel} onClose={() => setIsOpen(false)} />
      )}
      <div className="grid aspect-square w-full max-w-[640px] min-w-[160px] grid-cols-8 grid-rows-8">
        {boardViewModel.flat().map((square) => (
          <Square
            key={square.id}
            position={square.position}
            cell={square.cell}
            state={square.state}
            onSquareClick={handleSquareClick}
          />
        ))}
      </div>
      <TimerDisplay
        key={`${gameState.timeRemaining.whiteTime}-${gameState.timeRemaining.blackTime}`}
        whiteTime={gameState.timeRemaining.whiteTime}
        blackTime={gameState.timeRemaining.blackTime}
        currentTurn={gameState.currentTurn}
        isGameActive={gameState.matchResult === "PLAYING" || gameState.matchResult === "CHECK"}
      />
    </div>
  );
}

export default GamePage;
