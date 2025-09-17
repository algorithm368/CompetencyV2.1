import type { Session } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";
import { SessionRepository } from "@/modules/admin/repositories/RoleRepository";
import { UserRepository } from "@/modules/admin/repositories/RoleRepository";
import { mapSessionView } from "@/utils/sessionStatus";

export class SessionService extends BaseService<Session, "id"> {
  private userRepo: UserRepository;
  constructor() {
    super(new SessionRepository(), ["userId"], "id");
    this.userRepo = new UserRepository();
  }

  async getAllWithEmail(search?: string, page?: number, perPage?: number) {
    const where: any = {};
    if (search?.trim()) {
      where.OR = [{ id: { contains: search.trim() } }, { email: { contains: search.trim() } }];
    }

    // ดึง users พร้อม sessions
    const users =
      page !== undefined && perPage !== undefined
        ? await this.userRepo.findMany({
            where,
            include: { sessions: true },
            skip: (page - 1) * perPage,
            take: perPage,
          })
        : await this.userRepo.findMany({ where, include: { sessions: true } });

    const total = page && perPage ? await this.userRepo.manager.count({ where }) : users.length;

    const data = users.map((u: any) => {
      const latestSession = u.sessions?.sort((a: any, b: any) => (b.lastActivityAt?.getTime() || 0) - (a.lastActivityAt?.getTime() || 0))[0];

      const sessionView = mapSessionView({
        id: latestSession?.id || null,
        userId: u.id,
        email: u.email || "",
        expiresAt: latestSession?.expiresAt || null,
        lastActivityAt: latestSession?.lastActivityAt || null,
      });

      return sessionView;
    });

    return { data, total };
  }

  async getByIdWithEmail(id: string) {
    const session = await this.repo.findFirst({
      where: { id },
      include: { user: { select: { email: true } } },
    });
    if (!session) return null;

    return mapSessionView({
      id: session.id,
      userId: session.userId,
      email: session.user?.email || "",
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
    });
  }
  async createSessionWithEmail(userId: string, accessToken: string, refreshToken: string, expiresAt?: Date, actor: string = "system") {
    const session = await this.repo.create({ userId, accessToken, refreshToken, expiresAt }, actor);
    return this.getByIdWithEmail(session.id);
  }

  async getSessionByAccessToken(accessToken: string) {
    const session = await this.repo.findFirst({
      where: { accessToken },
      include: { user: { select: { email: true } } },
    });
    if (!session) return null;

    return mapSessionView({
      id: session.id,
      userId: session.userId,
      email: session.user?.email || "",
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
    });
  }

  async getSessionByRefreshToken(refreshToken: string) {
    const session = await this.repo.findFirst({
      where: { refreshToken },
      include: { user: { select: { email: true } } },
    });
    if (!session) return null;

    return mapSessionView({
      id: session.id,
      userId: session.userId,
      email: session.user?.email || "",
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
    });
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
  async upsertSession(userId: string, accessToken: string, refreshToken: string, csrfToken: string, provider: string = "google", expiresAt?: Date, actor: string = "system") {
    const now = new Date();
    const existing = await this.repo.findFirst({ where: { userId } });

    if (existing) {
      const updated = await this.repo.update(
        existing.id,
        {
          accessToken,
          refreshToken,
          csrfToken,
          provider,
          updatedAt: now,
          lastActivityAt: now,
          expiresAt,
        },
        actor
      );
      return this.getByIdWithEmail(updated.id);
    } else {
      const created = await this.repo.create(
        {
          userId,
          accessToken,
          refreshToken,
          csrfToken,
          provider,
          createdAt: now,
          updatedAt: now,
          lastActivityAt: now,
          expiresAt,
        },
        actor
      );
      return this.getByIdWithEmail(created.id);
    }
  }
}
