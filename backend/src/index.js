import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/db.js";
import { app, corsOptions } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import setupSocket from "./socket/socket.js";

//  Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions,
});
app.set("io", io);

// Setup socket events
setupSocket(io);

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(` Chatify server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
