import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/userContext";
import Message from "../types/Message";
const useSocket = () => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<Message[]>([]);
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io("http://localhost:4001", {
        withCredentials: true,
      });
      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log("connected");
      });
      newSocket.on("disconnect", () => {
        console.log("disconnected");
      });
      newSocket.on("receive_message", (message: Message) => {
        setMessage((prev) => [...prev, message]);
      });
    }
    return () => {
      socket?.disconnect();
      socket?.off("receive_message");
      socket?.off("connect");
      setSocket(null);
    };
  }, [isAuthenticated]);
  return {
    message,
    socket,
  };
};
export default useSocket;
