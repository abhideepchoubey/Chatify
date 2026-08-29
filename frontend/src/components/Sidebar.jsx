import { getChatGradient, getChatInitials } from "../utils/chat";

const presenceTone = {
  online: "bg-emerald-400",
  away: "bg-amber-400",
  busy: "bg-rose-400",
};

function UserPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0-3-.479c-1.62 0-3.145.402-4.5 1.114M16.5 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 8.25v6m3-3h-6"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 0 0 3.742.78c.973 0 1.914-.151 2.798-.43M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM3 19.5a9 9 0 0 1 18 0"
      />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V5.25Zm0 9h4.03a2.25 2.25 0 0 0 1.59-.66l.47-.47a3 3 0 0 1 4.24 0l.47.47a2.25 2.25 0 0 0 1.59.66h4.11"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.7"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-7.5a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6 21h7.5a2.25 2.25 0 0 0 2.25-2.25V15m-3 0 3 3m0 0 3-3m-3 3V9"
      />
    </svg>
  );
}

function MobileChatCard({ chat, isActive, onSelectChat }) {
  const gradient = getChatGradient(chat.id);
  const presence = presenceTone[chat.presence] || "bg-slate-400";

  return (
    <button
      type="button"
      title={chat.name}
      onClick={() => onSelectChat(chat.id)}
      className={[
        "min-w-[6.25rem] rounded-[22px] border px-3 py-3 text-center transition-all duration-200",
        isActive
          ? "border-cyan-400/30 bg-gradient-to-r from-cyan-400/20 via-sky-500/10 to-transparent shadow-[0_18px_60px_-28px_rgba(6,182,212,0.85)]"
          : "border-transparent bg-white/5 hover:border-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      <div
        className={[
          "relative mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-sm font-semibold text-white",
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
        <span
          className={[
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950",
            presence,
          ].join(" ")}
        />
      </div>
      <p className="mt-2 truncate text-xs font-semibold text-white">
        {chat.name}
      </p>
      <p className="mt-1 truncate text-[11px] text-slate-400">{chat.type}</p>
    </button>
  );
}

function DesktopChatCard({ chat, isActive, onSelectChat, onClose }) {
  const gradient = getChatGradient(chat.id);
  const presence = presenceTone[chat.presence] || "bg-slate-400";

  return (
    <button
      type="button"
      title={chat.name}
      onClick={() => {
        onSelectChat(chat.id);
        onClose();
      }}
      className={[
        "group flex w-full items-center gap-3 rounded-[24px] border px-3 py-3 text-left transition-all duration-200 sm:justify-center sm:px-0 lg:justify-start lg:px-3",
        isActive
          ? "border-cyan-400/30 bg-gradient-to-r from-cyan-400/20 via-sky-500/10 to-transparent shadow-[0_18px_60px_-28px_rgba(6,182,212,0.85)]"
          : "border-transparent bg-white/5 hover:border-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-sm font-semibold text-white",
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
        <span
          className={[
            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950",
            presence,
          ].join(" ")}
        />
      </div>

      <div className="min-w-0 flex-1 sm:hidden lg:block">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold text-white">{chat.name}</p>
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {chat.type}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-slate-300">
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
  onClose,
  onOpenAddFriend,
  onOpenCreateGroup,
  onOpenRequests,
  requestCount,
}) {
  return (
    <>
      <aside className="scrollbar-thin z-20 max-h-[42dvh] w-full shrink-0 overflow-y-auto sm:hidden">
        <div className="panel-surface rounded-[28px] px-3 py-3 shadow-glow">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">
                Chatify
              </p>
              <h1 className="mt-1 truncate font-display text-xl font-semibold text-white">
                {user?.username || "Messages"}
              </h1>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              disabled={isLoggingOut}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogoutIcon />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-sm font-semibold text-white">
                  {user?.username?.slice(0, 2)?.toUpperCase() || "ME"}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.username}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
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
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
              {chats.length} chats
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenAddFriend}
              title="Add friend"
              className="flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <UserPlusIcon />
              <span>Add friend</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateGroup}
              title="New group"
              className="flex items-center justify-center gap-2 rounded-[20px] border border-cyan-400/20 bg-cyan-400/10 px-3 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            >
              <UsersIcon />
              <span>New group</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenRequests}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-[20px] border border-amber-400/20 bg-amber-400/10 px-3 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-400/15"
          >
            <InboxIcon />
            <span>Requests</span>
            {requestCount > 0 ? (
              <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-bold text-slate-950">
                {requestCount}
              </span>
            ) : null}
          </button>

          <div className="mt-4">
            <p className="px-1 text-xs uppercase tracking-[0.28em] text-slate-400">
              Chats
            </p>
            {chats.length === 0 ? (
              <div className="mt-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
                Add a friend or create a group to start chatting.
              </div>
            ) : (
              <div className="scrollbar-thin mt-3 flex gap-2 overflow-x-auto pb-1">
                {chats.map((chat) => (
                  <MobileChatCard
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelectChat={onSelectChat}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <aside className="hidden h-full min-h-0 shrink-0 sm:block sm:w-[6.2rem] lg:w-80">
        <div className="panel-surface flex h-full min-h-0 flex-col rounded-[30px] px-2 py-4 shadow-glow lg:px-4">
          <div className="flex items-center justify-between border-b border-white/10 px-1 pb-4 sm:flex-col sm:gap-3 lg:flex-row lg:gap-0 lg:px-2">
            <div className="sm:flex sm:flex-col sm:items-center lg:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-base font-semibold text-white lg:hidden">
                C
              </div>
              <p className="hidden text-xs uppercase tracking-[0.32em] text-cyan-300/80 lg:block">
                Chatify
              </p>
              <h1 className="mt-2 hidden font-display text-2xl font-semibold text-white lg:block">
                Messages
              </h1>
            </div>
          </div>

          <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-3 lg:p-4">
            <div className="flex items-center gap-3 sm:flex-col lg:flex-row">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-lg font-semibold text-white">
                  {user?.username?.slice(0, 2)?.toUpperCase() || "ME"}
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1 sm:hidden lg:block">
                <p className="truncate text-base font-semibold text-white">
                  {user?.username}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
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
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
            <button
              type="button"
              onClick={onOpenAddFriend}
              title="Add friend"
              className="flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <UserPlusIcon />
              <span className="hidden lg:inline">Add friend</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateGroup}
              title="New group"
              className="flex items-center justify-center gap-2 rounded-[20px] border border-cyan-400/20 bg-cyan-400/10 px-3 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            >
              <UsersIcon />
              <span className="hidden lg:inline">New group</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenRequests}
            title="Requests"
            className="mt-2 flex items-center justify-center gap-2 rounded-[20px] border border-amber-400/20 bg-amber-400/10 px-3 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-400/15"
          >
            <InboxIcon />
            <span className="hidden lg:inline">Requests</span>
            {requestCount > 0 ? (
              <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-bold text-slate-950">
                {requestCount}
              </span>
            ) : null}
          </button>

          <div className="mt-6 hidden items-center justify-between px-2 lg:flex">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Chats
            </p>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {chats.length}
            </span>
          </div>

          <div className="scrollbar-thin mt-4 min-h-0 flex-1 overflow-y-auto pr-1 lg:pr-1">
            {chats.length === 0 ? (
              <div className="hidden rounded-[24px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm leading-6 text-slate-300 lg:block">
                Add a friend or create a group to start chatting.
              </div>
            ) : null}

            <div className="space-y-2">
              {chats.map((chat) => (
                <DesktopChatCard
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelectChat={onSelectChat}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            disabled={isLoggingOut}
            className="mt-4 flex items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogoutIcon />
            <span className="hidden lg:inline">
              {isLoggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
