import { useEffect, useRef } from "react";

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function InputBar({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
  selectedFiles,
  onSelectFiles,
  onRemoveFile,
  onClearFiles,
  isUploadingImage,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [value]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-white/10 bg-slate-950/65 p-4 sm:p-5">
      <div className="panel-surface flex items-end gap-3 rounded-[28px] border border-white/10 bg-white/5 px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            onSelectFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 7.5h10.5m-10.5 4.5h10.5m-10.5 4.5h6.75M3.75 5.25A2.25 2.25 0 0 1 6 3h12a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V5.25Z"
            />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent text-sm leading-7 text-white outline-none placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-950/50 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.105 3.105a.75.75 0 0 1 .799-.182l17.25 6a.75.75 0 0 1 0 1.414l-17.25 6A.75.75 0 0 1 3 15.625V11.46a.75.75 0 0 1 .553-.723l7.787-2.112-7.79-2.115A.75.75 0 0 1 3 5.788V3.75c0-.25.124-.484.332-.645a.752.752 0 0 1 .773-.001Z" />
          </svg>
        </button>
      </div>

      {selectedFiles.length > 0 ? (
        <div className="mt-3 rounded-[22px] border border-white/10 bg-white/5 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              {isUploadingImage
                ? "Uploading files..."
                : `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} ready`}
            </p>
            <button
              type="button"
              onClick={onClearFiles}
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Clear all
            </button>
          </div>

          <div className="scrollbar-thin flex max-h-28 gap-2 overflow-x-auto pb-1">
            {selectedFiles.map((entry, index) => (
              <div
                key={`${entry.file.name}-${entry.file.lastModified}-${index}`}
                className="flex min-w-[13rem] items-center gap-3 rounded-[18px] border border-white/10 bg-slate-950/35 p-2"
              >
                {entry.preview ? (
                  <img
                    src={entry.preview}
                    alt={entry.file.name}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xs font-bold uppercase text-cyan-200">
                    {entry.file.name.split(".").pop()?.slice(0, 4) || "File"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">
                    {entry.file.name}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {formatFileSize(entry.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label={`Remove ${entry.file.name}`}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
