import { SkillRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Skill } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

export class SkillService extends BaseService<Skill, keyof Skill> {
  constructor() {
    super(
      new SkillRepo(), 
      ["subskill.text", "level.name"], 
      "code",
      {
        subskill: true,
        level: true
      }
    );
  }

  async getAll(
    search?: string, 
    page?: number, 
    perPage?: number
  ): Promise<{ data: Skill[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        {
          code: {
            contains: search.trim(),
          }
        },
        {
          subSkill: {
            text: {
              contains: search.trim(),
            }
          }
        },
        {
          level: {
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
        subSkills: {
          select: {
            id: true,
            text: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
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