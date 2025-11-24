import { useState } from "react";
import { ChessBoard } from "./components/ChessBoard";
import { useAIMove } from "./hooks/useAiMove.ts";
import Timer from "./components/Timer.tsx";
import { useGameState } from "./hooks/useGameState.ts";
import { usePromotion } from "./hooks/usePromotion.ts";
import RetractButton from "./components/RetractButton.tsx";
import { isKingInCheck } from "./utils/legalityChecker.ts";
import PromotionModal from "./components/PromotionModal.tsx";
import { type Color, type PieceType } from "./constants/board.ts";
import Advisor from "./components/Advisor.tsx";
import { useAdvice } from "./hooks/useAdvice.ts";
import GameResultModal from "./components/GameResultModal.tsx";
import ChatPanel from "./components/ChatPanel.tsx";
import { useSocket } from "./hooks/useSocket.ts";
import PanelController from "./components/PanelController.tsx";
import { SettingSelector } from "./components/SettingSelector";

function App() {
  const [gameMode, setGameMode] = useState<"solo" | "ai" | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const {
    board,
    currentTurn,
    winner,
    status,
    whiteTime,
    blackTime,
    undoCount,
    proceedToNextTurn,
    loadPreviousBoard,
    resetGame,
  } = useGameState();
  const { promotionSquare, checkAndSetPromotion, completePromotion, clearPromotion } = usePromotion();
  const { advice, advisors, handleRequestAdvice, resetAdvice } = useAdvice(playerColor, currentTurn, board);
  const { nickname, lobbyMessages, sendLobbyMessage } = useSocket();
  const [isOpen, setIsOpen] = useState(true);

  useAIMove(board, currentTurn, playerColor, gameMode, proceedToNextTurn);

  const handleUpdateGameState = (newBoard: typeof board) => {
    if (winner !== null) return;
    if (checkAndSetPromotion(newBoard, currentTurn)) return;

    proceedToNextTurn(newBoard);
    resetAdvice();
  };

  const handleCompletePromotion = (promotionType: PieceType) => {
    const promotedBoard = completePromotion(promotionType, board);
    proceedToNextTurn(promotedBoard);
    clearPromotion();
  };

  const opponentColor = playerColor === "white" ? "black" : "white";
  const opponentTime = opponentColor === "white" ? whiteTime : blackTime;
  const playerTime = playerColor === "white" ? whiteTime : blackTime;
  const isCheck = isKingInCheck(board, currentTurn);

  if (gameMode === null || playerColor === null) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <SettingSelector onSelectMode={setGameMode} onSelectColor={setPlayerColor} />
        <PanelController isOpen={isOpen} togglePanel={() => setIsOpen(!isOpen)} />
        {isOpen && <ChatPanel nickname={nickname} lobbyMessages={lobbyMessages} sendLobbyMessage={sendLobbyMessage} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-12">
          <div className="flex flex-1 flex-col items-center">
            <div className="w-fit rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-2xl">
              <div className="mb-6">
                <Timer time={opponentTime} player={opponentColor} playerColor={playerColor} />
              </div>
              <ChessBoard
                board={board}
                onUpdateGameState={handleUpdateGameState}
                playerColor={playerColor}
                currentTurn={currentTurn}
                gameMode={gameMode}
                advice={advice}
              />
              <div className="mt-6">
                <Timer time={playerTime} player={playerColor} playerColor={playerColor} />
              </div>
              {isCheck && (
                <div className="mt-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-center">
                  <p className="text-sm font-semibold text-red-300">
                    ⚠️ {currentTurn === "white" ? "화이트" : "블랙"}팀이 체크 상태입니다!
                  </p>
                  <p className="mt-1 text-xs text-red-200">킹을 안전한 곳으로 이동하거나 위협을 제거하세요</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-64 flex-col gap-6">
            <RetractButton undoCount={undoCount} onLoadBoard={loadPreviousBoard} />
            {gameMode === "ai" && <Advisor advisors={advisors} onRequestAdvice={handleRequestAdvice} />}
          </div>
        </div>
      </div>
      {winner && <GameResultModal winner={winner} playerColor={playerColor} status={status} onResetGame={resetGame} />}
      {promotionSquare && <PromotionModal onPromote={handleCompletePromotion} color={currentTurn} />}
    </div>
  );
}

export default App;
