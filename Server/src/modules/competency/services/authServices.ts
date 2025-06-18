import { PrismaClient, Prisma, Users, UserRoles, Roles, RolePermissions, Permissions } from "@prisma/client_competency";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "@Utils/tokenUtils";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const DEFAULT_USER_ROLE = process.env.DEFAULT_USER_ROLE || "User";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing environment variable: GOOGLE_CLIENT_ID");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

type UserWithRoles = Users & {
  userRoles: (UserRoles & {
    roles: Roles & {
      rolePermissions?: (RolePermissions & { permissions: Permissions })[];
    };
  })[];
};

class AuthService {
  /**
   * Login with Google OAuth2 ID token.
   */
  public async loginWithGoogle(googleToken: string) {
    if (!googleToken) throw new Error("Google token is required");

    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Invalid Google token payload");

    // Find or create user
    let userRecord: Users;
    try {
      userRecord = (await prisma.users.findUnique({ where: { email: payload.email } })) as Users;
      if (!userRecord) {
        userRecord = await prisma.users.create({
          data: {
            email: payload.email,
            firstNameEN: payload.given_name || undefined,
            lastNameEN: payload.family_name || undefined,
            profileImage: payload.picture || "noimage.jpg",
          },
        });
      } else {
        const shouldUpdateProfileImage = !userRecord.profileImage || userRecord.profileImage === "noimage.jpg";
        if (shouldUpdateProfileImage || !userRecord.firstNameEN || !userRecord.lastNameEN) {
          userRecord = await prisma.users.update({
            where: { email: payload.email },
            data: {
              profileImage: shouldUpdateProfileImage ? payload.picture || "noimage.jpg" : undefined,
              firstNameEN: userRecord.firstNameEN || payload.given_name || undefined,
              lastNameEN: userRecord.lastNameEN || payload.family_name || undefined,
            },
          });
        }
      }
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new Error("A user with this email already exists");
      }
      throw e;
    }

    // Load roles
    const userWithRoles = (await prisma.users.findUnique({
      where: { id: userRecord.id },
      include: {
        userRoles: { include: { Roles: true } },
      },
    })) as UserWithRoles | null;

    const primaryRole = userWithRoles?.userRoles[0]?.roles.name || DEFAULT_USER_ROLE;

    // Generate tokens
    const accessToken = generateToken({ userId: userRecord.id, email: userRecord.email, role: primaryRole });
    const refreshToken = generateRefreshToken({ userId: userRecord.id });

    // Store refresh token
    const now = new Date();
    const existing = await prisma.refreshTokens.findFirst({ where: { user_id: userRecord.id } });
    if (existing) {
      await prisma.refreshTokens.update({ where: { id: existing.id }, data: { token: refreshToken, updated_at: now } });
    } else {
      await prisma.refreshTokens.create({ data: { user_id: userRecord.id, token: refreshToken, created_at: now, updated_at: now } });
    }

    return {
      user: {
        userId: userRecord.id,
        email: userRecord.email,
        firstNameEN: userRecord.firstNameEN,
        lastNameEN: userRecord.lastNameEN,
        profileImage: userRecord.profileImage,
        role: primaryRole,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout by removing refresh token.
   */
  public async logout(refreshToken: string) {
    if (!refreshToken) throw new Error("Refresh token is required to logout");
    await prisma.refreshTokens.deleteMany({ where: { token: refreshToken } });
  }

  /**
   * Refresh JWT using valid refresh token.
   */
  public async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) throw new Error("Refresh token is required");
    const payload = verifyRefreshToken(oldRefreshToken);

    const existing = await prisma.refreshTokens.findFirst({ where: { user_id: payload.userId } });
    if (!existing || existing.token !== oldRefreshToken) throw new Error("Invalid refresh token");

    const newRefreshToken = generateRefreshToken({ userId: payload.userId });
    await prisma.refreshTokens.update({ where: { id: existing.id }, data: { token: newRefreshToken } });

    const userWithRoles = (await prisma.users.findUnique({
      where: { id: payload.userId },
      include: { userRoles: { include: { Roles: { include: { rolePermissions: { include: { Permissions: true } } } } } } },
    })) as UserWithRoles | null;
    if (!userWithRoles) throw new Error("User not found");

    const primaryRole = userWithRoles.userRoles[0]?.roles.name || DEFAULT_USER_ROLE;
    const accessToken = generateToken({ userId: userWithRoles.id, email: userWithRoles.email, role: primaryRole });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Get current user profile and permissions.
   */
  public async getCurrentUser(userId: string) {
    if (!userId) throw new Error("User ID is required");

    const userWithRoles = (await prisma.users.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { Roles: { include: { rolePermissions: { include: { Permissions: true } } } } } } },
    })) as UserWithRoles | null;
    if (!userWithRoles) throw new Error("User not found");

    const permissions = userWithRoles.userRoles.flatMap((ur) => ur.roles.rolePermissions?.map((rp) => rp.permissions.key) || []);
    const primaryRole = userWithRoles.userRoles[0]?.roles.name || DEFAULT_USER_ROLE;

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
