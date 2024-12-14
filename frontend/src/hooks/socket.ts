// src/socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:4001", {
  withCredentials: true,
});
export default socket;
