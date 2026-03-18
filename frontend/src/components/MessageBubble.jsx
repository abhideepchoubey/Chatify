import { useEffect, useRef, useState } from "react";

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

const getDownloadName = (message) => {
  if (message.imageName) {
    return message.imageName;
  }

  const extension = message.imageUrl?.split(".").pop()?.split("?")[0] || "jpg";
  return `chatify-photo-${message._id || Date.now()}.${extension}`;
};

async function downloadImage(url, filename) {
  const response = await fetch(url, {
    credentials: "omit",
  });

  if (!response.ok) {
    throw new Error("Unable to download image");
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

export default function MessageBubble({ message, currentUser }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const shareTimerRef = useRef(null);
  const isOwnMessage = message.sender === currentUser?.username;
  const sentAt = message?.createdAt
    ? timeFormatter.format(new Date(message.createdAt))
    : "Now";
  const hasImage = Boolean(message.imageUrl);

  useEffect(() => {
    return () => {
      window.clearTimeout(shareTimerRef.current);
    };
  }, []);

  const setTemporaryShareFeedback = (value) => {
    setShareFeedback(value);
    window.clearTimeout(shareTimerRef.current);
    shareTimerRef.current = window.setTimeout(() => {
      setShareFeedback("");
    }, 1600);
  };

  const handleDownload = async () => {
    if (!message.imageUrl || isDownloading) {
      return;
    }

    try {
      setIsDownloading(true);
      await downloadImage(message.imageUrl, getDownloadName(message));
    } catch (_error) {
      window.open(message.imageUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!message.imageUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: message.imageName || "Chatify photo",
          text: message.text || "Shared from Chatify",
          url: message.imageUrl,
        });
        setTemporaryShareFeedback("Shared");
        return;
      }

      await navigator.clipboard.writeText(message.imageUrl);
      setTemporaryShareFeedback("Copied");
    } catch (_error) {
      setTemporaryShareFeedback("Ready");
    }
  };

  return (
    <div
      className={[
        "flex w-full animate-message-in",
        isOwnMessage ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[min(84%,40rem)] rounded-[24px] px-4 py-3 shadow-lg ring-1 ring-inset",
          isOwnMessage
            ? "rounded-br-md bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white ring-cyan-300/30"
            : "rounded-bl-md bg-white/8 text-slate-100 ring-white/10 backdrop-blur-xl",
        ].join(" ")}
      >
        {!isOwnMessage ? (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/85">
            {message.sender}
          </p>
        ) : null}

        {hasImage ? (
          <div className="mb-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/20">
            <a href={message.imageUrl} target="_blank" rel="noreferrer">
              <img
                src={message.imageUrl}
                alt={message.imageName || "Shared photo"}
                className="max-h-[22rem] w-full rounded-2xl object-cover"
                loading="lazy"
              />
            </a>

            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <p className="min-w-0 flex-1 truncate text-xs text-slate-200/80">
                {message.imageName || "Shared photo"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
                >
                  {shareFeedback || "Share"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
                >
                  {isDownloading ? "Saving" : "Download"}
                </button>
              </div>
            </div>
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
            isOwnMessage ? "text-white/70" : "text-slate-400",
          ].join(" ")}
        >
          {sentAt}
        </p>
      </div>
    </div>
  );
}
