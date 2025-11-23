import { useState } from "react";
import SettingSelector from "./components/SettingSelector.tsx";
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

function App() {
  const [gameMode, setGameMode] = useState<"solo" | "ai" | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const { board, currentTurn, winner, status, whiteTime, blackTime, proceedToNextTurn, loadPreviousBoard, resetGame } =
    useGameState();
  const { promotionSquare, checkAndSetPromotion, completePromotion, clearPromotion } = usePromotion();
  const { advice, advisors, handleRequestAdvice, resetAdvice } = useAdvice(playerColor, currentTurn, board);
  useAIMove(board, currentTurn, playerColor, gameMode, proceedToNextTurn);

  if (gameMode === null || playerColor === null)
    return <SettingSelector onSelectMode={setGameMode} onSelectColor={setPlayerColor} />;

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

  return (
    <div className="flex flex-col items-center">
      <Timer time={opponentTime} player={opponentColor} playerColor={playerColor} />
      <ChessBoard
        board={board}
        onUpdateGameState={handleUpdateGameState}
        playerColor={playerColor}
        currentTurn={currentTurn}
        gameMode={gameMode}
        advice={advice}
      />
      <Timer time={playerTime} player={playerColor} playerColor={playerColor} />
      <RetractButton onLoadBoard={loadPreviousBoard} />
      {gameMode === "ai" && <Advisor advisors={advisors} onRequestAdvice={handleRequestAdvice} />}
      {isCheck && (
        <p>{currentTurn}님이 체크상태입니다! 킹을 움직이거나 다른 기물로 킹을 보호하세요! 또는 위협을 제거하세요!</p>
      )}
      {winner && (
        <div>
          <p>
            승자는... {winner}! {status}!
          </p>
          <button onClick={resetGame}>다시하기!</button>
        </div>
      )}
      {promotionSquare && <PromotionModal onPromote={handleCompletePromotion} color={currentTurn} />}
    </div>
  );
}

export default App;
