import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useRef,
} from "react";

import {
  GoogleLoginResponse,
  loginWithGoogle,
  logout as logoutService,
  refreshAccessToken as refreshAccessTokenService,
  getCurrentUser as fetchCurrentUserService,
} from "@Services/competency/authService";

interface AuthContextType {
  user: GoogleLoginResponse["user"] | null;
  accessToken: string | null;
  expiresIn: number | null;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const retryCounts = useRef<Record<string, number>>({});

  const login = useCallback(async (idToken: string) => {
    const { user, accessToken, expiresIn } = await loginWithGoogle(idToken);
    setUser(user);
    setAccessToken(accessToken);
    setExpiresIn(expiresIn);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expiresIn", expiresIn);
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setAccessToken(null);
    setExpiresIn(null);

    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await refreshAccessTokenService();
      setAccessToken(response.accessToken);
      setExpiresIn(response.expiresIn);

      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("expiresIn", response.expiresIn.toString());
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      setUser(null);
      setAccessToken(null);
      setExpiresIn(null);

      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await fetchCurrentUserService(accessToken);
      setUser(response.user);
      retryCounts.current = {};
    } catch {
      if (user?.profileImage) {
        const url = user.profileImage;
        const count = retryCounts.current[url] || 0;
        if (count < 3) {
          retryCounts.current[url] = count + 1;
          setTimeout(() => {
            fetchCurrentUser();
          }, Math.pow(2, count) * 1000);
        } else {
          console.error("Max retry reached. Cannot fetch user.");
        }
      }
    }
  }, [accessToken, user?.profileImage]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!expiresIn) return;
    const timeout = (expiresIn - 60) * 1000;
    if (timeout <= 0) {
      refreshAccessToken();
      return;
    }
    const id = setTimeout(refreshAccessToken, timeout);
    return () => clearTimeout(id);
  }, [expiresIn, refreshAccessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchCurrentUser();
    }
  }, [accessToken, fetchCurrentUser]);

  const contextValue = React.useMemo(
    () => ({
      user,
      accessToken,
      expiresIn,
      login,
      logout,
      refreshAccessToken,
      fetchCurrentUser,
    }),
    [
      user,
      accessToken,
      expiresIn,
      login,
      logout,
      refreshAccessToken,
      fetchCurrentUser,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
