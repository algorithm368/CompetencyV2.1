import api from "@Services/api";

// Interfaces adjusted to match backend responses
export interface GoogleLoginResponse {
  accessToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

/**
 * Log in via Google OAuth ID token.
 * Backend now sets refreshToken in HTTP-only cookie,
 * so we only get accessToken and expiresIn in response body.
 */
export async function loginWithGoogle(idToken: string): Promise<GoogleLoginResponse> {
  if (!idToken) {
    throw new Error("ID token is required for Google login");
  }

  const response = await api.post<GoogleLoginResponse>(
    "/competency/auth/google",
    { idToken },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // send/receive cookies
    }
  );

  return response.data;
}

/**
 * Logout: backend reads refreshToken from cookie, so no body needed.
 */
export async function logout(): Promise<void> {
  await api.post("/competency/auth/logout", {}, { withCredentials: true });
}

/**
 * Refresh access token: backend reads old refreshToken from cookie,
 * returns new accessToken and expiresIn.
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: string;
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>("/competency/auth/refresh-token", {}, { withCredentials: true });
  return response.data;
}

/**
 * Fetch current user profile. Include accessToken in Authorization header.
 */
export interface CurrentUserResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  const response = await api.get<CurrentUserResponse>("/competency/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
