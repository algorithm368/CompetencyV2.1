const ONLINE_THRESHOLD = Number(process.env.ONLINE_THRESHOLD_SEC || 900) * 1000;

/**
 * Check session online or offline
 * @param session Session object ที่มี expiresAt และ lastActivityAt
 * @returns "online" | "offline"
 */
export function getSessionStatus(session: { expiresAt?: Date | null; lastActivityAt?: Date | null }): "online" | "offline" {
  const now = Date.now();
  if (session.expiresAt && session.expiresAt.getTime() <= now) return "offline";
  if (!session.lastActivityAt || now - session.lastActivityAt.getTime() > ONLINE_THRESHOLD) return "offline";

  return "online";
}

export function mapSessionView(session: { id: string; userId: string; email: string; expiresAt?: Date | null; lastActivityAt?: Date | null }) {
  return {
    ...session,
    status: getSessionStatus(session),
  };
}
