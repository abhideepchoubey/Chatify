import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import ThemeToggle from "./ThemeToggle";
import { getChatGradient, getChatInitials } from "../utils/chat";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="m14 6-6 6 6 6M8 12h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConversationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.7A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h8M8 11.5h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  onBack,
  isMobileChatOpen,
  onOpenAddFriend,
  onOpenCreateGroup,
  selectedFiles,
  onSelectFiles,
  onRemoveFile,
  onClearFiles,
  isUploadingImage,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  const responsiveClass = isMobileChatOpen ? "flex" : "hidden sm:flex";

  if (!chat) {
    return (
      <div
        className={[
          "panel-surface min-h-0 min-w-0 flex-1 flex-col items-center justify-center rounded-[30px] px-6 text-center",
          responsiveClass,
        ].join(" ")}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-[30px_30px_30px_10px] bg-[var(--surface-raised)] text-[var(--moss)]">
          <ConversationIcon />
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold text-primary">
          Choose a conversation
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-secondary">
          Select a chat from the conversation list, add a friend, or create a
          group.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenAddFriend}
            className="secondary-button px-5 py-3 text-sm"
          >
            Add friend
          </button>
          <button
            type="button"
            onClick={onOpenCreateGroup}
            className="primary-button px-5 py-3 text-sm"
          >
            Create group
          </button>
        </div>
      </div>
    );
  }

  const gradient = getChatGradient(chat.id);
  const statusTone =
    connectionState === "Live"
      ? "bg-[var(--positive)]"
      : connectionState === "Connecting"
        ? "bg-[var(--warning)]"
        : "bg-[var(--danger)]";

  return (
    <div
      className={[
        "panel-surface min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[30px]",
        responsiveClass,
      ].join(" ")}
    >
      <header className="shrink-0 border-b border-[var(--line)] bg-[var(--surface)] px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="icon-button h-10 w-10 sm:hidden"
              aria-label="Back to conversations"
            >
              <BackIcon />
            </button>

            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[17px_17px_17px_6px] bg-gradient-to-br text-sm font-semibold text-[var(--canvas)] sm:h-12 sm:w-12",
                gradient,
              ].join(" ")}
            >
              {chat.imageUrl ? (
                <img
                  src={chat.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                getChatInitials(chat.name)
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-primary">
                {chat.name}
              </h2>
              <p className="truncate text-xs text-secondary sm:text-sm">
                {chat.description || chat.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="surface-muted hidden items-center gap-2 rounded-full px-4 py-2 text-xs text-secondary sm:flex">
              <span
                className={["h-2.5 w-2.5 rounded-full", statusTone].join(" ")}
              />
              <span>{connectionState}</span>
            </div>
            <div className="sm:hidden">
              <ThemeToggle compact />
            </div>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="conversation-canvas pointer-events-none absolute inset-0" />

        <div className="scrollbar-thin relative flex h-full flex-col overflow-y-auto px-3 py-5 sm:px-6 sm:py-6">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="surface-muted h-20 animate-pulse rounded-[24px]"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && loadingError ? (
            <div className="danger-banner mx-auto w-full max-w-lg px-5 py-4 text-center text-sm">
              {loadingError}
            </div>
          ) : null}

          {!isLoading && !loadingError && messages.length === 0 ? (
            <div className="surface-muted m-auto max-w-md rounded-[28px] px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px_24px_24px_8px] bg-[var(--surface-raised)] text-[var(--moss)]">
                <ConversationIcon />
              </div>
              <h3 className="font-display text-2xl font-semibold text-primary">
                Start the conversation
              </h3>
              <p className="mt-2 text-sm leading-6 text-secondary">
                Send a message or attach files when you are ready.
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
            <div className="surface-muted mt-4 self-start rounded-full px-4 py-2 text-xs text-secondary">
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
        selectedFiles={selectedFiles}
        onSelectFiles={onSelectFiles}
        onRemoveFile={onRemoveFile}
        onClearFiles={onClearFiles}
        isUploadingImage={isUploadingImage}
      />
    </div>
  );
}
