import { Chat } from "../models/chat.models.js";
import { ConnectionRequest } from "../models/request.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { serializeChat } from "../utils/chatSerializer.js";

const chatPopulate = [
  {
    path: "members",
    select: "_id username online lastSeen avatar",
  },
  {
    path: "admins",
    select: "_id username",
  },
  {
    path: "lastMessage",
    select:
      "_id sender text imageUrl imageName attachments messageType createdAt",
  },
];

export const buildDirectKey = (firstUserId, secondUserId) =>
  [String(firstUserId), String(secondUserId)].sort().join(":");

export const ensureDirectChat = async (firstUserId, secondUserId) => {
  const directKey = buildDirectKey(firstUserId, secondUserId);

  let chat = await Chat.findOne({ directKey });

  if (!chat) {
    chat = await Chat.create({
      type: "direct",
      members: [firstUserId, secondUserId],
      admins: [firstUserId],
      directKey,
    });
  }

  return Chat.findById(chat._id).populate(chatPopulate);
};

export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ members: req.user.id })
    .populate(chatPopulate)
    .sort({ updatedAt: -1 });

  res.json(
    new ApiResponse(
      200,
      chats.map((chat) => serializeChat(chat, req.user.id)),
      "Chats fetched successfully"
    )
  );
});

export const createGroupChat = asyncHandler(async (req, res) => {
  const { name, memberIds = [], photo = "" } = req.body;
  const trimmedName = name?.trim();

  if (!trimmedName) {
    throw new ApiError(400, "Group name is required");
  }

  const inviteeIds = [
    ...new Set(
      memberIds.map(String).filter((id) => id !== String(req.user.id))
    ),
  ];

  if (inviteeIds.length < 2) {
    throw new ApiError(400, "Select at least 2 friends to create a group");
  }

  const creator = await User.findById(req.user.id).select("friends");
  const friendIds = new Set(
    (creator?.friends || []).map((friendId) => String(friendId))
  );

  if (inviteeIds.some((userId) => !friendIds.has(userId))) {
    throw new ApiError(400, "You can only invite accepted friends");
  }

  const chat = await Chat.create({
    type: "group",
    name: trimmedName,
    photo,
    members: [req.user.id],
    admins: [req.user.id],
  });

  try {
    await ConnectionRequest.insertMany(
      inviteeIds.map((recipient) => ({
        type: "group",
        sender: req.user.id,
        recipient,
        chat: chat._id,
      }))
    );
  } catch (error) {
    await Chat.deleteOne({ _id: chat._id });
    throw error;
  }

  const io = req.app.get("io");
  inviteeIds.forEach((recipient) => {
    io?.to(`user:${recipient}`).emit("request_received");
  });

  const populatedChat = await Chat.findById(chat._id).populate(chatPopulate);

  res.json(
    new ApiResponse(
      200,
      serializeChat(populatedChat, req.user.id),
      "Group created and invitations sent"
    )
  );
});
