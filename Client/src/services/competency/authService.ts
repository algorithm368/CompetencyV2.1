import api from "@Services/api";

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

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface CurrentUserResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export async function loginWithGoogle(idToken: string): Promise<GoogleLoginResponse> {
  if (!idToken || !/^ey/.test(idToken)) {
    throw new Error("Invalid or missing Google ID token");
  }

  const response = await api.post<GoogleLoginResponse>(
    "/competency/auth/google",
    { idToken },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/competency/auth/logout", {}, { withCredentials: true });
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const response = await api.post<RefreshTokenResponse>("/competency/auth/refresh-token", {}, { withCredentials: true });
  return response.data;
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  const response = await api.get<CurrentUserResponse>("/competency/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
