import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "@Competency/services/authServices";
import { AuthenticatedRequest } from "@Middlewares/authMiddleware";

const ACCESS_TOKEN_EXPIRATION = Number(process.env.JWT_ACCESS_EXPIRATION || 3600);
const REFRESH_TOKEN_MAX_AGE = Number(process.env.JWT_REFRESH_EXPIRATION || 604800);

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: ACCESS_TOKEN_EXPIRATION * 1000,
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  maxAge: REFRESH_TOKEN_MAX_AGE * 1000,
};

const CSRF_COOKIE_OPTIONS = {
  ...ACCESS_TOKEN_COOKIE_OPTIONS,
  httpOnly: false,
};

// Login with Google
export const loginWithGoogle = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "ID token is required" });
  }

  try {
    const { user, accessToken, refreshToken, csrfToken } = await AuthService.loginWithGoogle(idToken);

    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie("csrfToken", csrfToken, CSRF_COOKIE_OPTIONS);

    res.status(StatusCodes.OK).json({
      user,
      accessToken,
      csrfToken,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
      provider: "google",
    });
  } catch (err: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message || "Google login failed" });
  }
};

// Logout
export const logout = async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(StatusCodes.NO_CONTENT);

  try {
    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });

    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error("Logout error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message || "Logout failed" });
  }
};

// Refresh token
export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Refresh token is required" });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken, csrfToken } = await AuthService.refreshToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie("csrfToken", csrfToken, CSRF_COOKIE_OPTIONS);

    res.status(StatusCodes.OK).json({
      accessToken,
      csrfToken,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  } catch (err) {
    console.error("[refreshAccessToken] Refresh failed:", err);
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("csrfToken", { path: "/" });
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token expired or invalid" });
  }
};

// Get current authenticated user
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "No authenticated user" });
    }

    const user = await AuthService.getCurrentUser(String(req.user.userId));
    res.status(StatusCodes.OK).json({
      user,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
      provider: "google",
    });
  } catch (err: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: err.message || "User not found" });
  }
};
