import type { CareerLevel } from "@prisma/client_tpqi";
import { CareerLevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class CareerLevelService extends BaseService<CareerLevel, keyof CareerLevel> {
  constructor() {
    super(
      new CareerLevelRepo(),
      ["career.name", "level.name", "careerLevelDetails.description"],
      "id",
      { 
        career: true, 
        level: true,
        careerLevelDetails: true
      }
    );
  }

  async getAll(search?: string, page?: number, perPage?: number): Promise<{
    data: CareerLevel[];
    total: number;
  }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        { career: { name: { contains: search.trim() } } },
        { level: { name: { contains: search.trim() } } },
        { careerLevelDetails: { some: { description: { contains: search.trim() } } } }
      ];
    }

    const commonQuery: any = {
      where,
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
        },
        careerLevelDetails: {
          select: {
            id: true,
            description: true,
            careerLevelId: true
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

  async getById(id: number): Promise<CareerLevel | null> {
    return this.repo.findById(id, {
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
        },
        careerLevelDetails: {
          select: {
            id: true,
            description: true,
            careerLevelId: true
          }
        }
      }
    });
  }
}