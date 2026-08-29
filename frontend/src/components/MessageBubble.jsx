import { useEffect, useRef, useState } from "react";

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

const formatFileSize = (bytes = 0) => {
  if (!bytes) {
    return "Shared file";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const normalizeAttachments = (message) => {
  if (Array.isArray(message.attachments) && message.attachments.length > 0) {
    return message.attachments;
  }

  return message.imageUrl
    ? [
        {
          url: message.imageUrl,
          name: message.imageName || "Shared photo",
          mimeType: "image/*",
          resourceType: "image",
        },
      ]
    : [];
};

async function downloadFile(url, filename) {
  const response = await fetch(url, { credentials: "omit" });

  if (!response.ok) {
    throw new Error("Unable to download file");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}

function AttachmentCard({ attachment, messageText }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const shareTimerRef = useRef(null);
  const isImage =
    attachment.mimeType?.startsWith("image/") ||
    attachment.resourceType === "image";
  const extension = attachment.name?.split(".").pop()?.slice(0, 5) || "File";

  useEffect(() => {
    return () => {
      window.clearTimeout(shareTimerRef.current);
    };
  }, []);

  const showShareFeedback = (value) => {
    setShareFeedback(value);
    window.clearTimeout(shareTimerRef.current);
    shareTimerRef.current = window.setTimeout(() => {
      setShareFeedback("");
    }, 1600);
  };

  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      await downloadFile(attachment.url, attachment.name || "chatify-file");
    } catch (_error) {
      window.open(attachment.url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: attachment.name || "Chatify file",
          text: messageText || "Shared from Chatify",
          url: attachment.url,
        });
        showShareFeedback("Shared");
        return;
      }

      await navigator.clipboard.writeText(attachment.url);
      showShareFeedback("Copied");
    } catch (_error) {
      showShareFeedback("Ready");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-primary">
      {isImage ? (
        <a href={attachment.url} target="_blank" rel="noreferrer">
          <img
            src={attachment.url}
            alt={attachment.name || "Shared image"}
            className="max-h-[22rem] w-full object-cover"
            loading="lazy"
          />
        </a>
      ) : (
        <a
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 p-4 transition hover:bg-[var(--surface-raised)]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px_18px_18px_7px] bg-[var(--moss)] text-xs font-bold uppercase text-[var(--canvas)]">
            {extension}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary">
              {attachment.name || "Shared file"}
            </p>
            <p className="mt-1 text-xs text-tertiary">
              {formatFileSize(attachment.size)}
            </p>
          </div>
        </a>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-xs text-secondary">
          {attachment.name || "Shared file"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="secondary-button px-3 py-1.5 text-[11px]"
          >
            {shareFeedback || "Share"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="secondary-button px-3 py-1.5 text-[11px]"
          >
            {isDownloading ? "Saving" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ message, currentUser }) {
  const isOwnMessage = message.sender === currentUser?.username;
  const sentAt = message?.createdAt
    ? timeFormatter.format(new Date(message.createdAt))
    : "Now";
  const attachments = normalizeAttachments(message);

  return (
    <div
      className={[
        "flex w-full animate-message-in",
        isOwnMessage ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "soft-shadow max-w-[min(90%,42rem)] rounded-[24px] px-4 py-3",
          isOwnMessage
            ? "rounded-br-md bg-[var(--moss)] text-[var(--canvas)]"
            : "rounded-bl-md border border-[var(--line)] bg-[var(--surface-raised)] text-primary backdrop-blur-xl",
        ].join(" ")}
      >
        {!isOwnMessage ? (
          <p className="mb-1.5 text-xs font-semibold text-[var(--terracotta)]">
            {message.sender}
          </p>
        ) : null}

        {attachments.length > 0 ? (
          <div className="mb-3 grid gap-2">
            {attachments.map((attachment, index) => (
              <AttachmentCard
                key={`${attachment.url}-${index}`}
                attachment={attachment}
                messageText={message.text}
              />
            ))}
          </div>
        ) : null}

        {message.text ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px]">
            {message.text}
          </p>
        ) : null}

        <p
          className={[
            "mt-2 text-[11px]",
            isOwnMessage ? "opacity-70" : "text-tertiary",
          ].join(" ")}
        >
          {sentAt}
        </p>
      </div>
    </div>
  );
}
