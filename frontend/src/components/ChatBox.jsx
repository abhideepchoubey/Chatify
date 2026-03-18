import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import { getChatGradient, getChatInitials } from "../utils/chat";

export default function ChatBox({
  chat,
  messages,
  currentUser,
  draft,
  onDraftChange,
  onSendMessage,
  isSendingDisabled,
  isLoading,
  loadingError,
  typingUser,
  connectionState,
  onOpenSidebar,
  onOpenAddFriend,
  onOpenCreateGroup,
  selectedImage,
  onSelectImage,
  onClearImage,
  isUploadingImage,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  if (!chat) {
    return (
      <div className="panel-surface flex min-h-[calc(100vh-1.5rem)] min-w-0 flex-1 flex-col items-center justify-center rounded-[30px] px-6 text-center md:min-h-[calc(100vh-2.5rem)]">
        <div className="mx-auto flex h-20 w-20 animate-float-slow items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-3xl text-cyan-100">
          +
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold text-white">
          Build your chat circle
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
          Add friends for direct conversations, create shared group spaces, and
          send image messages once a chat is live.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenAddFriend}
            className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Add friend
          </button>
          <button
            type="button"
            onClick={onOpenCreateGroup}
            className="rounded-[22px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:translate-y-[-1px]"
          >
            Create group
          </button>
        </div>
      </div>
    );
  }

  const gradient = getChatGradient(chat.id);

  return (
    <div className="panel-surface flex min-h-[calc(100vh-1.5rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-[30px] md:min-h-[calc(100vh-2.5rem)]">
      <header className="border-b border-white/10 bg-slate-950/80 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="soft-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-white/10 md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
              </svg>
            </button>

            <div
              className={[
                "flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-sm font-semibold text-white",
                gradient,
              ].join(" ")}
            >
              {chat.imageUrl ? (
                <img
                  src={chat.imageUrl}
                  alt={chat.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getChatInitials(chat.name)
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-white">
                {chat.name}
              </h2>
              <p className="truncate text-sm text-slate-300">
                {chat.description || chat.subtitle}
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 sm:flex sm:items-center sm:gap-2">
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                connectionState === "Live"
                  ? "bg-emerald-400"
                  : connectionState === "Connecting"
                    ? "bg-amber-400"
                    : "bg-rose-400",
              ].join(" ")}
            />
            <span>{connectionState}</span>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_30%)]" />

        <div className="scrollbar-thin relative flex h-full flex-col overflow-y-auto px-4 py-6 sm:px-6">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-[24px] border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && loadingError ? (
            <div className="mx-auto w-full max-w-lg rounded-[24px] border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-center text-sm text-rose-100">
              {loadingError}
            </div>
          ) : null}

          {!isLoading && !loadingError && messages.length === 0 ? (
            <div className="m-auto max-w-md rounded-[28px] border border-white/10 bg-white/5 px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 animate-float-slow items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20">
                <span className="text-2xl">#</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                Start the conversation
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This chat is ready. Send a message or upload a photo to bring it
                to life.
              </p>
            </div>
          ) : null}

          {!isLoading && !loadingError && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <MessageBubble
                  key={
                    message._id ||
                    `${message.sender}-${message.text}-${message.createdAt || ""}`
                  }
                  message={message}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ) : null}

          {typingUser ? (
            <div className="mt-4 self-start rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs text-slate-300 backdrop-blur-xl">
              {typingUser} is typing...
            </div>
          ) : null}

          <div ref={endRef} />
        </div>
      </div>

      <InputBar
        value={draft}
        onChange={onDraftChange}
        onSend={onSendMessage}
        disabled={isSendingDisabled}
        placeholder={`Message ${chat.name}`}
        selectedImage={selectedImage}
        onSelectImage={onSelectImage}
        onClearImage={onClearImage}
        isUploadingImage={isUploadingImage}
      />
    </div>
  );
}
