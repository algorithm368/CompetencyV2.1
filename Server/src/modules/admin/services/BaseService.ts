export class BaseService<T extends Record<string, any>, K extends keyof T> {
  constructor(protected readonly repo: any, private readonly searchFields: string[], private readonly pkField: keyof T, protected readonly includes?: Record<string, boolean>) {}

  async getAll(search?: string, page?: number, perPage?: number): Promise<{ data: T[]; total?: number; nextCursor?: number | null } | { error: string }> {
    if (!search || !search.trim()) {
      return { error: "Please enter a search term." };
    }

    let where: any = {};

    where.OR = this.searchFields.map((fieldPath) => {
      const parts = fieldPath.split(".");
      let nested: any = { contains: search };
      for (let i = parts.length - 1; i >= 1; i--) {
        nested = { [parts[i]]: nested };
      }
      return { [parts[0]]: nested };
    });

    const commonQuery: any = {
      where,
      ...(this.includes ? { include: this.includes } : {}),
    };

    if (page !== undefined && perPage !== undefined) {
      const { data, total } = await this.repo.paginateOffset(page, perPage, commonQuery);
      return { data, total };
    }

    const cursor = page;
    const { data, nextCursor } = await this.repo.paginateCursor(perPage ?? 20, cursor, commonQuery);
    return { data, nextCursor };
  }

  getById(id: T[typeof this.pkField]): Promise<T | null> {
    return this.repo.findById(id);
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
