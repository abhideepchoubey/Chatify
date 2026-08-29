import { Chat } from "../models/chat.models.js";
import { ConnectionRequest } from "../models/request.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { serializeChat } from "../utils/chatSerializer.js";
import { ensureDirectChat } from "./chat.controller.js";

const requestPopulate = [
  {
    path: "sender",
    select: "_id username online lastSeen avatar",
  },
  {
    path: "chat",
    select: "_id name photo type members admins",
  },
];

const serializeRequest = (request) => ({
  _id: String(request._id),
  type: request.type,
  status: request.status,
  sender: request.sender
    ? {
        _id: String(request.sender._id),
        username: request.sender.username,
        online: Boolean(request.sender.online),
        avatar: request.sender.avatar || "",
      }
    : null,
  chat: request.chat
    ? {
        _id: String(request.chat._id),
        name: request.chat.name,
        photo: request.chat.photo || "",
      }
    : null,
  createdAt: request.createdAt,
  respondedAt: request.respondedAt || null,
});

const emitToUser = (req, userId, eventName) => {
  req.app.get("io")?.to(`user:${userId}`).emit(eventName);
};

export const getRequests = asyncHandler(async (req, res) => {
  const requests = await ConnectionRequest.find({
    recipient: req.user.id,
    status: "pending",
  })
    .populate(requestPopulate)
    .sort({ createdAt: -1 });

  res.json(
    new ApiResponse(
      200,
      requests.map(serializeRequest),
      "Requests fetched successfully"
    )
  );
});

export const sendFriendRequest = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const currentUser = await User.findById(req.user.id).select("_id friends");
  const recipient = await User.findById(userId).select(
    "_id username online lastSeen avatar"
  );

  if (!recipient) {
    throw new ApiError(404, "User doesn't exist");
  }

  if (String(recipient._id) === String(req.user.id)) {
    throw new ApiError(400, "You can't add yourself");
  }

  const isFriend = (currentUser?.friends || []).some(
    (friendId) => String(friendId) === String(recipient._id)
  );

  if (isFriend) {
    throw new ApiError(400, "User is already your friend");
  }

  const existingRequest = await ConnectionRequest.findOne({
    type: "friend",
    status: "pending",
    $or: [
      { sender: req.user.id, recipient: recipient._id },
      { sender: recipient._id, recipient: req.user.id },
    ],
  });

  if (existingRequest) {
    const isOutgoing = String(existingRequest.sender) === String(req.user.id);
    throw new ApiError(
      400,
      isOutgoing
        ? "Friend request already sent"
        : "This user already sent you a friend request"
    );
  }

  const pairKey = [String(req.user.id), String(recipient._id)].sort().join(":");
  let request;

  try {
    request = await ConnectionRequest.create({
      type: "friend",
      sender: req.user.id,
      recipient: recipient._id,
      pairKey,
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(400, "A friend request is already pending");
    }

    throw error;
  }

  emitToUser(req, recipient._id, "request_received");

  res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: String(request._id),
        recipient: {
          _id: String(recipient._id),
          username: recipient.username,
        },
      },
      "Friend request sent"
    )
  );
});

export const respondToRequest = asyncHandler(async (req, res) => {
  const { action } = req.body;

  if (!["accepted", "declined"].includes(action)) {
    throw new ApiError(400, "Action must be accepted or declined");
  }

  const request = await ConnectionRequest.findOneAndUpdate(
    {
      _id: req.params.requestId,
      recipient: req.user.id,
      status: "pending",
    },
    {
      status: action,
      respondedAt: new Date(),
    },
    { new: true }
  ).populate(requestPopulate);

  if (!request) {
    throw new ApiError(404, "Request is no longer available");
  }

  let chat = null;

  try {
    if (action === "accepted" && request.type === "friend") {
      await Promise.all([
        User.updateOne(
          { _id: request.sender._id },
          { $addToSet: { friends: req.user.id } }
        ),
        User.updateOne(
          { _id: req.user.id },
          { $addToSet: { friends: request.sender._id } }
        ),
      ]);
      chat = await ensureDirectChat(request.sender._id, req.user.id);
    }

    if (action === "accepted" && request.type === "group") {
      chat = await Chat.findOneAndUpdate(
        { _id: request.chat?._id, type: "group" },
        { $addToSet: { members: req.user.id } },
        { new: true }
      ).populate([
        { path: "members", select: "_id username online lastSeen avatar" },
        { path: "admins", select: "_id username" },
        {
          path: "lastMessage",
          select:
            "_id sender text imageUrl imageName attachments messageType createdAt",
        },
      ]);

      if (!chat) {
        throw new ApiError(404, "Group is no longer available");
      }
    }
  } catch (error) {
    await ConnectionRequest.updateOne(
      { _id: request._id },
      { status: "pending", respondedAt: null }
    );
    throw error;
  }

  emitToUser(req, req.user.id, "request_updated");
  emitToUser(req, request.sender._id, "request_updated");

  res.json(
    new ApiResponse(
      200,
      {
        request: serializeRequest(request),
        chat: chat ? serializeChat(chat, req.user.id) : null,
      },
      action === "accepted" ? "Request accepted" : "Request declined"
    )
  );
});
