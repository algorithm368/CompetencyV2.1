import { Request, Response, NextFunction } from "express";
import { SessionService } from "@Competency/services/rbac/sessionService";
import type { Session } from "@prisma/client_competency";

const service = new SessionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function SessionView(session: Session) {
  return {
    id: session.id,
    userId: session.userId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export class SessionController {
  // สร้าง session ใหม่
  static async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, accessToken, refreshToken, expiresAt } = req.body;
      const actor = req.user?.userId || "system";

      if (!userId || !accessToken || !refreshToken) {
        res.status(400).json({ error: "userId, accessToken and refreshToken are required" });
        return;
      }

      const expires = expiresAt ? new Date(expiresAt) : undefined;

      const session = await service.createSession(userId, accessToken, refreshToken, expires, actor);
      res.status(201).json(SessionView(session));
    } catch (error) {
      next(error);
    }
  }

  // ดึง session ตาม id
  static async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const session = await service.getById(id);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(SessionView(session));
    } catch (error) {
      next(error);
    }
  }

  // ดึง session ตาม accessToken
  static async getSessionByAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.query.accessToken;
      if (typeof accessToken !== "string") {
        res.status(400).json({ error: "accessToken query param is required" });
        return;
      }
      const session = await service.getSessionByAccessToken(accessToken);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(SessionView(session));
    } catch (error) {
      next(error);
    }
  }

  // ดึง session ตาม refreshToken
  static async getSessionByRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.query.refreshToken;
      if (typeof refreshToken !== "string") {
        res.status(400).json({ error: "refreshToken query param is required" });
        return;
      }
      const session = await service.getSessionByRefreshToken(refreshToken);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(SessionView(session));
    } catch (error) {
      next(error);
    }
  }

  // ลบ session ตาม id
  static async deleteSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const actor = req.user?.userId || "system";

      const session = await service.getById(id);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      await service.deleteSessionById(id, actor);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // ลบ session ทั้งหมดของ userId
  static async deleteSessionsByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const actor = req.user?.userId || "system";

      await service.deleteSessionsByUserId(userId, actor);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // ตรวจสอบว่า session หมดอายุหรือไม่ (รับ id ผ่าน param)
  static async isSessionExpired(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const session = await service.getById(id);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      const expired = await service.isSessionExpired(session);
      res.json({ expired });
    } catch (error) {
      next(error);
    }
  }
}
