// src/utils/socket.js
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: true, // recommended if you want to auth before connecting
  withCredentials: true,
  auth: (cb) => {
    const token = localStorage.getItem("token");
    cb({ token });
  },
});
