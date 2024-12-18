import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import message from "./types/message";
import { frontendConfig } from "./config/settings";
// Initialize the socket
export const initializeSocket = (app: express.Application) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: frontendConfig.url,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", async (socket) => {
    // LIVE CHAT HANDILING
    socket.on("send_message", (message) => {
      console.log("Message received:", message);
      const chat_message: message = {
        userId: message.userId,
        username: message.username,
        message: message.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log("Message sent:", chat_message);
      io.emit("receive_message", chat_message); // sending message to all clients.
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return server;
};
