const gradients = [
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-fuchsia-400 via-violet-500 to-indigo-600",
  "from-amber-400 via-orange-500 to-rose-600",
  "from-lime-400 via-green-500 to-emerald-600",
];

export const getChatGradient = (seed = "") => {
  const value = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return gradients[value % gradients.length];
};

export const getChatInitials = (name = "Chat") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getMessagePreview = (message) => {
  if (!message) {
    return "";
  }

  const attachmentCount = message.attachments?.length || 0;

  if (attachmentCount > 0) {
    const allImages = message.attachments.every((attachment) =>
      attachment.mimeType?.startsWith("image/")
    );
    const label = allImages
      ? attachmentCount === 1
        ? "Photo"
        : `${attachmentCount} photos`
      : attachmentCount === 1
        ? "File"
        : `${attachmentCount} files`;

    return message.text ? `${label}: ${message.text}` : label;
  }

  if (message.messageType === "image" || message.imageUrl) {
    return message.text ? `Photo: ${message.text}` : "Photo";
  }

  return message.text || "";
};

export const sortChats = (items = []) =>
  [...items].sort(
    (first, second) =>
      new Date(
        second.lastMessage?.createdAt || second.updatedAt || 0
      ).getTime() -
      new Date(first.lastMessage?.createdAt || first.updatedAt || 0).getTime()
  );
