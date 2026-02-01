import { useNavigate, useParams } from "react-router";
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
import PromotionModal from "@/pages/game/components/PromotionModal.tsx";
import { links } from "@/route/routes.constant.ts";

function GamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams() as { roomId: string };
  const socket = useSocket();
  const { isRegistered } = useUserInfo();
  const [isOpen, setIsOpen] = useState(true);
  const {
    gameState,
    mySide,
    gameResult,
    validMoves,
    fromSquare,
    isPromotionRequired,
    handleSquareClick,
    handleMove,
    handleSelectPromotion,
    handleLeaveGame,
  } = useChessGame({
    socket,
    roomId,
    isRegistered,
  });

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.currentTurn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 15,
    onAiMove: handleMove,
  });

  if (!gameState) return <div>게임 로딩 중...</div>;

  const gameResultViewModel = gameResult ? createGameResultViewModel(gameResult, mySide) : null;
  const lastMove = gameState.moveHistory.at(-1);
  const lastMoveSquares = lastMove ? [lastMove.from, lastMove.to] : [];
  const boardViewModel = createBoardViewModel(
    gameState.board,
    validMoves,
    fromSquare,
    gameState.checkPosition,
    lastMoveSquares
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-neutral-100 to-neutral-200 px-4 py-6">
      <header className="mb-6 flex w-full max-w-[640px] items-center justify-between">
        <button
          type="button"
          onClick={handleLeaveGame}
          className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-700 active:scale-95"
        >
          나가기
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${mySide === "white" ? "bg-white text-neutral-800 shadow-sm" : "bg-neutral-800 text-white"}`}
          >
            내 진영: {mySide === "white" ? "백" : "흑"}
          </span>
        </div>
      </header>
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`inline-flex h-3 w-3 rounded-full ${gameState.currentTurn === "white" ? "bg-white shadow-inner ring-1 ring-neutral-300" : "bg-neutral-800"}`}
        />
        <span className="text-sm font-medium text-neutral-600">
          현재 턴: {gameState.currentTurn === "white" ? "백" : "흑"}
        </span>
        <span className="ml-2 rounded bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-500">
          {gameState.matchResult}
        </span>
      </div>
      {gameResult && isOpen && (
        <GameResultModal
          gameResult={gameResultViewModel as GameResultViewModel}
          onClose={() => {
            setIsOpen(false);
            handleLeaveGame();
            navigate(links.lobby());
          }}
        />
      )}
      <div className="grid aspect-square w-full max-w-[640px] min-w-[160px] grid-cols-8 grid-rows-8 overflow-hidden rounded-xl shadow-lg ring-1 ring-neutral-300">
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
      <PromotionModal onSelectPromotion={handleSelectPromotion} isOpen={isPromotionRequired} color={mySide} />
    </div>
  );
}

export default GamePage;
