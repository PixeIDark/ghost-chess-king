import { IChess, IChessTimer } from "./models";
import { Side } from "./chess";
import { GameMode, MatchResultType } from "./game";

export type RoomStatus = "WAITING" | "PLAYING" | "FINISHED";

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  chess: IChess;
  timer: IChessTimer;
  whitePlayer: string;
  blackPlayer: string;
  status: RoomStatus;
  winner?: Side | "draw";
  winReason?: MatchResultType;
}
