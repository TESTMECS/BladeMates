import { Server } from "socket.io";
import { createServer } from "node:http";
import express from "express";
import message from "./types/message";
import { frontendConfig } from "./config/settings";
import { rabbitConnection } from "./config/rabbitConnection";
async function consumeNotifications(userId: string, socket: any) {
  const queue = `notification-${userId}`;
  const connection = await rabbitConnection();
  const channel = await connection?.createChannel();
  await channel?.assertQueue(queue, { durable: true });
  channel?.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        const notification = JSON.parse(msg.content.toString());
        socket.emit("notification", notification, (ack: boolean) => {
          if (ack) {
            channel.ack(msg);
          } else {
            channel.nack(msg, false, true);
          }
        });
      }
    },
    { noAck: false },
  );
}
export const initializeSocket = (app: express.Application) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: frontendConfig.url,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    socket.on("send_message", (message) => {
      // console.log("Message received:", message);
      const chat_message: message = {
        userId: message.userId,
        username: message.username,
        message: message.message,
        timestamp: new Date().toLocaleTimeString(),
      };
      // console.log("Message sent:", chat_message);
      socket.emit("receive_message", chat_message); // sending message to all clients.
    });
    socket.on("subscribe", (userId) => {
      console.log(`Client subscribed to notifications for user ${userId}`);
      consumeNotifications(userId, socket);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return server;
};
