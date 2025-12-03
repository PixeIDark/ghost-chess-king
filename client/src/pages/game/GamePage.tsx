import Square from "./components/Square.tsx";
import { createBoardViewModel } from "../../viewModel/board.ts";
import { useSocket } from "../../contexts/SocketContext.tsx";
import { TimerDisplay } from "./components/TimerDisplay";
import { useChessGame } from "./hooks/useChessGame.ts";

function GamePage() {
  const socket = useSocket();
  const { gameState, mySide, gameResult, validMoves, fromSquare, handleSquareClick } = useChessGame(socket);

  if (!gameState) return <div>게임 로딩 중...</div>;

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
