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
    <div className="shrink-0 border-t border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4">
      <div className="surface-muted flex items-end gap-2 rounded-[26px] px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
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
          className="icon-button h-11 w-11 sm:h-12 sm:w-12"
          aria-label="Attach files"
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
              d="m12.7 7.3-5.9 5.9a3 3 0 1 0 4.2 4.2l7.3-7.3a5 5 0 0 0-7.1-7.1L4.7 9.5"
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
          className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent text-sm leading-7 text-primary outline-none placeholder:text-[var(--text-faint)]"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="primary-button h-11 w-11 shrink-0 p-0 sm:h-12 sm:w-12 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
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
        <div className="surface-muted mt-3 rounded-[22px] p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-secondary">
              {isUploadingImage
                ? "Uploading files..."
                : `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} ready`}
            </p>
            <button
              type="button"
              onClick={onClearFiles}
              className="text-xs font-medium text-tertiary transition hover:text-primary"
            >
              Clear all
            </button>
          </div>

          <div className="scrollbar-thin flex max-h-28 gap-2 overflow-x-auto pb-1">
            {selectedFiles.map((entry, index) => (
              <div
                key={`${entry.file.name}-${entry.file.lastModified}-${index}`}
                className="flex min-w-[13rem] items-center gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface-raised)] p-2"
              >
                {entry.preview ? (
                  <img
                    src={entry.preview}
                    alt={entry.file.name}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--moss)] text-xs font-bold uppercase text-[var(--canvas)]">
                    {entry.file.name.split(".").pop()?.slice(0, 4) || "File"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-primary">
                    {entry.file.name}
                  </p>
                  <p className="mt-1 text-[11px] text-tertiary">
                    {formatFileSize(entry.file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="icon-button h-8 w-8 text-sm"
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
