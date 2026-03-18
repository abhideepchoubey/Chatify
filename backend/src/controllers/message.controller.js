import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";
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

export const getMessages = asyncHandler(async (req, res) => {
  await ensureChatAccess(req.params.room, req.user.id);

  const messages = await Message.find({ room: req.params.room }).sort({
    createdAt: 1,
  });

  res.json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  const { room } = req.body;

  if (!room) {
    throw new ApiError(400, "Chat is required");
  }

  await ensureChatAccess(room, req.user.id);

  if (!req.file?.buffer) {
    throw new ApiError(400, "Photo is required");
  }

  if (!cloudinaryConfigured) {
    throw new ApiError(500, "Cloudinary is not configured");
  }

  const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
    resourceType: "image",
  });

  res.json(
    new ApiResponse(
      200,
      {
        imageUrl: uploadResult.secure_url || uploadResult.url,
        imageName: req.file.originalname,
      },
      "Photo uploaded successfully"
    )
  );
});
