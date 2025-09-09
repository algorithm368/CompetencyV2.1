import type { CareerLevelUnitCode } from "@prisma/client_tpqi";
import { CareerLevelUnitCodeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClUcService extends BaseService<CareerLevelUnitCode, keyof CareerLevelUnitCode> {
  constructor() {
    super(new CareerLevelUnitCodeRepo(), ["unitcode.name", "careerLevel.career.name", "careerLevel.level.name"], "id",
      { unitcode: true, careerLevel: true });
  }

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: CareerLevelUnitCode[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          unitcode: {
            name: {
              contains: search.trim()
            }
          }
        },
        {
          careerLevel: {
            career: {
              name: {
                contains: search.trim()
              }
            }
          }
        }
      ];
    }

    const commonQuery: any = {
      where,
      include: {
        unitCode: {  // Changed from 'Unitcode' to 'unitCode'
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        },
        careerLevel: {
          include: {
            career: {
              select: {
                id: true,
                name: true
              }
            },
            level: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    };

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