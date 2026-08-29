import { User } from "../models/user.models.js";
import { Message } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";

export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    let currentUser = null;

    socket.on("join", async (payload) => {
      try {
        currentUser =
          typeof payload === "string"
            ? { username: payload }
            : {
                id: payload?.userId,
                username: payload?.username,
              };

        if (!currentUser?.username) {
          return;
        }

        if (currentUser.id) {
          socket.join(`user:${currentUser.id}`);
        }

        await User.updateOne(
          { username: currentUser.username },
          { online: true }
        );

        console.log(`${currentUser.username} joined`);
        io.emit("user_status");
      } catch (error) {
        console.error("Join error:", error.message);
      }
    });

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`${currentUser?.username} joined room: ${room}`);
    });

    socket.on("leave_room", (room) => {
      socket.leave(room);
      console.log(`${currentUser?.username} left room: ${room}`);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing", currentUser?.username);
    });

    socket.on("send_message", async (data) => {
      try {
        const text = data?.text?.trim();
        const attachments = Array.isArray(data?.attachments)
          ? data.attachments
              .filter((attachment) => attachment?.url && attachment?.name)
              .slice(0, 5)
          : [];
        const legacyImage =
          attachments.length === 0 && data?.imageUrl
            ? [
                {
                  url: data.imageUrl,
                  name: data.imageName || "Shared image",
                  mimeType: "image/*",
                  resourceType: "image",
                },
              ]
            : [];
        const messageAttachments = [...attachments, ...legacyImage];
        const chat = await Chat.findOne({
          _id: data?.room,
          ...(currentUser?.id ? { members: currentUser.id } : {}),
        });

        if (
          !data?.room ||
          (!text && messageAttachments.length === 0) ||
          !chat
        ) {
          return;
        }

        const imageAttachments = messageAttachments.filter((attachment) =>
          attachment.mimeType?.startsWith("image/")
        );
        const firstImage = imageAttachments[0];
        const messageType =
          messageAttachments.length === 0
            ? "text"
            : imageAttachments.length === messageAttachments.length
              ? "image"
              : text || imageAttachments.length > 0
                ? "mixed"
                : "file";

        const messagePayload = {
          senderId: currentUser?.id,
          sender: currentUser?.username || data?.sender,
          room: data.room,
          text,
          imageUrl: firstImage?.url || "",
          imageName: firstImage?.name || "",
          attachments: messageAttachments,
          messageType,
        };
        const message = await Message.create(messagePayload);

        await Chat.updateOne(
          { _id: data.room },
          {
            lastMessage: message._id,
          }
        );

        io.to(data.room).emit("receive_message", {
          ...message.toObject(),
          sender: message.sender,
        });
      } catch (error) {
        console.error("Message error:", error.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        console.log("User disconnected:", currentUser?.username);

        if (currentUser?.username) {
          await User.updateOne(
            { username: currentUser.username },
            {
              online: false,
              lastSeen: new Date(),
            }
          );

          io.emit("user_status");
        }
      } catch (error) {
        console.error("Disconnect error:", error.message);
      }
    });
  });
}
