export default function ChatifyLogo({ className = "", compact = false }) {
  return (
    <div className={["flex items-center gap-3", className].join(" ")}>
      <div className="soft-shadow relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px_18px_18px_7px] bg-[var(--moss)]">
        <svg
          viewBox="0 0 48 48"
          className="h-9 w-9"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10.5 13.5A5.5 5.5 0 0 1 16 8h16a5.5 5.5 0 0 1 5.5 5.5v10A5.5 5.5 0 0 1 32 29h-7l-7.6 6.2c-.9.8-2.4.1-2.4-1.1V29A5.5 5.5 0 0 1 10.5 23.5v-10Z"
            fill="var(--canvas)"
          />
          <path
            d="M17 20.8c5.7.1 9.6-2.2 13-6.1-.1 6.1-3.6 10-10.3 10.6"
            stroke="var(--terracotta)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M23.5 19.1c-.3 3.1-1.9 5.7-4.8 7.7"
            stroke="var(--terracotta)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!compact ? (
        <span className="font-display text-[1.7rem] font-semibold tracking-[-0.03em] text-primary">
          Chatify
        </span>
      ) : null}
    </div>
  );
}
