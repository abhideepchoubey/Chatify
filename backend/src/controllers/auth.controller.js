import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (await User.findOne({ username })) {
    throw new ApiError(400, "User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashed });

  res.json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        username: user.username,
      },
      "User registered successfully"
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Wrong password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          username: user.username,
        },
        "Login successful"
      )
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(403, "Invalid token");
  }

  const accessToken = generateAccessToken(user);

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "Access token refreshed"
      )
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "_id username online lastSeen createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  res.json(
    new ApiResponse(
      200,
      user,
      "Current user fetched successfully"
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.refreshToken = null;
    user.online = false;
    user.lastSeen = new Date();
    await user.save();
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out"));
});
