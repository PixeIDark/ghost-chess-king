import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupSocketHandlers } from "./socket/socketHandler.ts";
import { ClientToServerEvents, ServerToClientEvents } from "./types/socket.ts";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

setupSocketHandlers(io);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Chess Server is running" });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중: ${PORT}`);
});
