import type { UnitKnowledge } from "@prisma/client_tpqi";
import { UnitKnowledgeRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class UnitKnowledgeService extends BaseService<UnitKnowledge, keyof UnitKnowledge> {
  constructor() {
    super(
      new UnitKnowledgeRepo(),
      ["unitcode.name", "knowledge.name"],
      "id",
      {
        unitcode: true,
        knowledge: true
      }
    );
  }

  async getAll(
    search?: string,
    page?: number,
    perPage?: number
  ): Promise<{ data: UnitKnowledge[]; total: number }> {
    const where: any = {};

    if (search && search?.trim()) {
      where.OR = [
        {
          unitcode: {
            name: {
              contains: search.trim()
            }
          }
        },
        {
          knowledge: {
            name: {
              contains: search.trim(),
            }
          }
        }
      ]
    }

    const commonQuery: any = {
      where,
      include: {
        UnitCode: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        },
        Knowledge: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }
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