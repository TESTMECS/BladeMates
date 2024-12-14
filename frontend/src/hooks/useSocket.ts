import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/userContext";
import Message from "../types/Message";
import handleNotification from "../utils/handleNotification.ts";
import notification from "../types/notification.ts";
const useSocket = () => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<Message[]>([]);
  const [notification, setNotification] = useState<notification>();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io("http://localhost:4001", {
        withCredentials: true,
      });
      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("Connected to the backend");
        newSocket.emit("subscribe", user.id);
      });
      newSocket.on("disconnect", () => {
        console.log("Disconnected from the backend");
      });
      newSocket.on("receive_message", (message) => {
        setMessage((prevMessages) => [...prevMessages, message]);
      });
      newSocket.on("notification", (notification, ackCallback) => {
        try {
          console.log("Recieved Notification", notification.data);
          setNotification(handleNotification(notification.data, user.id));
          ackCallback(true);
        } catch (error) {
          console.log(error);
          ackCallback(false);
        }
      });
      return () => {
        newSocket.disconnect();
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("notification");
        newSocket.off("receive_message");
      };
    }
  }, [isAuthenticated]);

  return { message, socket, notification };
};

export default useSocket;
