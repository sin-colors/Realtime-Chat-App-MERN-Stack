import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});
// {user1のID:user1のソケットID, user2のID:user2のソケットID, .... }となる予定
const userSocketMap: Record<string, string> = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  // フロントエンドで authUser が一瞬 null の状態でソケットが初期化されたりすると、クエリに "undefined" という文字列が入ってしまうことがある
  // userId !== undefined → userIdからundefinedの可能性を除外するための条件式
  // typeof userId === "string" → userIdからstring[]の可能性を除外するための条件式
  // userId !== "undefined" → userIdに"undefined" という文字列が入っていることを除外するための条件式
  if (
    userId !== undefined &&
    typeof userId === "string" &&
    userId !== "undefined"
  ) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (typeof userId === "string") {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
