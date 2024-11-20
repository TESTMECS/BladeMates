import React, { useState, useEffect } from "react";
import socket from "../../hooks/socket";

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("send_message", newMessage); // Emit the new message
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div className="live-chat">
      <div className="chat-window">
        <h2>Live Chat</h2>
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input-field"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
