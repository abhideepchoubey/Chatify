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
      description="Pick at least two friends, name the space, and create a persistent group chat."
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Group name
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Design review squad"
            className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/8"
          />
        </label>

        {error ? (
          <div className="rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">
              Select friends
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {selectedMemberIds.length} selected
            </span>
          </div>

          <div className="scrollbar-thin max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {friends.length === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-slate-300">
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
                      ? "border-cyan-400/30 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-sm font-semibold text-white">
                      {getChatInitials(friend.username)}
                    </div>
                    <span
                      className={[
                        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950",
                        friend.online ? "bg-emerald-400" : "bg-amber-400",
                      ].join(" ")}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {friend.username}
                    </p>
                    <p className="text-sm text-slate-300">
                      {friend.online ? "Online now" : "Offline"}
                    </p>
                  </div>

                  <div
                    className={[
                      "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                      isSelected
                        ? "border-cyan-300 bg-cyan-400 text-slate-950"
                        : "border-white/20 text-white/60",
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
          className="inline-flex w-full items-center justify-center rounded-[22px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating group..." : "Create group"}
        </button>
      </div>
    </ModalShell>
  );
}

