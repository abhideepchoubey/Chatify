import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["friend", "group"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
    pairKey: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

requestSchema.index({ recipient: 1, status: 1, createdAt: -1 });
requestSchema.index({ sender: 1, status: 1 });
requestSchema.index({ type: 1, sender: 1, recipient: 1, chat: 1, status: 1 });
requestSchema.index(
  { type: 1, pairKey: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "friend", status: "pending" },
  }
);
export const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  requestSchema
);
