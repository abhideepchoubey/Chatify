import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function SplashScreen({ backendStatus = "connecting", onRetry }) {
  const isUnavailable = backendStatus === "unavailable";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface w-full max-w-md rounded-[30px] px-6 py-10 text-center">
        <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-[20px_20px_20px_7px] bg-[var(--moss)]" />
        <h1 className="font-display text-3xl font-semibold text-primary">
          {isUnavailable
            ? "The server is taking longer"
            : "Preparing your workspace"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          {isUnavailable
            ? "Chatify could not reach the backend yet. Try the connection again."
            : backendStatus === "waking"
              ? "The backend is waking up. Your session will continue automatically."
              : "Restoring your session and connecting chat services."}
        </p>
        {isUnavailable && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="primary-button mt-6 px-6 py-3 text-sm"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading, backendStatus, restoreSession } = useAuth();

  if (loading || (!user && backendStatus === "unavailable")) {
    return (
      <SplashScreen
        backendStatus={backendStatus}
        onRetry={backendStatus === "unavailable" ? restoreSession : undefined}
      />
    );
  }

  return user ? children : <Navigate replace to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate replace to="/" />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
