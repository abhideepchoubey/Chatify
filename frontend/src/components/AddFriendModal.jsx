import ModalShell from "./ModalShell";
import { getChatInitials } from "../utils/chat";

export default function AddFriendModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  onAddFriend,
  loading,
  submittingUserId,
  error,
  hasSearched,
}) {
  const trimmedQuery = query.trim();
  const showInstruction = !trimmedQuery;
  const showNotFound =
    trimmedQuery && hasSearched && !loading && results.length === 0 && !error;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Add Friend"
      description="Search by username and add people directly into your chat list."
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Search users
          </span>
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by username"
            className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/8"
          />
        </label>

        {error ? (
          <div className="rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {showInstruction ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300">
            Search for a username to add a friend.
          </div>
        ) : null}

        {showNotFound ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300">
            User doesn't exist.
          </div>
        ) : null}

        <div className="scrollbar-thin max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-[24px] border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : null}

          {!loading
            ? results.map((result) => (
                <div
                  key={result._id}
                  className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-sm font-semibold text-white">
                      {getChatInitials(result.username)}
                    </div>
                    <span
                      className={[
                        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950",
                        result.online ? "bg-emerald-400" : "bg-amber-400",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {result.username}
                    </p>
                    <p className="text-sm text-slate-300">
                      {result.isFriend
                        ? "Already in your friends"
                        : result.online
                          ? "Online now"
                          : "Offline"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddFriend(result)}
                    disabled={
                      result.isFriend || submittingUserId === result._id
                    }
                    className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {result.isFriend
                      ? "Added"
                      : submittingUserId === result._id
                        ? "Adding..."
                        : "Add"}
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </ModalShell>
  );
}
