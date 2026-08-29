import ModalShell from "./ModalShell";
import { getChatInitials } from "../utils/chat";

export default function CreateGroupModal({
  isOpen,
  onClose,
  friends,
  name,
  onNameChange,
  selectedMemberIds,
  onToggleMember,
  onSubmit,
  isSubmitting,
  error,
}) {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create Group"
      description="Pick at least two friends and send group invitations. Each person joins only after accepting."
      variant="drawer"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            Group name
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Design review squad"
            className="organic-input px-4 py-3.5 outline-none"
          />
        </label>

        {error ? (
          <div className="danger-banner px-4 py-3 text-sm">{error}</div>
        ) : null}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              Select friends
            </span>
            <span className="surface-muted rounded-full px-3 py-1 text-xs text-secondary">
              {selectedMemberIds.length} selected
            </span>
          </div>

          <div className="scrollbar-thin max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {friends.length === 0 ? (
              <div className="surface-muted rounded-[24px] px-5 py-8 text-center text-sm text-secondary">
                Add friends first to create a group.
              </div>
            ) : null}

            {friends.map((friend) => {
              const isSelected = selectedMemberIds.includes(friend._id);

              return (
                <button
                  key={friend._id}
                  type="button"
                  onClick={() => onToggleMember(friend._id)}
                  className={[
                    "flex w-full items-center gap-3 rounded-[24px] border px-4 py-3 text-left transition",
                    isSelected
                      ? "border-[var(--moss)] bg-[var(--surface-raised)]"
                      : "border-[var(--line)] bg-[var(--surface-muted)] hover:border-[var(--line-strong)]",
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px_18px_18px_7px] bg-[var(--moss)] text-sm font-semibold text-[var(--canvas)]">
                      {getChatInitials(friend.username)}
                    </div>
                    <span
                      className={[
                        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface-solid)]",
                        friend.online
                          ? "bg-[var(--positive)]"
                          : "bg-[var(--warning)]",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary">
                      {friend.username}
                    </p>
                    <p className="text-sm text-secondary">
                      {friend.online ? "Online now" : "Offline"}
                    </p>
                  </div>

                  <div
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                      isSelected
                        ? "border-[var(--moss)] bg-[var(--moss)] text-[var(--canvas)]"
                        : "border-[var(--line-strong)] text-tertiary",
                    ].join(" ")}
                  >
                    {isSelected ? "v" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="primary-button w-full px-4 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending invitations..." : "Create and invite"}
        </button>
      </div>
    </ModalShell>
  );
}
