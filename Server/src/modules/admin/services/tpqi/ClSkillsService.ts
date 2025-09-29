import type { CareerLevelSkill } from "@prisma/client_tpqi";
import { CareerLevelSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class ClSkillsService extends BaseService<CareerLevelSkill, keyof CareerLevelSkill> {
  constructor() {
    super(new CareerLevelSkillRepo(), ["skill.name", "careerLevel.career.name", "careerLevel.level.name"], "id");
  }

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: CareerLevelSkill[]; total: number }> {
    const where: any = {};
    if (search && search.trim()) {
      where.OR = [
        {
          skill: {
            name: {
              contains: search.trim(),
            },
          },
        },
        {
          careerLevel: {
            career: {
              name: {
                contains: search.trim(),
              },
            },
          },
        },
      ];
    }
    const commonQuery: any = {
      where,
      include: {
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
        careerLevel: {
          include: {
            career: {
              select: {
                id: true,
                name: true,
              },
            },
            level: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
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
