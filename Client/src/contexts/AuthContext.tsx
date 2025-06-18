import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback, useRef } from "react";
import { GoogleLoginResponse, loginWithGoogle, logout as logoutService, refreshAccessToken as refreshAccessTokenService, getCurrentUser as fetchCurrentUserService } from "@Services/competency/authService";

interface AuthContextType {
  user: GoogleLoginResponse["user"] | null;
  accessToken: string | null;
  expiresIn: string | null;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<string | null>(null);
  const retryCounts = useRef<Record<string, number>>({});

  const login = useCallback(async (idToken: string) => {
    const { user, accessToken, expiresIn } = await loginWithGoogle(idToken);
    setUser(user);
    setAccessToken(accessToken);
    setExpiresIn(expiresIn);
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setAccessToken(null);
    setExpiresIn(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const { accessToken, expiresIn } = await refreshAccessTokenService();
      setAccessToken(accessToken);
      setExpiresIn(expiresIn);
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      setUser(null);
      setAccessToken(null);
      setExpiresIn(null);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!accessToken) return;
    try {
      const { user } = await fetchCurrentUserService(accessToken);
      setUser(user);
    } catch {
      const url = user?.profileImage;
      if (url) {
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
    const timeout = (parseInt(expiresIn, 10) - 60) * 1000; // refresh 1 minute before expiry
    const id = setTimeout(refreshAccessToken, timeout);
    return () => clearTimeout(id);
  }, [expiresIn, refreshAccessToken]);

  // Fetch profile on sign in or page load if token exists
  useEffect(() => {
    if (accessToken) {
      fetchCurrentUser();
    }
  }, [accessToken, fetchCurrentUser]);

  return <AuthContext.Provider value={{ user, accessToken, expiresIn, login, logout, refreshAccessToken, fetchCurrentUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
