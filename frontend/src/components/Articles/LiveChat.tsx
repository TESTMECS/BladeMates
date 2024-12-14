import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Article from "../../types/Article";
import Message from "../../types/Message";
import { useAuth } from "../../context/userContext";
import { validateUserInput } from "../../utils/validation";
import apiArticleOfTheWeekResponse from "../../types/apiArticleOfTheWeekResponse";
import useSocket from "../../hooks/useSocket";

const LiveChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { socket, message } = useSocket();
  const [article, setArticle] = useState<Article>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          "http://localhost:3001/api/article-of-the-week",
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const data: apiArticleOfTheWeekResponse = await response.json();
          setArticle({
            id,
            author: data.data.author,
            publishedAt: data.data.publishedAt,
            title: data.data.title,
            image: data.data.urlToImage,
            description: data.data.description,
            url: data.data.url,
            content: data.data.content,
          });
        }
      } catch (error) {
        console.error("Error fetching article of the week:", error);
      }
    };
    fetchArticle();
    // Listen for incoming messages using Hook
    if (!socket) return; //maybe return error
    setMessages(message);
  }, [messages, socket, message]);
  const sendMessage = () => {
    // validate the user input.
    const result: {
      isValid: boolean;
      message: string;
    } = validateUserInput(newMessage);
    if (result.isValid && isAuthenticated && socket) {
      // Send the new message
      const message_json = {
        userId: user?.id,
        username: user.username,
        message: newMessage.trim(),
      };
      console.log("Sending message");
      socket.emit("send_message", message_json); // Emit the new message
      setNewMessage(""); // Clear input field
    } else {
      alert(result.message);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <div className="h-fit">
      {/* Article Information */}
      <div className="pt-16 p-4 border-b border-lightblue shadow-md">
        <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>
        <p className="text-lg "> By: {article?.author}</p>
        <p className="text-lg "> Published: {article?.publishedAt}</p>
        <img
          src={article?.image}
          alt={article?.title}
          className="w-full h-auto mb-4"
        />
        <p className="text-lg font-bold mb-4">
          {" "}
          Preview: {article?.description}
        </p>
        <a
          href={article?.url}
          target="_blank"
          className="mb-4 text-3xl font-bold underline pointer text-lightblue"
        >
          {article?.url}
        </a>
      </div>
      {/* Live Chat */}
      <div className="pt-6 p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Live Chat</h2>
          <div className="h-64 overflow-y-scroll p-2 bg-gray dark:bg-darkgray rounded-lg shadow-inner border-lightblue border text-white">
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
            className="input-field flex-grow p-2 text-white border border-lightblue rounded-l-lg focus:outline-none focus:ring-2 focus:ring-lightblue bg-gray dark:bg-darkgray pr-6"
          />
          <button
            onClick={sendMessage}
            className="p-2 text-2xl rounded-r-lg bg-lightpink hover:bg-lightblue dark:bg-purple dark:hover:bg-green w-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
