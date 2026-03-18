import { Chat } from "../models/chat.models.js";
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
    select: "_id sender text imageUrl imageName messageType createdAt",
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

  const uniqueMemberIds = [...new Set([req.user.id, ...memberIds].map(String))];

  if (uniqueMemberIds.length < 3) {
    throw new ApiError(400, "Select at least 2 friends to create a group");
  }

  const users = await User.find({
    _id: { $in: uniqueMemberIds },
  }).select("_id");

  if (users.length !== uniqueMemberIds.length) {
    throw new ApiError(404, "One or more users don't exist");
  }

  const chat = await Chat.create({
    type: "group",
    name: trimmedName,
    photo,
    members: uniqueMemberIds,
    admins: [req.user.id],
  });

  const populatedChat = await Chat.findById(chat._id).populate(chatPopulate);

  res.json(
    new ApiResponse(
      200,
      serializeChat(populatedChat, req.user.id),
      "Group created successfully"
    )
  );
});
