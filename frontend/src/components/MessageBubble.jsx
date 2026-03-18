const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export default function MessageBubble({ message, currentUser }) {
  const isOwnMessage = message.sender === currentUser?.username;
  const sentAt = message?.createdAt
    ? timeFormatter.format(new Date(message.createdAt))
    : "Now";
  const hasImage = Boolean(message.imageUrl);

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
          <a href={message.imageUrl} target="_blank" rel="noreferrer">
            <img
              src={message.imageUrl}
              alt={message.imageName || "Shared photo"}
              className="max-h-[22rem] w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </a>
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
