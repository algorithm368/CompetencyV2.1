import type { CareerLevel } from "@prisma/client_tpqi";
import { CareerLevelRepo } from "@Admin/repositories/tpqi/TPQIRepositories";
import { BaseService } from "@Utils/BaseService";

export class CareerService extends BaseService<CareerLevel, keyof CareerLevel> {
  constructor() {
    // กำหนด includes สำหรับ join ตาราง Career และ Level
    super(
      new CareerLevelRepo(), 
      ["career.name", "level.name"], // เปลี่ยน searchFields ให้สามารถค้นหาใน related tables ได้
      "id",
      {
        career: true,  // join กับตาราง Career
        level: true    // join กับตาราง Level
      }
    );
  }

  // Override getAll method เพื่อปรับแต่ง search และ includes
  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: CareerLevel[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        // ค้นหาใน Career name
        {
          career: {
            name: {
              contains: search.trim()
            }
          }
        },
        // ค้นหาใน Level name
        {
          level: {
            name: {
              contains: search.trim()
            }
          }
        }
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

  // Override getById method เพื่อ include related data
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
        }
      }
    });
  }
}