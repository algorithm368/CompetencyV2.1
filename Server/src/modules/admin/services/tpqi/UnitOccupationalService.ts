import type { UnitOccupational } from "@prisma/client_tpqi";
import { UnitOccupationalRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitOccupationalService extends BaseService<UnitOccupational, keyof UnitOccupational> {
  constructor() {
    super(
      new UnitOccupationalRepo(),
      ["occupational.name", "unitcode.name"], // Added .name to unitcode for consistency
      "id",
      {
        occupational: true,
        unitcode: true
      }
    );
  }

  async getAll(
    search?: string,
    page?: number,
    perPage?: number
  ): Promise<{ data: UnitOccupational[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          occupational: {
            name: { 
              contains: search.trim(),
            }
          }
        },
        {
          unitcode: {
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
        occupational: {
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