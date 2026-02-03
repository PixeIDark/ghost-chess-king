import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { type Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  GameMode,
  GameOverData,
  GameState,
  getOppositeSide,
  Position,
  PromotionPieceName,
  PromotionRequiredData,
  ServerToClientEvents,
  Side,
  ValidMovesData,
} from "@ghost-chess-king/shared";
import { useAi } from "@/pages/game/hooks/useAi.ts";
import { routes } from "@/route/path.ts";

interface UseChessGameParams {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  roomId: string;
  gameMode: GameMode;
  isRegistered: boolean;
  refreshKey: number;
}

export const useChessGame = ({ socket, roomId, gameMode, isRegistered, refreshKey }: UseChessGameParams) => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [mySide, setMySide] = useState<Side>("white");
  const [fromSquare, setFromSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameResult, setGameResult] = useState<GameOverData | null>(null);
  const [isPromotionRequired, setIsPromotionRequired] = useState<boolean>(false);
  const [promotionRequiredData, setPromotionRequiredData] = useState<PromotionRequiredData | null>(null);

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
      socket.emit("leave-game", { roomId });
    };

    const handleGameNotFound = () => {
      navigate(routes.lobby());
    };

    const handleValidMoves = (data: ValidMovesData) => {
      setValidMoves(data.moves || []);
    };

    const handlePromotionRequired = (data: PromotionRequiredData) => {
      setPromotionRequiredData(data);
      setIsPromotionRequired(true);
    };

    socket.on("game-state", handleGameState);
    socket.on("game-restored", handleGameRestored);
    socket.on("game-over", handleGameOver);
    socket.on("game-not-found", handleGameNotFound);
    socket.on("valid-moves", handleValidMoves);
    socket.on("promotion-required", handlePromotionRequired);
    socket.emit("rejoin-game", { roomId });

    return () => {
      socket.off("game-state", handleGameState);
      socket.off("game-restored", handleGameRestored);
      socket.off("game-over", handleGameOver);
      socket.off("game-not-found", handleGameNotFound);
      socket.off("valid-moves", handleValidMoves);
      socket.off("promotion-required", handlePromotionRequired);
    };
  }, [socket, isRegistered, roomId, navigate, refreshKey]);

  const handleMove = (from: Position, to: Position, promotionType?: PromotionPieceName | null) => {
    socket.emit("move", { roomId, from, to });
    if (promotionType) socket.emit("select-promotion", { roomId, position: to, piece: promotionType });
  };

  const handleSquareClick = (square: Position, selectedColor: Side | undefined) => {
    if (!roomId || gameState?.currentTurn !== mySide || gameResult) return;
    if (!fromSquare && selectedColor !== mySide) return;

    const isValidMove = fromSquare && validMoves.some((m) => m.row === square.row && m.col === square.col);

    if (isValidMove) {
      socket.emit("move", { roomId, from: fromSquare, to: square });
      setFromSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedColor === mySide) {
      setFromSquare(square);
      socket.emit("get-valid-moves", { roomId, from: square });
      return;
    } else {
      setFromSquare(null);
      setValidMoves([]);
    }
  };

  const handleSelectPromotion = (selectedPiece: PromotionPieceName) => {
    if (!promotionRequiredData) return;
    socket.emit("select-promotion", { roomId, position: promotionRequiredData.position, piece: selectedPiece });
    setIsPromotionRequired(false);
  };

  const handleLeaveGame = () => {
    socket.emit("leave-game", { roomId });
  };

  useAi({
    fen: gameState?.fen ?? "",
    currentTurn: gameState?.currentTurn ?? "white",
    aiSide: getOppositeSide(mySide),
    depth: 15,
    onAiMove: handleMove,
    enabled: gameMode === "ai",
  });

  return {
    gameState,
    mySide,
    roomId,
    gameResult,
    validMoves,
    fromSquare,
    isPromotionRequired,
    handleSquareClick,
    handleSelectPromotion,
    handleLeaveGame,
  };
};
