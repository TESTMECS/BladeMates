import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/userContext";
import Message from "../types/Message";

const useSocket = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<Message[]>([]);

  const connectSocket = () => {
    const newSocket = io("http://localhost:4001", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    newSocket.on("receive_message", (message) => {
      setMessage((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
      newSocket.off("receive_message");
      newSocket.off("connect");
      setSocket(null);
    };
  };

  const sendMessage = (message: Message) => {
    if (socket) {
      socket.emit("send_message", message);
    }
  };

  useEffect(() => {
    // any time user changes, re-subscribe
    if (!socket && !user) return;
    socket?.emit(
      "subscribe",
      user.id,
      user.friends?.map((friend) => friend._id),
    );
  }, [user, socket]);

  return {
    message,
    socket,
    connectSocket,
    sendMessage,
  };
};

export default useSocket;
