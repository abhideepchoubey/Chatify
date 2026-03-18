import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const normalizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  return {
    _id: payload._id,
    username: payload.username,
  };
};

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

  return error?.message || "Something went wrong";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await api.get("/auth/me");

        if (isMounted) {
          setUser(normalizeUser(response.data?.data));
        }
      } catch (error) {
        if (
          isMounted &&
          error?.response?.status !== 401 &&
          error?.response?.status !== 403
        ) {
          console.error(getApiMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const nextUser = normalizeUser(response.data?.data);

    setUser(nextUser);
    return nextUser;
  };

  const register = async (credentials) => {
    await api.post("/auth/register", credentials);
    return login(credentials);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        throw new Error(getApiMessage(error));
      }
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
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
