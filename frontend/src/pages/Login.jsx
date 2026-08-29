import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatifyLogo from "../components/ChatifyLogo";
import ModalShell from "../components/ModalShell";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  username: "",
  password: "",
  confirmPassword: "",
};

const features = [
  {
    number: "01",
    title: "Private conversations",
    body: "Start direct chats only after a friend request has been accepted.",
  },
  {
    number: "02",
    title: "Groups by invitation",
    body: "Create group spaces and let each invited member choose whether to join.",
  },
  {
    number: "03",
    title: "Files without friction",
    body: "Share several photos or files in one message and download them from the thread.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PreparingWorkspace({ backendStatus }) {
  const isWaking = backendStatus === "waking" || backendStatus === "connecting";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface w-full max-w-md animate-message-in rounded-[32px] px-7 py-10 text-center sm:px-10">
        <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[28px_28px_28px_10px] bg-[var(--moss)]">
          <div className="absolute inset-[-8px] animate-spin rounded-[34px] border-2 border-transparent border-t-[var(--ochre)]" />
          <svg
            viewBox="0 0 48 48"
            className="h-11 w-11"
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
          </svg>
        </div>
        <p className="eyebrow">Chatify</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-primary">
          Preparing your workspace
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          {isWaking
            ? "The chat server is waking up and securing your session."
            : "Your conversations are loading and realtime services are connecting."}
        </p>
        <div className="surface-muted mt-7 h-2 overflow-hidden rounded-full">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--terracotta)]" />
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode, form, error, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-primary">
          Username
        </span>
        <input
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={(event) => onChange("username", event.target.value)}
          placeholder="Enter your username"
          className="organic-input px-4 py-3.5 outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-primary">
          Password
        </span>
        <input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={form.password}
          onChange={(event) => onChange("password", event.target.value)}
          placeholder="Enter your password"
          className="organic-input px-4 py-3.5 outline-none"
        />
      </label>

      {mode === "register" ? (
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">
            Confirm password
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) =>
              onChange("confirmPassword", event.target.value)
            }
            placeholder="Confirm your password"
            className="organic-input px-4 py-3.5 outline-none"
          />
        </label>
      ) : null}

      {error ? (
        <div className="danger-banner px-4 py-3 text-sm">{error}</div>
      ) : null}

      <button type="submit" className="primary-button w-full px-5 py-4 text-sm">
        {mode === "login" ? "Login" : "Register"}
        <ArrowIcon />
      </button>
    </form>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-[64%_36%_56%_44%] bg-[var(--sage)] opacity-35 blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-40 w-40 rounded-[44%_56%_37%_63%] bg-[var(--clay)] opacity-35 blur-2xl" />

      <div className="panel-surface relative overflow-hidden rounded-[34px] p-3 sm:p-4">
        <div className="grid min-h-[30rem] grid-cols-[5.5rem_1fr] gap-3 sm:grid-cols-[13rem_1fr]">
          <aside className="surface-muted rounded-[26px] p-3">
            <div className="mb-5 flex items-center gap-2">
              <div className="h-9 w-9 rounded-[14px_14px_14px_5px] bg-[var(--moss)]" />
              <span className="hidden text-sm font-semibold text-primary sm:block">
                Conversations
              </span>
            </div>
            <div className="space-y-2">
              {["Direct", "Groups", "Requests"].map((label, index) => (
                <div
                  key={label}
                  className={[
                    "flex items-center gap-2 rounded-2xl p-2.5",
                    index === 0 ? "bg-[var(--surface-raised)]" : "",
                  ].join(" ")}
                >
                  <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--sage)]" />
                  <span className="hidden text-xs font-medium text-secondary sm:block">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <section className="surface-muted flex min-w-0 flex-col overflow-hidden rounded-[26px]">
            <header className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-4">
              <div className="h-10 w-10 rounded-[50%_50%_50%_32%] bg-[var(--terracotta)]" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Private chat
                </p>
                <p className="mt-1 text-[11px] text-tertiary">
                  Realtime connection
                </p>
              </div>
            </header>

            <div className="flex flex-1 flex-col justify-end gap-3 p-4 sm:p-5">
              <div className="h-14 w-[78%] rounded-[22px_22px_22px_8px] bg-[var(--surface-raised)]" />
              <div className="ml-auto h-20 w-[82%] rounded-[22px_22px_8px_22px] bg-[var(--moss)] opacity-90" />
              <div className="h-12 w-[58%] rounded-[22px_22px_22px_8px] bg-[var(--surface-raised)]" />
            </div>

            <div className="m-3 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] p-2">
              <div className="h-9 w-9 rounded-full bg-[var(--surface-raised)]" />
              <span className="flex-1 pl-1 text-xs text-tertiary">
                Write a message
              </span>
              <div className="h-9 w-9 rounded-full bg-[var(--terracotta)]" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { user, login, register, getApiMessage, backendStatus } = useAuth();
  const [authModalMode, setAuthModalMode] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setForm((current) => ({ ...current, [field]: value }));
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
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <PreparingWorkspace backendStatus={backendStatus} />;
  }

  return (
    <>
      <div className="relative overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <ChatifyLogo />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (user ? navigate("/chat") : openModal("login"))}
                className="secondary-button px-4 py-2.5 text-sm sm:px-5"
              >
                {user ? "Open chat" : "Login"}
              </button>
              {!user ? (
                <button
                  type="button"
                  onClick={() => openModal("register")}
                  className="primary-button px-4 py-2.5 text-sm sm:px-5"
                >
                  Register
                </button>
              ) : null}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main>
          <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
            <div className="animate-message-in">
              <p className="eyebrow">Private messaging, with permission</p>
              <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-primary sm:text-6xl xl:text-7xl">
                A calmer place for the people you choose.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-secondary sm:text-lg">
                Chatify brings direct messages, group invitations, and shared
                files into one focused workspace without adding people before
                they accept.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    user ? navigate("/chat") : openModal("register")
                  }
                  className="primary-button px-6 py-3.5 text-sm"
                >
                  {user ? "Open chat" : "Create an account"}
                  <ArrowIcon />
                </button>
                {!user ? (
                  <button
                    type="button"
                    onClick={() => openModal("login")}
                    className="secondary-button px-6 py-3.5 text-sm"
                  >
                    I already have an account
                  </button>
                ) : null}
              </div>
            </div>

            <WorkspacePreview />
          </section>

          <section className="border-y border-[var(--line)] bg-[var(--surface-muted)]">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className="eyebrow">What Chatify offers</p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] text-primary sm:text-5xl">
                  The essentials stay close. Everything else stays quiet.
                </h2>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <article
                    key={feature.title}
                    className="panel-surface animate-message-in rounded-[30px] p-6 sm:p-7"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="font-display text-4xl font-semibold text-[var(--clay)]">
                      {feature.number}
                    </span>
                    <h3 className="mt-10 font-display text-2xl font-semibold text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-secondary">
                      {feature.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="panel-surface relative overflow-hidden rounded-[36px] px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="absolute -left-16 -top-20 h-56 w-56 rounded-[60%_40%_65%_35%] bg-[var(--sage)] opacity-20" />
              <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-[38%_62%_42%_58%] bg-[var(--terracotta)] opacity-20" />
              <div className="relative mx-auto max-w-2xl">
                <p className="eyebrow">Ready when you are</p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.035em] text-primary sm:text-5xl">
                  Start with one conversation.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-secondary sm:text-base">
                  Create your account, send a friend request, and begin chatting
                  after it is accepted.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    user ? navigate("/chat") : openModal("register")
                  }
                  className="primary-button mt-8 px-7 py-3.5 text-sm"
                >
                  {user ? "Open chat" : "Get started"}
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--line)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-sm text-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <ChatifyLogo compact />
            <p>Private chats, group invitations, and shared files.</p>
          </div>
        </footer>
      </div>

      <ModalShell
        isOpen={Boolean(authModalMode)}
        onClose={closeModal}
        title={
          authModalMode === "register" ? "Create your account" : "Welcome back"
        }
        description={
          authModalMode === "register"
            ? "Register to send friend requests and create group conversations."
            : "Sign in to continue your conversations and shared files."
        }
      >
        <AuthForm
          mode={authModalMode || "login"}
          form={form}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </ModalShell>
    </>
  );
}
