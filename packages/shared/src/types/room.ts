import { IChess, IChessTimer } from "./models";
import { Side } from "./chess";
import { GameMode, RoomStatus } from "./game";

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  chess: IChess;
  timer: IChessTimer;
  whitePlayer: string;
  blackPlayer: string;
  status: RoomStatus;
  winner?: Side | "draw";
  winReason?: "checkmate" | "timeout" | "stalemate" | "resignation";
}
