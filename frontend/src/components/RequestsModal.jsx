import ModalShell from "./ModalShell";
import { getChatInitials } from "../utils/chat";

export default function RequestsModal({
  isOpen,
  onClose,
  requests,
  loading,
  error,
  actionRequestId,
  onRespond,
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Requests"
      description="Review friend requests and group invitations before they are added to your chats."
    >
      <div className="space-y-4">
        {error ? (
          <div className="rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-[24px] border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : null}

        {!loading && requests.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-slate-300">
            You have no pending requests.
          </div>
        ) : null}

        <div className="scrollbar-thin max-h-[430px] space-y-2 overflow-y-auto pr-1">
          {!loading
            ? requests.map((request) => {
                const isSubmitting = actionRequestId === request._id;
                const isGroup = request.type === "group";

                return (
                  <div
                    key={request._id}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-sm font-semibold text-white">
                        {getChatInitials(request.sender?.username || "User")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">
                          {request.sender?.username || "Unknown user"}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-300">
                          {isGroup
                            ? `Invited you to ${request.chat?.name || "a group"}`
                            : "Wants to add you as a friend"}
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200">
                        {isGroup ? "Group" : "Friend"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onRespond(request._id, "declined")}
                        className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onRespond(request._id, "accepted")}
                        className="rounded-[18px] bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                      >
                        {isSubmitting ? "Updating..." : "Accept"}
                      </button>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </ModalShell>
  );
}
