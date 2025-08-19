import type { Session } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";
import { SessionRepository } from "@Competency/repositories/RoleRepository";

export class SessionService extends BaseService<Session, "id"> {
  constructor() {
    super(new SessionRepository(), ["userId"], "id");
  }

  async createSession(userId: string, accessToken: string, refreshToken: string, expiresAt?: Date, actor: string = "system"): Promise<Session> {
    return this.repo.create({ userId, accessToken, refreshToken, expiresAt }, actor);
  }

  async getSessionByAccessToken(accessToken: string): Promise<Session | null> {
    return this.repo.findFirst({ where: { accessToken } });
  }

  async getSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
    return this.repo.findFirst({ where: { refreshToken } });
  }

  async deleteSessionById(id: string, actor: string = "system"): Promise<Session> {
    return this.repo.delete(id, actor);
  }

  async deleteSessionsByUserId(userId: string, actor: string = "system"): Promise<void> {
    await this.repo.manager.deleteMany({ where: { userId } });
  }

  async isSessionExpired(session: Session): Promise<boolean> {
    if (!session.expiresAt) return false;
    return session.expiresAt.getTime() <= Date.now();
  }
}
