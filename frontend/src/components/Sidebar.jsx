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
}) {
  return (
    <aside
      className={[
        "relative z-10 w-full shrink-0 px-0 py-0",
        "sm:static sm:z-0 sm:w-[6.2rem] lg:w-80",
      ].join(" ")}
    >
      <div className="panel-surface flex h-full max-h-[42vh] flex-col rounded-[30px] px-3 py-4 shadow-glow sm:max-h-none sm:px-2 lg:px-4">
        <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4 sm:flex-col sm:gap-3 sm:px-1 lg:flex-row lg:gap-0 lg:px-2">
          <div className="sm:flex sm:flex-col sm:items-center lg:block">
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-base font-semibold text-white sm:flex lg:hidden">
              C
            </div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80 sm:hidden lg:block">
              Chatify
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:hidden lg:block">
              Messages
            </h1>
          </div>
          <button type="button" onClick={onClose} className="hidden">
            <span className="text-lg leading-none">x</span>
          </button>
        </div>

        <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-4 sm:p-3 lg:p-4">
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

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-2">
          <button
            type="button"
            onClick={onOpenAddFriend}
            title="Add friend"
            className="flex items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <UserPlusIcon />
            <span className="sm:hidden lg:inline">Add friend</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateGroup}
            title="New group"
            className="flex items-center justify-center gap-2 rounded-[20px] border border-cyan-400/20 bg-cyan-400/10 px-3 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
          >
            <UsersIcon />
            <span className="sm:hidden lg:inline">New group</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between px-2 sm:hidden lg:flex">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Chats
          </p>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {chats.length}
          </span>
        </div>

        <div className="scrollbar-thin mt-4 flex-1 overflow-y-auto pr-1 sm:pr-0 lg:pr-1">
          {chats.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm leading-6 text-slate-300 sm:hidden lg:block">
              Add a friend or create a group to start chatting.
            </div>
          ) : null}

          <div className="space-y-2">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const gradient = getChatGradient(chat.id);
              const presence = presenceTone[chat.presence] || "bg-slate-400";

              return (
                <button
                  key={chat.id}
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
                      <p className="truncate font-semibold text-white">
                        {chat.name}
                      </p>
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
            })}
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
          <span className="sm:hidden lg:inline">
            {isLoggingOut ? "Signing out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
