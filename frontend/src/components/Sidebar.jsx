import ChatifyLogo from "./ChatifyLogo";
import ThemeToggle from "./ThemeToggle";
import { getChatGradient, getChatInitials } from "../utils/chat";

const presenceTone = {
  online: "bg-[var(--positive)]",
  away: "bg-[var(--warning)]",
  busy: "bg-[var(--danger)]",
};

function UserPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M15.5 20a7 7 0 0 0-14 0M8.5 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 8v6M21 11h-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M16 20a6 6 0 0 0-12 0M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 11a3 3 0 1 0 0-6M16 15.2A5 5 0 0 1 22 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13ZM4 14h4l1.3 2h5.4l1.3-2h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3M10 12h11M18 9l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatCard({ chat, isActive, onSelectChat }) {
  const gradient = getChatGradient(chat.id);
  const presence = presenceTone[chat.presence] || "bg-[var(--text-faint)]";

  return (
    <button
      type="button"
      onClick={() => onSelectChat(chat.id)}
      className={[
        "group flex w-full items-center gap-3 rounded-[24px] border px-3 py-3 text-left transition-all duration-300",
        isActive
          ? "soft-shadow border-[var(--line-strong)] bg-[var(--surface-raised)]"
          : "border-transparent hover:border-[var(--line)] hover:bg-[var(--surface-muted)]",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[20px_20px_20px_8px] bg-gradient-to-br text-sm font-semibold text-[var(--canvas)]",
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
        <span
          className={[
            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface-solid)]",
            presence,
          ].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold text-primary">{chat.name}</p>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-tertiary">
            {chat.type}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-secondary">
          {chat.subtitle || chat.description}
        </p>
      </div>
    </button>
  );
}

export default function Sidebar({
  user,
  chats,
  activeChatId,
  onSelectChat,
  onLogout,
  isLoggingOut,
  connectionState,
  onOpenAddFriend,
  onOpenCreateGroup,
  onOpenRequests,
  requestCount,
  isMobileChatOpen,
}) {
  const statusTone =
    connectionState === "Live"
      ? "bg-[var(--positive)]"
      : connectionState === "Connecting"
        ? "bg-[var(--warning)]"
        : "bg-[var(--danger)]";

  return (
    <aside
      className={[
        "h-full min-h-0 w-full shrink-0 sm:block sm:w-[20rem] lg:w-[22rem]",
        isMobileChatOpen ? "hidden" : "block",
      ].join(" ")}
    >
      <div className="panel-surface flex h-full min-h-0 flex-col rounded-[30px] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <ChatifyLogo />
          <ThemeToggle compact />
        </div>

        <div className="surface-muted mt-4 flex items-center gap-3 rounded-[24px] p-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px_18px_18px_7px] bg-[var(--moss)] text-sm font-semibold text-[var(--canvas)]">
              {user?.username?.slice(0, 2)?.toUpperCase() || "ME"}
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface-solid)] bg-[var(--positive)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-primary">
              {user?.username}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-secondary">
              <span
                className={["h-2 w-2 rounded-full", statusTone].join(" ")}
              />
              <span>{connectionState}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenAddFriend}
            className="secondary-button flex-col rounded-[20px] px-2 py-3 text-xs"
          >
            <UserPlusIcon />
            <span>Add friend</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateGroup}
            className="secondary-button flex-col rounded-[20px] px-2 py-3 text-xs"
          >
            <UsersIcon />
            <span>New group</span>
          </button>
          <button
            type="button"
            onClick={onOpenRequests}
            className="secondary-button relative flex-col rounded-[20px] px-2 py-3 text-xs"
          >
            <InboxIcon />
            <span>Requests</span>
            {requestCount > 0 ? (
              <span className="absolute right-2 top-2 min-w-5 rounded-full bg-[var(--terracotta)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--canvas)]">
                {requestCount}
              </span>
            ) : null}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between px-1">
          <p className="eyebrow">Conversations</p>
          <span className="surface-muted rounded-full px-3 py-1 text-xs text-secondary">
            {chats.length}
          </span>
        </div>

        <div className="scrollbar-thin mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          {chats.length === 0 ? (
            <div className="surface-muted rounded-[24px] px-5 py-8 text-center text-sm leading-6 text-secondary">
              Add a friend or create a group to start chatting.
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelectChat={onSelectChat}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="secondary-button mt-4 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogoutIcon />
          <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
