export class BaseService<T extends Record<string, any>, K extends keyof T> {
  constructor(
    protected readonly repo: any, 
    protected readonly searchFields: string[], 
    private readonly pkField: keyof T, 
    protected readonly includes?: Record<string, boolean>
  ) {}

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: T[]; total: number }> {
    const where: any = {};

    if (search && search.trim()) {
      where.OR = this.searchFields.map((fieldPath) => {
        const parts = fieldPath.split(".");
        let nested: any = { contains: search.trim() };
        for (let i = parts.length - 1; i >= 1; i--) {
          nested = { [parts[i]]: nested };
        }
        return { [parts[0]]: nested };
      });
    }

    const commonQuery: any = {
      where,
      ...(this.includes ? { include: this.includes } : {}),
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

  getById(id: T[typeof this.pkField], options?: { include?: any }): Promise<T | null> {
    const queryOptions = options || (this.includes ? { include: this.includes } : {});
    return this.repo.findById(id, queryOptions);
  }

  create(data: Omit<T, typeof this.pkField>, actor: string): Promise<T> {
    return this.repo.create(data, actor);
  }

  update(id: T[typeof this.pkField], updates: Partial<Omit<T, typeof this.pkField>>, actor: string): Promise<T> {
    return this.repo.update(id, updates, actor);
  }

  delete(id: T[typeof this.pkField], actor: string): Promise<T> {
    return this.repo.delete(id, actor);
  }
}