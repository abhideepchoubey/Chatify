import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const fallbackOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOrigins =
  process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*"
    ? process.env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : fallbackOrigins;

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.resolve(currentDirectory, "../public/uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_req, res) => {
  res.send("API running");
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message =
    error instanceof ApiError
      ? error.message
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
  });
});

export { app };
