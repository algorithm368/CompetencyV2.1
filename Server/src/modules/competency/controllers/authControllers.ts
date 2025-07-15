import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "@Competency/services/authServices";
import { AuthenticatedRequest } from "@Middlewares/authMiddleware";

const isProduction = process.env.NODE_ENV === "production";

// Handle user login with Google OAuth
export const loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body;

  if (!idToken) {
    console.warn("[loginWithGoogle] Missing idToken");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "ID token is required for Google login" });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await AuthService.loginWithGoogle(idToken);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
    res.status(StatusCodes.OK).json({ user, accessToken, expiresIn: process.env.JWT_REFRESH_EXPIRATION || "3600" });
  } catch (err: any) {
    console.error("[loginWithGoogle] Login failed:", err.message || err);
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message || "Google login failed" });
  }
};

// Handle user logout by invalidating refresh token
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    console.warn("[logout] No refresh token found in cookies");
    res.sendStatus(StatusCodes.NO_CONTENT);
    return;
  }

  try {
    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });

    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error("[logout] Logout error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message || "Logout failed" });
  }
};

// Handle access token renewal using a refresh token
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.warn("[refreshAccessToken] Missing refresh token");
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshToken(refreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(StatusCodes.OK).json({ accessToken, expiresIn: process.env.JWT_REFRESH_EXPIRATION || "3600" });
  } catch (err) {
    console.error("Refresh token failed:", err);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token expired or invalid" });
  }
};

// Return current authenticated user info
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.user?.userId);
    const user = await AuthService.getCurrentUser(userId);
    res.status(StatusCodes.OK).json({ user });
  } catch (err: any) {
    console.error("[getCurrentUser] User not found:", err);
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message || "User not found" });
  }
};
