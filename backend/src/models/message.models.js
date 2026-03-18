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
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
