import type { CareerLevelKnowledge } from "@prisma/client_tpqi";
import { CareerLevelKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClKnowledgeService extends BaseService<CareerLevelKnowledge, keyof CareerLevelKnowledge> {
  constructor() {
    super(
      new CareerLevelKnowledgeRepo(),
      ["knowledge.name", "careerLevel.career.name", "careerLevel.level.name"],
      "id",
      {
        knowledge: true,
        careerLevel: true
      }
    );
  }

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: CareerLevelKnowledge[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          knowledge: {
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
        },
      ];
    }

    const commonQuery: any = {
      where,
      include: {
        knowledge: {
          select: {
            id: true,
            name: true
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