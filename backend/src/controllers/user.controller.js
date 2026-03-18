import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ensureDirectChat } from "./chat.controller.js";
import { serializeChat } from "../utils/chatSerializer.js";

const serializeUser = (user, friendIds) => ({
  _id: String(user._id),
  username: user.username,
  online: Boolean(user.online),
  lastSeen: user.lastSeen || null,
  avatar: user.avatar || "",
  isFriend: friendIds.has(String(user._id)),
});

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.query?.trim();
  const currentUser = await User.findById(req.user.id).select("friends");
  const friendIds = new Set(
    (currentUser?.friends || []).map((friendId) => String(friendId))
  );
  const filters = {
    _id: { $ne: req.user.id },
  };

  if (query) {
    filters.username = { $regex: query, $options: "i" };
  }

  const users = await User.find(filters)
    .select("_id username online lastSeen avatar")
    .sort({ online: -1, username: 1 })
    .limit(query ? 12 : 20);

  res.json(
    new ApiResponse(
      200,
      users.map((user) => serializeUser(user, friendIds)),
      "Users fetched successfully"
    )
  );
});

export const getFriends = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id)
    .populate("friends", "_id username online lastSeen avatar");

  const friends = (currentUser?.friends || []).map((friend) => ({
    _id: String(friend._id),
    username: friend.username,
    online: Boolean(friend.online),
    lastSeen: friend.lastSeen || null,
    avatar: friend.avatar || "",
  }));

  res.json(new ApiResponse(200, friends, "Friends fetched successfully"));
});

export const addFriend = asyncHandler(async (req, res) => {
  const { userId, username } = req.body;
  const currentUser = await User.findById(req.user.id).select("_id friends username");
  const friend = await User.findOne(
    userId ? { _id: userId } : { username: username?.trim() }
  ).select("_id username online lastSeen avatar");

  if (!friend) {
    throw new ApiError(404, "User doesn't exist");
  }

  if (String(friend._id) === String(req.user.id)) {
    throw new ApiError(400, "You can't add yourself");
  }

  const isFriend = (currentUser?.friends || []).some(
    (friendId) => String(friendId) === String(friend._id)
  );

  if (!isFriend) {
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { friends: friend._id } }
    );
    await User.updateOne(
      { _id: friend._id },
      { $addToSet: { friends: req.user.id } }
    );
  }

  const directChat = await ensureDirectChat(req.user.id, friend._id);

  res.json(
    new ApiResponse(
      200,
      {
        friend: {
          _id: String(friend._id),
          username: friend.username,
          online: Boolean(friend.online),
          lastSeen: friend.lastSeen || null,
          avatar: friend.avatar || "",
        },
        chat: serializeChat(directChat, req.user.id),
      },
      isFriend ? "User already added" : "Friend added successfully"
    )
  );
});
