import { useEffect, useRef } from "react";

export default function InputBar({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
  selectedImage,
  onSelectImage,
  onClearImage,
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
    <div className="border-t border-white/10 bg-slate-950/65 p-4 sm:p-5">
      <div className="panel-surface flex items-end gap-3 rounded-[28px] border border-white/10 bg-white/5 px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const [file] = event.target.files || [];
            onSelectImage(file || null);
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

      {selectedImage ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={selectedImage.preview}
              alt={selectedImage.file.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {selectedImage.file.name}
              </p>
              <p className="text-xs text-slate-400">
                {isUploadingImage
                  ? "Uploading photo..."
                  : "Photo ready to send"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClearImage}
            className="rounded-[16px] border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
