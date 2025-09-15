import { InformationRepo } from "@Admin/repositories/sfia/SFIARepositories";
import type { Information } from "@prisma/client_sfia";
import { BaseService } from "@Utils/BaseService";

type GetAllOptions = {
  userId?: number | string;
};

export class InformationService extends BaseService<Information, keyof Information> {
  constructor() {
    super(new InformationRepo(), ["text", "approval_status"], "id");
  }

  async getAll(
    search?: string,
    page?: number,
    perPage?: number,
    options?: GetAllOptions
  ): Promise<{ data: (Information & { dataCollection: { id: number; userId: number | string } | null })[]; total: number }> {
    const where: any = {};

    // Search on Information fields
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { text: { contains: q, mode: "insensitive" } },
        { approval_status: { contains: q, mode: "insensitive" } },
      ];
    }

    if (options?.userId != null) {
      where.dataCollection = {
        userId: options.userId,
      };
    }

    const commonQuery: any = {
      where,
      include: {
        dataCollection: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: { id: "desc" },
    };

    // Paginated path
    if (
      page !== undefined &&
      perPage !== undefined &&
      !isNaN(page as any) &&
      !isNaN(perPage as any)
    ) {
      const data = await this.repo.findMany({
        ...commonQuery,
        skip: (page - 1) * perPage,
        take: perPage,
      });

      const total = await this.repo.manager.count({ where });
      return { data, total };
    }

    // Non-paginated path
    const data = await this.repo.findMany(commonQuery);
    const total = await this.repo.manager.count({ where });
    return { data, total };
  }
}
