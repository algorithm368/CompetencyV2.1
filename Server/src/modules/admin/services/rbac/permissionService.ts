import { PermissionRepository } from "@Competency/repositories/RoleRepository";
import type { Permission } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class PermissionService extends BaseService<Permission, keyof Permission> {
  constructor() {
    super(new PermissionRepository(), ["operation.name", "asset.tableName"], "id");
  }

  async getAll(search?: string, page: number = 1, perPage: number = 10): Promise<{ data: Permission[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = this.searchFields.map((fieldPath) => {
        const parts = fieldPath.split(".");
        let nested: any = { contains: search.trim(), mode: "insensitive" };
        for (let i = parts.length - 1; i >= 1; i--) {
          nested = { [parts[i]]: nested };
        }
        return { [parts[0]]: nested };
      });
    }
    const include = { operation: true, asset: true };
    const commonQuery: any = {
      where,
      include,
    };

    let data: Permission[];
    let total: number;

    if (!isNaN(page) && !isNaN(perPage)) {
      data = await this.repo.findMany({
        ...commonQuery,
        skip: (page - 1) * perPage,
        take: perPage,
      });
      total = await this.repo.manager.count({ where });
    } else {
      data = await this.repo.findMany(commonQuery);
      total = data.length;
    }
    return { data, total };
  }

  async createPermission(operationId: number, assetId: number, actor: string = "system") {
    const existing = await this.repo.findFirst({ where: { operationId, assetId } });
    if (existing) {
      console.error(`[PermissionService] Error: Permission for operationId=${operationId} and assetId=${assetId} already exists.`);
      throw new Error("Permission already exists for this operation and asset");
    }

    const newPermission = await this.repo.create({ operationId, assetId, createdAt: new Date() }, actor);
    return newPermission;
  }

  async getPermission(operationId: number, assetId: number) {
    return this.repo.findFirst({ where: { operationId, assetId }, include: this.includes });
  }
}
