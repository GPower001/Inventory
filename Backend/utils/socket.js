import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173", // Local development frontend
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // Ensure WebSocket is enabled
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle events here
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

export { io, app, server };