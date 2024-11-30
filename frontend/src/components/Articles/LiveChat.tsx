import React, { useState, useEffect } from "react";
import socket from "../../hooks/socket";
import { useParams } from "react-router-dom";
import Article from "../../types/Article";
import Message from "../../types/Message";
import { useAuth } from "../../context/userContext";
import { validateUserInput } from "../../utils/validation";

const LiveChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`http://localhost:8000/articles/${id}`);
      const data = await res.json();
      setArticle(data);
    };
    fetchArticle();
    // Listen for incoming messages
    socket.on("receive_message", (message: Message) => {
      const newMessage: Message = {
        userId: message.userId,
        username: message.username,
        message: message.message,
        timestamp: message.timestamp,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    // validate the user input.
    const isValid: boolean = validateUserInput(newMessage);
    if (isValid && isAuthenticated) {
      const message_json = {
        userId: user?.id,
        username: user.username,
        message: newMessage.trim(),
      };
      socket.emit("send_message", message_json); // Emit the new message
      setNewMessage(""); // Clear input field
    } else {
      alert("Invalid input, avoid using only special characters or spaces.");
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-screen">
      <div className="pt-16 p-4 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ARTICLE INFORMATION
          {article?.title}
        </h1>
        <img
          src={article?.image}
          alt={article?.title}
          className="w-full h-auto mb-4"
        />
        <p className="text-lg text-gray-600">{article?.content}</p>
      </div>

      {/* Live Chat */}
      <div className="pt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Live Chat</h2>
          <div className="h-64 overflow-y-scroll p-2 bg-white rounded-lg shadow-inner border-lightblue border">
            {messages.map((message, index) => (
              <div
                key={index}
                className="message mb-2 p-3 bg-blue-50 rounded-lg shadow-sm flex items-center"
              >
                <span className="text-xs text-gray-400 mr-2">
                  {message.timestamp}
                </span>
                <strong className="text-blue-700 mr-2">
                  {message.username}
                </strong>
                <p className="text-sm text-gray-800">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-input flex">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input-field flex-grow p-2 border border-lightblue rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:text-black"
          />
          <button
            onClick={sendMessage}
            className="p-2 rounded-r-lg bg-lightpink hover:bg-lightblue dark:bg-purple dark:hover:bg-green"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
