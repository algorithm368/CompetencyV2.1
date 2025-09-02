import { Request, Response, NextFunction } from "express";
import { SessionService } from "@/modules/admin/services/rbac/sessionService";

const service = new SessionService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function SessionView(session: { id: string; userId: string; email: string; expiresAt?: Date | null }) {
  const status = session.expiresAt && session.expiresAt.getTime() <= Date.now() ? "offline" : "online";
  return {
    id: session.id,
    userId: session.userId,
    email: session.email,
    expiresAt: session.expiresAt,
    status,
  };
}

export class SessionController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const page = Number(req.query.page);
      const perPage = Number(req.query.perPage);

      const items = await service.getAllWithEmail(search, Number.isNaN(page) ? undefined : page, Number.isNaN(perPage) ? undefined : perPage);

      // ระบุ type ให้ map
      res.json({
        data: items.data.map((s: any) =>
          SessionView({
            id: s.id,
            userId: s.userId,
            email: s.email,
            expiresAt: s.expiresAt ? new Date(s.expiresAt) : undefined,
          })
        ),
        total: items.total,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId, accessToken, refreshToken, expiresAt } = req.body;
      const actor = req.user?.userId || "system";

      if (!userId || !accessToken || !refreshToken) {
        res.status(400).json({ error: "userId, accessToken and refreshToken are required" });
        return;
      }

      const expires = expiresAt ? new Date(expiresAt) : undefined;

      const session = await service.createSessionWithEmail(userId, accessToken, refreshToken, expires, actor);

      if (!session) {
        res.status(500).json({ error: "Failed to create session" });
        return;
      }

      res.status(201).json(
        SessionView({
          id: session.id,
          userId: session.userId,
          email: session.email,
          expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await service.getByIdWithEmail(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });

      res.json(
        SessionView({
          id: session.id,
          userId: session.userId,
          email: session.email,
          expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getSessionByAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.query.accessToken;
      if (typeof accessToken !== "string") return res.status(400).json({ error: "accessToken query param is required" });

      const session = await service.getSessionByAccessToken(accessToken);
      if (!session) return res.status(404).json({ error: "Session not found" });

      res.json(
        SessionView({
          id: session.id,
          userId: session.userId,
          email: session.email,
          expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getSessionByRefreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.query.refreshToken;
      if (typeof refreshToken !== "string") return res.status(400).json({ error: "refreshToken query param is required" });

      const session = await service.getSessionByRefreshToken(refreshToken);
      if (!session) return res.status(404).json({ error: "Session not found" });

      res.json(
        SessionView({
          id: session.id,
          userId: session.userId,
          email: session.email,
          expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const session = await service.getById(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });

      await service.deleteSessionById(req.params.id, req.user?.userId || "system");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async deleteSessionsByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await service.deleteSessionsByUserId(req.params.userId, req.user?.userId || "system");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async isSessionExpired(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await service.getById(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });

      const expired = await service.isSessionExpired(session);
      res.json({ expired });
    } catch (error) {
      next(error);
    }
  }
}
