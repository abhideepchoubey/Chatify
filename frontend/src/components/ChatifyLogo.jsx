export default function ChatifyLogo({
  tone = "dark",
  className = "",
  compact = false,
}) {
  const isLight = tone === "light";
  const accent = isLight
    ? "from-sky-500 via-cyan-500 to-emerald-500"
    : "from-cyan-300 via-sky-400 to-blue-500";
  const textTone = isLight ? "text-slate-950" : "text-white";
  const subTone = isLight ? "text-slate-600" : "text-slate-300";

  return (
    <div className={["flex items-center gap-3", className].join(" ")}>
      <div
        className={[
          "relative flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br shadow-lg shadow-cyan-950/20",
          accent,
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-white"
          fill="none"
        >
          <path
            d="M11 13.5C11 10.4624 13.4624 8 16.5 8H31.5C34.5376 8 37 10.4624 37 13.5V23.5C37 26.5376 34.5376 29 31.5 29H25.8L18.5 35.2C17.5357 36.0189 16 35.3338 16 34.0685V29H16.5C13.4624 29 11 26.5376 11 23.5V13.5Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          <path
            d="M16 18C16 16.8954 16.8954 16 18 16H30C31.1046 16 32 16.8954 32 18C32 19.1046 31.1046 20 30 20H18C16.8954 20 16 19.1046 16 18ZM16 24C16 22.8954 16.8954 22 18 22H25C26.1046 22 27 22.8954 27 24C27 25.1046 26.1046 26 25 26H18C16.8954 26 16 25.1046 16 24Z"
            fill="#0F172A"
            fillOpacity="0.28"
          />
        </svg>
      </div>

      {!compact ? (
        <div>
          <p className={["font-display text-xl font-semibold", textTone].join(" ")}>
            Chatify
          </p>
          <p className={["text-xs uppercase tracking-[0.3em]", subTone].join(" ")}>
            Private Realtime Chat
          </p>
        </div>
      ) : null}
    </div>
  );
}
