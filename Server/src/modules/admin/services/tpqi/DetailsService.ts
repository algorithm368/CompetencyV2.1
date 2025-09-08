import type { CareerLevelDetail } from "@prisma/client_tpqi";
import { CareerLevelDetailRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class DetailsService extends BaseService<CareerLevelDetail, keyof CareerLevelDetail> {
  constructor() {
    super(new CareerLevelDetailRepo(), ["description", "careerLevel.level.name"], "id",
      {
        careerLevel: true
      });
  }

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: CareerLevelDetail[]; total: number }> {
    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        { description: { contains: search.trim() } },
        {
          careerLevel: {
            level: {
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
        careerLevel: {
          select: {
            id: true,
            career: {
              select: { id: true, name: true }
            },
            level: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { id: "asc" as const }
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
