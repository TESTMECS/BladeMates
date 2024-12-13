// src/socket.js
import { io } from "socket.io-client";

const socket = io('http://localhost:4000', {
    withCredentials: true,
  }); // Replace with backend URL

export default socket;
