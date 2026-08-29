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
      variant="drawer"
    >
      <div className="space-y-4">
        {error ? (
          <div className="danger-banner px-4 py-3 text-sm">{error}</div>
        ) : null}

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="surface-muted h-24 animate-pulse rounded-[24px]"
              />
            ))}
          </div>
        ) : null}

        {!loading && requests.length === 0 ? (
          <div className="surface-muted rounded-[24px] px-5 py-10 text-center text-sm text-secondary">
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
                    className="surface-muted rounded-[24px] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px_18px_18px_7px] bg-[var(--moss)] text-sm font-semibold text-[var(--canvas)]">
                        {getChatInitials(request.sender?.username || "User")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-primary">
                          {request.sender?.username || "Unknown user"}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-secondary">
                          {isGroup
                            ? `Invited you to ${request.chat?.name || "a group"}`
                            : "Wants to add you as a friend"}
                        </p>
                      </div>
                      <span className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-raised)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                        {isGroup ? "Group" : "Friend"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onRespond(request._id, "declined")}
                        className="secondary-button px-4 py-2.5 text-sm disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onRespond(request._id, "accepted")}
                        className="primary-button px-4 py-2.5 text-sm disabled:opacity-50"
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
