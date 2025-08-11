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
import { initApiInterceptors } from "@Services/api";

interface AuthContextType {
  user: GoogleLoginResponse["user"] | null;
  accessToken: string | null;
  expiresIn: number | null;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const retryCounts = useRef<Record<string, number>>({});

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await refreshAccessTokenService();
      setAccessToken(response.accessToken);
      setExpiresIn(response.expiresIn);

      // Store in localStorage with consistent keys
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("expiresIn", response.expiresIn.toString());
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      setUser(null);
      setAccessToken(null);
      setExpiresIn(null);

      // Clear localStorage with consistent keys
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("user");
    }
  }, []);

  // Initialize API interceptors and auth state from localStorage on mount
  useEffect(() => {
    // Initialize API interceptors first
    initApiInterceptors();
    
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const storedExpiresIn = localStorage.getItem("expiresIn");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedExpiresIn && storedUser) {
          const expiresInNumber = parseInt(storedExpiresIn, 10);
          const userObject = JSON.parse(storedUser);

          // Check if token is still valid (not expired)
          const currentTime = Math.floor(Date.now() / 1000);
          if (currentTime < expiresInNumber) {
            setAccessToken(storedToken);
            setExpiresIn(expiresInNumber);
            setUser(userObject);
          } else {
            // Token expired, try to refresh
            try {
              await refreshAccessToken();
            } catch {
              // Refresh failed, clear storage
              localStorage.removeItem("accessToken");
              localStorage.removeItem("expiresIn");
              localStorage.removeItem("user");
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear corrupted data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("user");
      } finally {
        // Set loading to false regardless of success or failure
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshAccessToken]);

  const login = useCallback(async (idToken: string) => {
    const { user, accessToken, expiresIn } = await loginWithGoogle(idToken);
    setUser(user);
    setAccessToken(accessToken);
    setExpiresIn(expiresIn);

    // Store in localStorage with consistent keys
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("expiresIn", expiresIn.toString());
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    setAccessToken(null);
    setExpiresIn(null);

    // Clear localStorage with consistent keys
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("user");
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await fetchCurrentUserService(accessToken);
      setUser(response.user);

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));

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
      isLoading,
      login,
      logout,
      refreshAccessToken,
      fetchCurrentUser,
    }),
    [
      user,
      accessToken,
      expiresIn,
      isLoading,
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
