import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import message from "./types/message";

export const initializeSocket = (app: express.Application) => {
  const server = createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("send_message", (message) => {
      // receiving message from client.
      console.log("Message received:", message); // takes in type message, which should be the same as types/message.ts
      const chat_message: message = {
        userId: message.userId,
        username: message.username,
        message: message.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      io.emit("receive_message", chat_message); // sending message to all clients.
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return server;
};
