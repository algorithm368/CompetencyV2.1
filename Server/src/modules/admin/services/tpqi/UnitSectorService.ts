import type { UnitSector } from "@prisma/client_tpqi";
import { UnitSectorRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitSectorService extends BaseService<UnitSector, keyof UnitSector> {
  constructor() {
    super(new UnitSectorRepo(), ["unitcode.name", "sector.name"], "id",
      { sector: true, unitCode: true });
  }

  async getAll(
    search?: string,
    page?: number,
    perPage?: number
  ): Promise<{ data: UnitSector[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          sector: {
            name: {
              contains: search.trim(),
            }
          }
        },
        {
          unitCode: {
            name: {
              contains: search.trim(),
            }
          }
        }
      ];
    }

    const commonQuery: any = {
      where,
      include: {
        sector: {
          select: {
            id: true,
            name: true
          }
        },
        unitCode: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        }
      }
    };
    // Handle pagination
    if (page !== undefined && perPage !== undefined && !isNaN(page) && !isNaN(perPage)) {
      const data = await this.repo.findMany({
        ...commonQuery,
        skip: (page - 1) * perPage,
        take: perPage,
      });

      const total = await this.repo.manager.count({ where });

      return { data, total };
    }

    const data = await this.repo.findMany(commonQuery);
    const total = data.length;

    return { data, total };
  }
}
