export interface SessionView {
  id: string;
  userId: string;
  email: string;
  expiresAt?: string | null;
  status: "online" | "offline";
}

export interface SessionPageResult {
  data: SessionView[];
  total: number;
}
