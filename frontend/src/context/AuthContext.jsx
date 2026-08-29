import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
const WAKE_RETRY_DELAYS = [1200, 2200, 4000, 7000];

const normalizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  return {
    _id: payload._id,
    username: payload.username,
  };
};

const isAuthFailure = (error) =>
  error?.response?.status === 401 || error?.response?.status === 403;

const isBackendUnavailable = (error) => {
  const status = error?.response?.status;

  return (
    !error?.response ||
    status === 408 ||
    status === 425 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

const delay = (milliseconds) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const getApiMessage = (error) => {
  const apiMessage =
    error?.response?.data?.message || error?.response?.data?.error;

  if (apiMessage === "User exists") {
    return "User already exists";
  }

  if (apiMessage) {
    return apiMessage;
  }

  if (error?.response?.status === 404) {
    return "User doesn't exist";
  }

  if (error?.response?.status === 400) {
    return "User already exists";
  }

  if (isBackendUnavailable(error)) {
    return "The server is still waking up. Please try again.";
  }

  return error?.message || "Something went wrong";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("connecting");

  const waitForBackend = async () => {
    setBackendStatus("connecting");

    for (let attempt = 0; attempt <= WAKE_RETRY_DELAYS.length; attempt += 1) {
      try {
        await api.get("/health", { skipAuthRefresh: true });
        setBackendStatus("ready");
        return;
      } catch (error) {
        // A non-server response (including an older deployment's 404) means
        // Render is awake and ready to handle the real authentication request.
        if (error?.response && !isBackendUnavailable(error)) {
          setBackendStatus("ready");
          return;
        }

        if (attempt === WAKE_RETRY_DELAYS.length) {
          setBackendStatus("unavailable");
          throw error;
        }

        setBackendStatus("waking");
        await delay(WAKE_RETRY_DELAYS[attempt]);
      }
    }
  };

  const restoreSession = async () => {
    setLoading(true);

    try {
      await waitForBackend();
      const response = await api.get("/auth/me");
      setUser(normalizeUser(response.data?.data));
    } catch (error) {
      if (isAuthFailure(error)) {
        setUser(null);
      } else {
        console.error(getApiMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const authenticate = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const nextUser = normalizeUser(response.data?.data);

    setUser(nextUser);
    return nextUser;
  };

  const login = async (credentials) => {
    await waitForBackend();
    return authenticate(credentials);
  };

  const register = async (credentials) => {
    await waitForBackend();
    await api.post("/auth/register", credentials);
    return authenticate(credentials);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      if (!isAuthFailure(error)) {
        throw new Error(getApiMessage(error));
      }
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    backendStatus,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    restoreSession,
    getApiMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
