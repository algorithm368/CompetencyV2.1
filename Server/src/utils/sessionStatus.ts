const ONLINE_THRESHOLD = 15 * 60 * 1000;

/**
 * ตรวจสอบสถานะ session ว่า online หรือ offline
 * @param session Session object ที่มี expiresAt และ lastActivityAt
 * @returns "online" | "offline"
 */
export function getSessionStatus(session: { id?: string | null; expiresAt?: Date | null; lastActivityAt?: Date | null }) {
  const now = Date.now();

  if (!session.id) return "offline";
  if (session.expiresAt && session.expiresAt.getTime() <= now) return "offline";
  if (!session.lastActivityAt || now - session.lastActivityAt.getTime() > ONLINE_THRESHOLD) return "offline";

  return "online";
}

export function mapSessionView(session: { id?: string | null; userId: string; email: string; expiresAt?: Date | null; lastActivityAt?: Date | null }) {
  return {
    ...session,
    status: getSessionStatus(session),
  };
}
