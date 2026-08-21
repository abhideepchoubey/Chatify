import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();
const fallbackOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredOriginValue = process.env.CORS_ORIGIN;
const allowAllOrigins = configuredOriginValue === "*";
const configuredOrigins =
  configuredOriginValue && configuredOriginValue !== "*"
    ? configuredOriginValue
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : fallbackOrigins;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const configuredVercelProjects = configuredOrigins
  .map((origin) => {
    try {
      const { hostname } = new URL(origin);

      return hostname.endsWith(".vercel.app")
        ? hostname.replace(/\.vercel\.app$/i, "")
        : null;
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const isAllowedVercelPreviewOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);

    if (protocol !== "https:") {
      return false;
    }

    return configuredVercelProjects.some((projectName) => {
      const projectPattern = new RegExp(
        `^${escapeRegex(projectName)}(?:-[a-z0-9-]+)?\\.vercel\\.app$`,
        "i"
      );

      return projectPattern.test(hostname);
    });
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin) =>
  !origin ||
  allowAllOrigins ||
  configuredOrigins.includes(origin) ||
  isAllowedVercelPreviewOrigin(origin);

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
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
