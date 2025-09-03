import { DatabaseManagement } from "@Utils/databaseUtils";

export class BaseRepository<T extends Record<string, any>, K extends keyof T> {
  constructor(protected readonly manager: DatabaseManagement<any>, private readonly pkField: K) {}

  /** Create a new record. */
  create(data: Omit<T, K>, actor?: string, requestId?: string, txClient?: any): Promise<T> {
    return this.manager.create<T>({ data }, actor, requestId, undefined, txClient);
  }

  /** Retrieve multiple records. */
  findMany(args?: any, txClient?: any): Promise<T[]> {
    return this.manager.findMany<T>(args, undefined, undefined, undefined, txClient);
  }

  /** Find a record by its primary key. */
  findById(id: T[K], txClient?: any): Promise<T | null> {
    return this.manager.findUnique<T>({ where: { [this.pkField]: id } as Record<K, T[K]> }, undefined, undefined, undefined, txClient);
  }

  /** Update a record by primary key. */
  update(id: T[K], data: Partial<Omit<T, K>>, actor?: string, requestId?: string, txClient?: any): Promise<T> {
    return this.manager.update<T>({ where: { [this.pkField]: id } as Record<K, T[K]>, data }, actor, requestId, undefined, txClient);
  }

  /** Delete a record by primary key. */
  delete(id: T[K], actor?: string, requestId?: string, txClient?: any): Promise<T> {
    return this.manager.delete<T>({ where: { [this.pkField]: id } as Record<K, T[K]> }, actor, requestId, undefined, txClient);
  }

  async count(where?: any, txClient?: any) {
    return this.manager.count({ where }, txClient);
  }

  /** Paginate with offset */
  async paginateOffset(page: number, perPage: number, args?: Parameters<DatabaseManagement<any>["findMany"]>[0], txClient?: any): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * perPage;
    const findManyArgs = { ...(args || {}), skip, take: perPage };

    const dataPromise = this.manager.findMany<T>(findManyArgs, undefined, undefined, undefined, txClient);
    const countArgs = args && typeof args === "object" && "where" in args && args.where ? { where: args.where as any } : {};
    const countPromise = (txClient ?? (this.manager as any).model).count(countArgs);

    const [data, total] = await Promise.all([dataPromise, countPromise]);
    return { data, total };
  }

  /** Paginate with cursor */
  async paginateCursor(
    perPage: number,
    cursor?: T[K],
    args?: Omit<Parameters<DatabaseManagement<any>["findMany"]>[0], "cursor" | "skip" | "take" | "orderBy">,
    txClient?: any
  ): Promise<{ data: T[]; nextCursor: T[K] | null }> {
    const query: any = {
      ...args,
      take: perPage,
      orderBy: { [this.pkField]: "asc" as const },
    };
    if (cursor !== undefined) {
      query.cursor = { [this.pkField]: cursor };
      query.skip = 1;
    }
    const data = await this.manager.findMany<T>(query, undefined, undefined, undefined, txClient);
    const nextCursor = data.length ? data[data.length - 1][this.pkField] : null;
    return { data, nextCursor };
  }

  /** Find first record matching condition */
  public findFirst(args?: any, txClient?: any): Promise<T | null> {
    return this.manager.findFirst<T>(args ?? {}, undefined, undefined, undefined, txClient);
  }

  /** Find unique by primary key */
  findUnique(id: T[K], txClient?: any): Promise<T | null> {
    return this.manager.findUnique<T>({ where: { [this.pkField]: id } as Record<K, T[K]> }, undefined, undefined, undefined, txClient);
  }
}
