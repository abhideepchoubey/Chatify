import { User } from "../models/user.models.js";
import { ConnectionRequest } from "../models/request.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const serializeUser = (user, friendIds, requestStatusByUser) => ({
  _id: String(user._id),
  username: user.username,
  online: Boolean(user.online),
  lastSeen: user.lastSeen || null,
  avatar: user.avatar || "",
  isFriend: friendIds.has(String(user._id)),
  requestStatus: requestStatusByUser.get(String(user._id)) || "none",
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
  const userIds = users.map((user) => user._id);
  const pendingRequests = await ConnectionRequest.find({
    type: "friend",
    status: "pending",
    $or: [
      { sender: req.user.id, recipient: { $in: userIds } },
      { sender: { $in: userIds }, recipient: req.user.id },
    ],
  }).select("sender recipient");
  const requestStatusByUser = new Map();

  pendingRequests.forEach((request) => {
    const isOutgoing = String(request.sender) === String(req.user.id);
    const otherUserId = isOutgoing ? request.recipient : request.sender;
    requestStatusByUser.set(
      String(otherUserId),
      isOutgoing ? "sent" : "received"
    );
  });

  res.json(
    new ApiResponse(
      200,
      users.map((user) => serializeUser(user, friendIds, requestStatusByUser)),
      "Users fetched successfully"
    )
  );
});

export const getFriends = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).populate(
    "friends",
    "_id username online lastSeen avatar"
  );

  const friends = (currentUser?.friends || []).map((friend) => ({
    _id: String(friend._id),
    username: friend.username,
    online: Boolean(friend.online),
    lastSeen: friend.lastSeen || null,
    avatar: friend.avatar || "",
  }));

  res.json(new ApiResponse(200, friends, "Friends fetched successfully"));
});
