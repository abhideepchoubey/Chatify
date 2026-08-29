const gradients = [
  "from-[var(--moss)] via-[var(--sage)] to-[var(--clay)]",
  "from-[var(--terracotta)] via-[var(--clay)] to-[var(--ochre)]",
  "from-[var(--sage)] via-[var(--moss)] to-[var(--clay)]",
  "from-[var(--ochre)] via-[var(--clay)] to-[var(--terracotta)]",
  "from-[var(--clay)] via-[var(--sage)] to-[var(--moss)]",
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
