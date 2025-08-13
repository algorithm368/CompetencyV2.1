import { PrismaClient, User, UserRole, Role, RolePermission, Permission, Session } from "@prisma/client_competency";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "@Utils/tokenUtils";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
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
  async loginWithGoogle(googleToken: string) {
    if (!googleToken) throw new Error("Google token is required");

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("Invalid Google token");

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstNameEN: payload.given_name ?? undefined,
          lastNameEN: payload.family_name ?? undefined,
          profileImage: payload.picture ?? "noimage.jpg",
        },
      });
    } else {
      // Update profile image or names if missing
      const needsUpdate = !user.profileImage || user.profileImage === "noimage.jpg" || !user.firstNameEN || !user.lastNameEN;
      if (needsUpdate) {
        user = await prisma.user.update({
          where: { email: payload.email },
          data: {
            profileImage: user.profileImage === "noimage.jpg" ? payload.picture ?? "noimage.jpg" : undefined,
            firstNameEN: user.firstNameEN ?? payload.given_name,
            lastNameEN: user.lastNameEN ?? payload.family_name,
          },
        });
      }
    }

    // Load roles with permissions
    const userWithRoles = (await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    })) as UserWithRoles | null;

    const primaryRole = userWithRoles?.userRoles[0]?.role.name ?? DEFAULT_USER_ROLE;

    // Generate JWT tokens
    const accessToken = generateToken({ userId: user.id, email: user.email, role: primaryRole });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry example

    // Store session with accessToken and refreshToken
    const existingSession = await prisma.session.findFirst({ where: { userId: user.id } });
    if (existingSession) {
      await prisma.session.update({
        where: { id: existingSession.id },
        data: { accessToken, refreshToken, updatedAt: now, expiresAt },
      });
    } else {
      await prisma.session.create({
        data: { userId: user.id, accessToken, refreshToken, createdAt: now, updatedAt: now, expiresAt },
      });
    }

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
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new Error("Refresh token required");
    await prisma.session.deleteMany({ where: { refreshToken } });
  }

  async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) throw new Error("Refresh token required");

    const payload = verifyRefreshToken(oldRefreshToken);

    const storedSession = await prisma.session.findFirst({ where: { userId: payload.userId } });
    if (!storedSession || storedSession.refreshToken !== oldRefreshToken) throw new Error("Invalid refresh token");

    const userWithRoles = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: { rolePermissions: { include: { permission: true } } },
            },
          },
        },
      },
    });
    if (!userWithRoles) throw new Error("User not found");

    const primaryRole = userWithRoles.userRoles[0]?.role.name ?? DEFAULT_USER_ROLE;

    const newRefreshToken = generateRefreshToken({ userId: payload.userId });

    const accessToken = generateToken({
      userId: userWithRoles.id,
      email: userWithRoles.email,
      role: primaryRole,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

    await prisma.session.update({
      where: { id: storedSession.id },
      data: { refreshToken: newRefreshToken, accessToken, updatedAt: now, expiresAt },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getCurrentUser(userId: string) {
    if (!userId) throw new Error("User ID required");

    const userWithRoles = (await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: { rolePermissions: { include: { permission: true } } },
            },
          },
        },
      },
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
