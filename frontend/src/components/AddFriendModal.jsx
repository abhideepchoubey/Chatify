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
      description="Search by username and send a friend request. They are added only after accepting."
      variant="drawer"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            Search users
          </span>
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by username"
            className="organic-input px-4 py-3.5 outline-none"
          />
        </label>

        {error ? (
          <div className="danger-banner px-4 py-3 text-sm">{error}</div>
        ) : null}

        {showInstruction ? (
          <div className="surface-muted rounded-[24px] px-5 py-8 text-center text-sm text-secondary">
            Search for a username to add a friend.
          </div>
        ) : null}

        {showNotFound ? (
          <div className="surface-muted rounded-[24px] px-5 py-8 text-center text-sm text-secondary">
            User doesn't exist.
          </div>
        ) : null}

        <div className="scrollbar-thin max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="surface-muted h-20 animate-pulse rounded-[24px]"
                />
              ))}
            </div>
          ) : null}

          {!loading
            ? results.map((result) => (
                <div
                  key={result._id}
                  className="surface-muted flex items-center gap-3 rounded-[24px] px-4 py-3"
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px_18px_18px_7px] bg-[var(--moss)] text-sm font-semibold text-[var(--canvas)]">
                      {getChatInitials(result.username)}
                    </div>
                    <span
                      className={[
                        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface-solid)]",
                        result.online
                          ? "bg-[var(--positive)]"
                          : "bg-[var(--warning)]",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary">
                      {result.username}
                    </p>
                    <p className="text-sm text-secondary">
                      {result.isFriend
                        ? "Already in your friends"
                        : result.requestStatus === "sent"
                          ? "Friend request sent"
                          : result.requestStatus === "received"
                            ? "Check your requests to respond"
                            : result.online
                              ? "Online now"
                              : "Offline"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddFriend(result)}
                    disabled={
                      result.isFriend ||
                      result.requestStatus !== "none" ||
                      submittingUserId === result._id
                    }
                    className="secondary-button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {result.isFriend
                      ? "Added"
                      : result.requestStatus === "sent"
                        ? "Sent"
                        : result.requestStatus === "received"
                          ? "Pending"
                          : submittingUserId === result._id
                            ? "Sending..."
                            : "Request"}
                  </button>
                </div>
              ))
            : null}
        </div>
      </div>
    </ModalShell>
  );
}
