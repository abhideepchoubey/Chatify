export default function ModalShell({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = "modal",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-40 flex",
        variant === "drawer"
          ? "items-stretch justify-end"
          : "items-center justify-center px-4 py-6",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#1f2921]/60 backdrop-blur-sm"
        aria-label="Close modal"
      />

      <div
        className={[
          "panel-surface relative z-10 w-full overflow-y-auto p-6",
          variant === "drawer"
            ? "scrollbar-thin max-w-lg rounded-l-[32px] animate-message-in sm:p-7"
            : "max-w-xl rounded-[30px] animate-message-in",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="eyebrow">Chatify</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-lg text-sm leading-6 text-secondary">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="icon-button h-11 w-11"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
