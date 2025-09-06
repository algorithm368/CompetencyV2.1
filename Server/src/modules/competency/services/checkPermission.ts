import { PrismaClient } from "@prisma/client_competency";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";

const prisma = new PrismaClient();

export class PermissionService {
  /**
   * เช็คว่าผู้ใช้มีสิทธิ์ resource + action หรือไม่
   */
  static async hasPermission(user: AuthenticatedRequest["user"], resource: string, action: string): Promise<boolean> {
    if (!user) return false;

    // Admin ผ่านทุกอย่าง
    if (user.roles.includes("Admin")) return true;

    const permissionKey = `${resource}:${action}`;

    // ตรวจสอบ permission จาก role หรือ instance
    return user.permissions.includes(permissionKey);
  }

  /**
   * ตรวจสอบ object-level permission (instance)
   */
  static async hasInstancePermission(user: AuthenticatedRequest["user"], resource: string, action: string): Promise<boolean> {
    if (!user) return false;
    if (user.roles.includes("Admin")) return true;

    const userAssetInstance = await prisma.userAssetInstance.findFirst({
      where: {
        userId: user.userId,
        assetInstance: { asset: { tableName: resource } },
      },
      include: { assetInstance: { include: { asset: true } } },
    });

    if (userAssetInstance) {
      const permissionKey = `${userAssetInstance.assetInstance.asset.tableName}:${action}`;
      return user.permissions.includes(permissionKey);
    }

    // fallback → ตรวจสอบ role-level permission
    return user.permissions.includes(`${resource}:${action}`);
  }
}
