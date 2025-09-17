import { PrismaClient, User, UserRole, Role, RolePermission, Permission, Session } from "@prisma/client_competency";
import { generateToken, generateRefreshToken, generateCsrfToken, verifyRefreshToken } from "@Utils/tokenUtils";
import { OAuth2Client } from "google-auth-library";
import { SessionService } from "@/modules/admin/services/rbac/sessionService";

const prisma = new PrismaClient();
const sessionService = new SessionService();
const DEFAULT_USER_ROLE = process.env.DEFAULT_USER_ROLE || "User";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID env variable");

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

type UserWithRoles = User & {
  userRoles: (UserRole & {
    role: Role & {
      rolePermissions?: (RolePermission & { permission: Permission })[];
    };
  })[];
};

class AuthService {
  /**
   * Login with Google token using transaction
   * @param googleToken Google ID token
   * @param txClient    Optional transactional Prisma client
   * @returns           User info + tokens
   */
  async loginWithGoogle(googleToken: string) {
    if (!googleToken) throw new Error("Google token is required");

    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Invalid Google token");

    const email = payload.email!;
    const firstNameEN = payload.given_name ?? "";
    const lastNameEN = payload.family_name ?? "";
    const profileImage = payload.picture ?? "noimage.jpg";

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Find default role
      const defaultRole = await prisma.role.findUnique({
        where: { name: DEFAULT_USER_ROLE },
      });
      if (!defaultRole) throw new Error(`Default role "${DEFAULT_USER_ROLE}" not found`);

      // Create user + assign default role
      user = await prisma.user.create({
        data: {
          email,
          firstNameEN,
          lastNameEN,
          profileImage,
          userRoles: {
            create: [
              {
                roleId: defaultRole.id,
              },
            ],
          },
        },
        include: {
          userRoles: true,
        },
      });
    }

    // Load roles
    const userWithRoles = (await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        },
      },
    })) as UserWithRoles | null;

    const primaryRole = userWithRoles?.userRoles[0]?.role?.name ?? DEFAULT_USER_ROLE;

    // Generate tokens
    const accessToken = generateToken({ userId: user.id, email: user.email, role: primaryRole });
    const refreshToken = generateRefreshToken({ userId: user.id });
    const csrfToken = generateCsrfToken();

    // Upsert session
    await sessionService.upsertSession(user.id, accessToken, refreshToken, csrfToken, "google", expiresAt);

    return {
      user: {
        userId: user.id,
        email: user.email,
        firstNameEN: user.firstNameEN,
        lastNameEN: user.lastNameEN,
        profileImage: user.profileImage,
        role: primaryRole,
      },
      accessToken,
      refreshToken,
      csrfToken,
    };
  }

  /**
   * Logout by refreshToken
   * @param refreshToken Refresh token
   * @param txClient     Optional transactional Prisma client
   */
  async logout(refreshToken: string, txClient?: PrismaClient) {
    if (!refreshToken) throw new Error("Refresh token required");
    const client = txClient ?? prisma;
    await client.session.deleteMany({ where: { refreshToken } });
  }

  /**
   * Refresh token
   * @param oldRefreshToken Existing refresh token
   * @param txClient        Optional transactional Prisma client
   */
  async refreshToken(oldRefreshToken: string, txClient?: PrismaClient) {
    if (!oldRefreshToken) throw new Error("Refresh token required");

    const client = txClient ?? prisma;
    const payload = verifyRefreshToken(oldRefreshToken);

    const storedSession = await client.session.findFirst({ where: { userId: payload.userId } });
    if (!storedSession || storedSession.refreshToken !== oldRefreshToken) throw new Error("Invalid refresh token");

    const userWithRoles = await client.user.findUnique({
      where: { id: payload.userId },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
    });
    if (!userWithRoles) throw new Error("User not found");

    const primaryRole = userWithRoles.userRoles[0]?.role.name ?? DEFAULT_USER_ROLE;
    const newRefreshToken = generateRefreshToken({ userId: payload.userId });
    const accessToken = generateToken({ userId: userWithRoles.id, email: userWithRoles.email, role: primaryRole });
    const csrfToken = generateCsrfToken();

    return { accessToken, refreshToken: newRefreshToken, csrfToken };
  }

  /**
   * Get current user with roles & permissions
   * @param userId User ID
   * @param txClient Optional transactional Prisma client
   */
  async getCurrentUser(userId: string, txClient?: PrismaClient) {
    if (!userId) throw new Error("User ID required");

    const client = txClient ?? prisma;

    const userWithRoles = (await client.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
    })) as UserWithRoles | null;

    if (!userWithRoles) throw new Error("User not found");

    const permissions = userWithRoles.userRoles.flatMap((ur) => ur.role.rolePermissions?.map((rp) => rp.permission.id.toString()) ?? []);
    const primaryRole = userWithRoles.userRoles[0]?.role.name ?? DEFAULT_USER_ROLE;

    return {
      userId: userWithRoles.id,
      email: userWithRoles.email,
      firstNameEN: userWithRoles.firstNameEN,
      lastNameEN: userWithRoles.lastNameEN,
      profileImage: userWithRoles.profileImage,
      role: primaryRole,
      permissions,
    };
  }
}

export default new AuthService();
