export default function ModalShell({
  isOpen,
  onClose,
  title,
  description,
  children,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        aria-label="Close modal"
      />

      <div className="panel-surface relative z-10 w-full max-w-xl rounded-[30px] border border-white/10 p-6 shadow-glow">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
              Chatify
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="soft-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-lg leading-none">x</span>
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
