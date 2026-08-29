import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    room: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: String,
    imageName: String,
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        mimeType: { type: String, default: "application/octet-stream" },
        size: { type: Number, default: 0 },
        resourceType: { type: String, default: "raw" },
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "image", "file", "mixed"],
      default: "text",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
