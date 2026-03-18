const getPresence = (user) => {
  if (!user) {
    return "away";
  }

  return user.online ? "online" : "away";
};

const getLastMessagePreview = (chat) => {
  const lastMessage = chat.lastMessage;

  if (!lastMessage) {
    return "";
  }

  if (lastMessage.messageType === "image") {
    return lastMessage.text
      ? `Photo: ${lastMessage.text}`
      : "Photo";
  }

  return lastMessage.text;
};

export const serializeChat = (chat, currentUserId) => {
  const currentUserIdString = String(currentUserId);
  const members = (chat.members || []).map((member) => ({
    _id: String(member._id),
    username: member.username,
    online: Boolean(member.online),
    lastSeen: member.lastSeen || null,
    avatar: member.avatar || "",
  }));
  const isGroup = chat.type === "group";
  const otherMember =
    members.find((member) => member._id !== currentUserIdString) || null;
  const preview = getLastMessagePreview(chat);

  return {
    id: String(chat._id),
    room: String(chat._id),
    name: isGroup ? chat.name : otherMember?.username || chat.name || "Direct chat",
    type: isGroup ? "Group" : "Direct",
    chatType: chat.type,
    subtitle: preview || (isGroup ? `${members.length} members` : otherMember?.online ? "Online now" : "Start chatting"),
    description: isGroup
      ? `${members.length} members`
      : otherMember?.online
        ? "Online now"
        : "Offline",
    presence: isGroup ? "online" : getPresence(otherMember),
    memberCount: members.length,
    members,
    admins: (chat.admins || []).map((admin) => String(admin._id || admin)),
    imageUrl: chat.photo || "",
    lastMessage: chat.lastMessage
      ? {
          _id: String(chat.lastMessage._id),
          sender: chat.lastMessage.sender,
          text: chat.lastMessage.text,
          imageUrl: chat.lastMessage.imageUrl || "",
          imageName: chat.lastMessage.imageName || "",
          messageType: chat.lastMessage.messageType,
          createdAt: chat.lastMessage.createdAt,
        }
      : null,
    updatedAt: chat.updatedAt,
  };
};
