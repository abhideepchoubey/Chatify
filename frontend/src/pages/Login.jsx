import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatifyLogo from "../components/ChatifyLogo";
import ModalShell from "../components/ModalShell";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Private chats",
    body: "One-to-one conversations with the same clean private feel people expect from WhatsApp.",
  },
  {
    title: "Friends and groups",
    body: "Add friends, create shared rooms, and keep every conversation persistent and searchable.",
  },
  {
    title: "Photo sharing",
    body: "Upload and send images directly in chat without leaving the conversation flow.",
  },
];

const mockMessages = [
  {
    side: "left",
    sender: "Ava",
    text: "Need the launch copy before 4 PM. Can you send it here?",
  },
  {
    side: "right",
    sender: "You",
    text: "Uploading the latest draft now. I also opened a private room for us.",
  },
  {
    side: "left",
    sender: "Ava",
    text: "Perfect. This feels exactly like the chat flow we needed.",
  },
];

const initialForm = {
  username: "",
  password: "",
  confirmPassword: "",
};

function ThemeIcon({ isLight }) {
  if (isLight) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.79A9 9 0 0 1 11.21 3c0 .21-.01.42-.01.63A9 9 0 1 0 20.37 13c.21 0 .42-.01.63-.01Z"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25M12 18.75V21M4.97 4.97l1.59 1.59M17.44 17.44l1.59 1.59M3 12h2.25M18.75 12H21M4.97 19.03l1.59-1.59M17.44 6.56l1.59-1.59"
      />
      <circle cx="12" cy="12" r="4.25" />
    </svg>
  );
}

function AuthForm({
  mode,
  form,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  isLight,
}) {
  const inputTone = isLight
    ? "border-slate-200 bg-white/90 text-slate-950 placeholder:text-slate-400 focus:border-sky-400/60"
    : "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400/40";
  const labelTone = isLight ? "text-slate-700" : "text-slate-200";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span
          className={["mb-2 block text-sm font-medium", labelTone].join(" ")}
        >
          Username
        </span>
        <input
          type="text"
          value={form.username}
          onChange={(event) => onChange("username", event.target.value)}
          placeholder="Enter your username"
          className={[
            "w-full rounded-[22px] border px-4 py-3.5 outline-none transition",
            inputTone,
          ].join(" ")}
        />
      </label>

      <label className="block">
        <span
          className={["mb-2 block text-sm font-medium", labelTone].join(" ")}
        >
          Password
        </span>
        <input
          type="password"
          value={form.password}
          onChange={(event) => onChange("password", event.target.value)}
          placeholder="Enter your password"
          className={[
            "w-full rounded-[22px] border px-4 py-3.5 outline-none transition",
            inputTone,
          ].join(" ")}
        />
      </label>

      {mode === "register" ? (
        <label className="block">
          <span
            className={["mb-2 block text-sm font-medium", labelTone].join(" ")}
          >
            Confirm password
          </span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              onChange("confirmPassword", event.target.value)
            }
            placeholder="Confirm your password"
            className={[
              "w-full rounded-[22px] border px-4 py-3.5 outline-none transition",
              inputTone,
            ].join(" ")}
          />
        </label>
      ) : null}

      {error ? (
        <div className="rounded-[22px] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-[22px] bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting
          ? mode === "login"
            ? "Signing in..."
            : "Creating account..."
          : mode === "login"
            ? "Login"
            : "Register"}
      </button>
    </form>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login, register, getApiMessage } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [authModalMode, setAuthModalMode] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLight = theme === "light";

  const tones = useMemo(
    () => ({
      shell: isLight
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_22%),linear-gradient(145deg,#f8fafc_0%,#e2e8f0_48%,#dbeafe_100%)] text-slate-950"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_22%),linear-gradient(145deg,#020617_0%,#0f172a_48%,#111827_100%)] text-white",
      heroCard: isLight
        ? "border-slate-200/80 bg-white/75"
        : "border-white/10 bg-white/5",
      muted: isLight ? "text-slate-600" : "text-slate-300",
      subtle: isLight ? "text-slate-500" : "text-slate-400",
      button: isLight
        ? "border border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
        : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
      panel: isLight
        ? "border-slate-200/80 bg-white/85 text-slate-950"
        : "border-white/10 bg-slate-950/75 text-white",
    }),
    [isLight]
  );

  const openModal = (mode) => {
    setForm(initialForm);
    setError("");
    setAuthModalMode(mode);
  };

  const closeModal = () => {
    setAuthModalMode(null);
    setForm(initialForm);
    setError("");
  };

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Username and password are required.");
      return;
    }

    if (
      authModalMode === "register" &&
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (authModalMode === "login") {
        await login({
          username: form.username.trim(),
          password: form.password,
        });
      } else {
        await register({
          username: form.username.trim(),
          password: form.password,
        });
      }

      closeModal();
      navigate("/chat", { replace: true });
    } catch (submitError) {
      setError(getApiMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={[
          "relative min-h-screen overflow-hidden px-4 py-8 transition-colors duration-500 sm:px-6 lg:px-8",
          tones.shell,
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div
            className={[
              "absolute left-[8%] top-[10%] h-40 w-40 rounded-full blur-3xl",
              isLight ? "bg-sky-400/25" : "bg-cyan-500/18",
            ].join(" ")}
          />
          <div
            className={[
              "absolute bottom-[8%] right-[10%] h-52 w-52 rounded-full blur-3xl",
              isLight ? "bg-emerald-400/20" : "bg-blue-600/18",
            ].join(" ")}
          />
        </div>

        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            onClick={() => openModal("login")}
            className={[
              "rounded-full px-5 py-3 text-sm font-semibold transition",
              tones.button,
            ].join(" ")}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => openModal("register")}
            className={[
              "rounded-full px-5 py-3 text-sm font-semibold transition",
              tones.button,
            ].join(" ")}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className={[
              "inline-flex h-12 w-12 items-center justify-center rounded-full transition",
              tones.button,
            ].join(" ")}
            aria-label={
              isLight ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <ThemeIcon isLight={isLight} />
          </button>
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <section className="relative pt-16 lg:pt-10">
            <ChatifyLogo tone={isLight ? "light" : "dark"} />

            <div className="mt-10 max-w-3xl">
              <p
                className={[
                  "text-sm uppercase tracking-[0.38em]",
                  tones.subtle,
                ].join(" ")}
              >
                Private chatting like WhatsApp
              </p>
              <h1
                className={[
                  "mt-4 font-display text-5xl font-semibold leading-[1.02] sm:text-6xl xl:text-7xl",
                  isLight ? "text-slate-950" : "text-white",
                ].join(" ")}
              >
                Chatify keeps conversations private, expressive, and instantly
                realtime.
              </h1>
              <p
                className={[
                  "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
                  tones.muted,
                ].join(" ")}
              >
                Add friends, create groups, upload photos, and move through
                direct chats with the same comfort and speed people love in
                modern private messaging apps.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={[
                    "animate-message-in rounded-[28px] border p-5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1",
                    tones.heroCard,
                  ].join(" ")}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.28em]",
                      tones.subtle,
                    ].join(" ")}
                  >
                    What Chatify Offers
                  </p>
                  <h2
                    className={[
                      "mt-3 font-display text-xl font-semibold",
                      isLight ? "text-slate-950" : "text-white",
                    ].join(" ")}
                  >
                    {feature.title}
                  </h2>
                  <p
                    className={["mt-3 text-sm leading-6", tones.muted].join(
                      " "
                    )}
                  >
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div
              className={[
                "relative overflow-hidden rounded-[34px] border p-5 backdrop-blur-xl sm:p-6",
                tones.heroCard,
              ].join(" ")}
            >
              <div
                className={[
                  "absolute inset-x-0 top-0 h-24 bg-gradient-to-r opacity-70",
                  isLight
                    ? "from-sky-300/30 via-white/50 to-emerald-300/30"
                    : "from-cyan-500/10 via-sky-500/15 to-blue-600/10",
                ].join(" ")}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.3em]",
                      tones.subtle,
                    ].join(" ")}
                  >
                    Private Messaging Preview
                  </p>
                  <h2
                    className={[
                      "mt-2 font-display text-2xl font-semibold",
                      isLight ? "text-slate-950" : "text-white",
                    ].join(" ")}
                  >
                    Built for direct conversation
                  </h2>
                </div>
                <div
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium",
                    isLight
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-emerald-400/15 text-emerald-300",
                  ].join(" ")}
                >
                  Live
                </div>
              </div>

              <div
                className={[
                  "mt-5 space-y-3 rounded-[28px] border p-4",
                  isLight
                    ? "border-slate-200 bg-slate-50/90"
                    : "border-white/10 bg-slate-950/65",
                ].join(" ")}
              >
                {mockMessages.map((message, index) => (
                  <div
                    key={`${message.sender}-${index}`}
                    className={[
                      "animate-message-in flex",
                      message.side === "right"
                        ? "justify-end"
                        : "justify-start",
                    ].join(" ")}
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div
                      className={[
                        "max-w-[82%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-lg",
                        message.side === "right"
                          ? "rounded-br-md bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white"
                          : isLight
                            ? "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                            : "rounded-bl-md border border-white/10 bg-white/8 text-slate-100",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "mb-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                          message.side === "right"
                            ? "text-white/70"
                            : tones.subtle,
                        ].join(" ")}
                      >
                        {message.sender}
                      </p>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div
                  className={["rounded-[24px] border p-4", tones.heroCard].join(
                    " "
                  )}
                >
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.3em]",
                      tones.subtle,
                    ].join(" ")}
                  >
                    Secure feel
                  </p>
                  <p
                    className={["mt-2 text-sm leading-6", tones.muted].join(
                      " "
                    )}
                  >
                    Fast direct rooms, friend-based access, and persistent
                    conversations with clean UI hierarchy.
                  </p>
                </div>
                <div
                  className={["rounded-[24px] border p-4", tones.heroCard].join(
                    " "
                  )}
                >
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.3em]",
                      tones.subtle,
                    ].join(" ")}
                  >
                    Media ready
                  </p>
                  <p
                    className={["mt-2 text-sm leading-6", tones.muted].join(
                      " "
                    )}
                  >
                    Share photos, create groups, and keep every message flowing
                    in realtime without leaving the thread.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ModalShell
        isOpen={Boolean(authModalMode)}
        onClose={closeModal}
        title={
          authModalMode === "register" ? "Create Your Account" : "Welcome Back"
        }
        description={
          authModalMode === "register"
            ? "Register a new account to add friends, create groups, and start private conversations."
            : "Sign in to continue your private chats, groups, and shared media."
        }
      >
        <div
          className={["rounded-[24px] border p-4 sm:p-5", tones.panel].join(
            " "
          )}
        >
          <AuthForm
            mode={authModalMode || "login"}
            form={form}
            error={error}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLight={isLight}
          />
        </div>
      </ModalShell>
    </>
  );
}
