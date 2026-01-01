import { type Socket } from "socket.io-client";
import type { ClientToServerEvents, GameOverData, ServerToClientEvents } from "../../../types/socket.ts";
import { useEffect, useState } from "react";
import type { GameState } from "../../../types/game.ts";
import type { Side, Square as SquareType } from "../../../types/chess.ts";
import { useNavigate } from "react-router";

interface UseChessGameParams {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  roomId: string;
  isRegistered: boolean;
}

export const useChessGame = ({ socket, roomId, isRegistered }: UseChessGameParams) => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySide, setMySide] = useState<Side>("white");
  const [fromSquare, setFromSquare] = useState<SquareType | null>(null);
  const [validMoves, setValidMoves] = useState<SquareType[]>([]);
  const [gameResult, setGameResult] = useState<GameOverData | null>(null);

  useEffect(() => {
    if (!isRegistered) return;

    const handleGameState = (data: GameState) => {
      setGameState(data);
    };

    const handleGameRestored = (data: { roomId: string; yourSide: Side; gameState: GameState }) => {
      setMySide(data.yourSide);
      setGameState(data.gameState);
      setGameResult(null);
    };

    const handleGameOver = (data: GameOverData) => {
      setGameResult(data);
    };

    const handleGameNotFound = () => {
      navigate("/");
    };

    socket.on("game-state", handleGameState);
    socket.on("game-restored", handleGameRestored);
    socket.on("game-over", handleGameOver);
    socket.on("game-not-found", handleGameNotFound);
    socket.emit("rejoin-game", { roomId });

    return () => {
      socket.off("game-state", handleGameState);
      socket.off("game-restored", handleGameRestored);
      socket.off("game-over", handleGameOver);
      socket.off("game-not-found", handleGameNotFound);
    };
  }, [socket, isRegistered, roomId, navigate]);

  const handleMove = (from: SquareType, to: SquareType) => {
    if (!roomId) return;
    socket.emit("move", { roomId, from, to });
  };

  const handleSquareClick = (square: SquareType, selectedColor: Side | undefined) => {
    if (!roomId || gameState?.turn !== mySide || gameResult) return;
    if (!fromSquare && selectedColor !== mySide) return;

    if (!fromSquare) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => setValidMoves(data.moves || []));
      return;
    }

    if (selectedColor === mySide) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      socket.once("valid-moves", (data) => setValidMoves(data.moves || []));
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

  return {
    gameState,
    mySide,
    roomId,
    gameResult,
    validMoves,
    fromSquare,
    handleSquareClick,
    handleMove,
  };
};
