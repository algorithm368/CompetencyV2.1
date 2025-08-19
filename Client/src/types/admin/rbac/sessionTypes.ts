// --- Session ---
export interface Session {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
