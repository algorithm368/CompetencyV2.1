import type { UnitSkill } from "@prisma/client_tpqi";
import { UnitSkillRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class USkillService extends BaseService<UnitSkill, keyof UnitSkill> {
  constructor() {
    super(new UnitSkillRepo(), ["unitcode.name", "skill.name"], "id",
      {
        skill: true,
        unitcode: true
      }
    );
  }

  async getAll(
    search?: string,
    page?: number,
    perPage?: number
  ): Promise<{ data: UnitSkill[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          skill: {
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
        Skill: {
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
