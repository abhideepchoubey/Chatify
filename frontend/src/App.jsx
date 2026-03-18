import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface w-full max-w-md rounded-[28px] px-6 py-10 text-center shadow-glow">
        <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600" />
        <h1 className="font-display text-2xl font-semibold text-white">
          Preparing your workspace
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Restoring your session and connecting chat services.
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return user ? children : <Navigate replace to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return user ? <Navigate replace to="/chat" /> : children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate replace to={user ? "/chat" : "/login"} />}
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate replace to={user ? "/chat" : "/login"} />}
      />
    </Routes>
  );
}
