import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";
import { unlink } from "fs/promises";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  cloudinaryConfigured,
  uploadBufferToCloudinary,
} from "../utils/cloudinary.js";

const ensureChatAccess = async (chatId, userId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    members: userId,
  });

  if (!chat) {
    throw new ApiError(404, "Chat doesn't exist");
  }

  return chat;
};

const cleanupUploadedFile = async (file) => {
  if (!file?.path) {
    return;
  }

  try {
    await unlink(file.path);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("Upload cleanup error:", error.message);
    }
  }
};

export const getMessages = asyncHandler(async (req, res) => {
  await ensureChatAccess(req.params.room, req.user.id);

  const messages = await Message.find({ room: req.params.room }).sort({
    createdAt: 1,
  });

  res.json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const uploadAttachments = asyncHandler(async (req, res) => {
  const { room } = req.body;
  const files = req.files || [];

  if (!room) {
    throw new ApiError(400, "Chat is required");
  }

  await ensureChatAccess(room, req.user.id);

  if (files.length === 0) {
    throw new ApiError(400, "Select at least one file");
  }

  if (!cloudinaryConfigured) {
    throw new ApiError(500, "Cloudinary is not configured");
  }

  try {
    const attachments = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, {
          resourceType: "auto",
        });

        return {
          url: uploadResult.secure_url || uploadResult.url,
          name: file.originalname,
          mimeType: file.mimetype || "application/octet-stream",
          size: file.size || uploadResult.bytes || 0,
          resourceType: uploadResult.resource_type || "raw",
        };
      })
    );

    res.json(
      new ApiResponse(200, { attachments }, "Files uploaded successfully")
    );
  } finally {
    await Promise.all(files.map(cleanupUploadedFile));
  }
});
