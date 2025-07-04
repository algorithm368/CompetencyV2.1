import fs from "fs";
import path from "path";

/** Interface for log entries */
interface LogEvent {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  actor: string;
  action: string;
  model: string;
  data: any;
  requestId?: string;
}

/** Logger interface for DI */
export interface Logger {
  log(event: LogEvent): Promise<void>;
}

/** File-based JSON logger with batching & daily rotation */
export class FileLogger implements Logger {
  private buffer: LogEvent[] = [];
  private flushing = false;

  /**
   * @param dirPath - base directory for log files; defaults to "<project-root>/logs"
   * @param prefix   - filename prefix (e.g. "application")
   * @param daily    - whether to roll files daily
   */
  constructor(private readonly dirPath: string = path.resolve(process.cwd(), "logs"), private readonly prefix: string = "application", private readonly daily: boolean = true) {}

  public async log(event: LogEvent): Promise<void> {
    this.buffer.push(event);
    if (!this.flushing) {
      this.flushing = true;
      setTimeout(() => this.flushBuffer().catch(console.error), 1_000);
    }
  }

  private getFilePath(): string {
    const dateSuffix = this.daily ? `-${new Date().toISOString().slice(0, 10)}` : "";
    const fileName = `${this.prefix}${dateSuffix}.log`;
    return path.join(this.dirPath, fileName);
  }

  private async flushBuffer(): Promise<void> {
    const entries = this.buffer.splice(0);
    if (entries.length === 0) {
      this.flushing = false;
      return;
    }

    const lines =
      entries
        .map((evt) => {
          const dataStr = `[${JSON.stringify(evt.data)}]`;
          const reqIdStr = evt.requestId ? `[${evt.requestId}]` : `[]`;
          return [`[${evt.timestamp}]`, `[${evt.level}]`, `[${evt.actor}]`, `[${evt.action}]`, `[${evt.model}]`, dataStr, reqIdStr].join(",");
        })
        .join("\n") + "\n";

    const filePath = this.getFilePath();
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.appendFile(filePath, lines);
    this.flushing = false;
  }
}

/** Null logger that discards all logs */
export class NullLogger implements Logger {
  public async log(_event: LogEvent): Promise<void> {
    // no-op
  }
}

/** Custom error wrapper for DB ops */
export class DatabaseError extends Error {
  constructor(public readonly action: string, public readonly model: string, public readonly originalError: Error) {
    super(`DatabaseError [${action}] on ${model}: ${originalError.message}`);
    this.name = "DatabaseError";
    this.stack = originalError.stack;
  }
}

/** Hooks definition */
type HookContext<T> = { params: any; result?: T };
export interface Hooks<T> {
  beforeCreate?: (ctx: HookContext<T>) => Promise<void>;
  afterCreate?: (ctx: HookContext<T>) => Promise<void>;
}

/** Generic DB manager with logging, hooks & utils */
export class DatabaseManagement<M extends Record<string, any>> {
  private modelName: string;

  constructor(private readonly model: M, private readonly defaultActor: string = "system", private readonly defaultLogger: Logger = new FileLogger(), private readonly hooks: Hooks<any> = {}) {
    // Try to infer a name for logging
    this.modelName = (model as any).name ?? model.constructor?.name ?? "UnknownModel";
  }

  /**
   * Internal helper to write a log entry.
   *
   * @param level     Log level ("INFO" | "WARN" | "ERROR")
   * @param action    CRUD action name ("CREATE", "UPDATE", etc.)
   * @param data      Payload or result to include in the log
   * @param actor     Who performed this action
   * @param requestId Optional request identifier for correlation
   */
  private async logEvent(level: LogEvent["level"], action: string, data: any, actor: string, requestId: string | undefined, logger: Logger) {
    await logger.log({
      timestamp: new Date().toISOString(),
      level,
      actor,
      action,
      model: this.modelName,
      data,
      requestId,
    });
  }

  /**
   * Find a unique record by conditions.
   *
   * @param args        Arguments for model.findUnique(...)
   * @param actor       (optional) defaults to this.defaultActor
   * @param logger      (optional) defaults to this.defaultLogger
   * @returns           The found record or null
   */
  public async findUnique<T>(args: Parameters<M["findUnique"]>[0]): Promise<T | null> {
    try {
      return await this.model.findUnique(args);
    } catch (err: any) {
      throw new DatabaseError("READ_ONE", this.modelName, err);
    }
  }
  /**
   * Find multiple records with optional filters.
   *
   * @param params      Arguments for model.findMany(...)
   * @param actor       (optional) defaults to this.defaultActor
   * @param logger      (optional) defaults to this.defaultLogger
   * @returns            Array of records
   */
  public async findMany<T>(params: Parameters<M["findMany"]>[0] = {} as any): Promise<T[]> {
    try {
      if (params && (params as any).$scalars && ((params as any).include || (params as any).select)) {
        delete (params as any).$scalars;
      }

      return await this.model.findMany(params);
    } catch (err: any) {
      throw new DatabaseError("READ_MANY", this.modelName, err);
    }
  }

  /** Find the first record that matches the condition */
  public async findFirst<T>(params: Parameters<M["findFirst"]>[0] = {} as any): Promise<T | null> {
    try {
      const result = await (this.model as any).findFirst(params);
      return result as T | null;
    } catch (err: any) {
      throw new DatabaseError("READ_FIRST", this.modelName, err);
    }
  }

  /**
   * Create a new record (with optional hooks).
   *
   * @param params       Arguments for model.create(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The newly created record
   */
  public async create<T>(params: Parameters<M["create"]>[0], actor: string = this.defaultActor, requestId?: string, logger: Logger = this.defaultLogger): Promise<T> {
    const ctx: HookContext<T> = { params };
    try {
      if (this.hooks.beforeCreate) {
        await this.hooks.beforeCreate(ctx);
      }
      const result = await this.model.create(params);
      ctx.result = result;
      await this.logEvent("INFO", "CREATE", result, actor, requestId, logger);

      if (this.hooks.afterCreate) {
        await this.hooks.afterCreate(ctx);
      }

      return result;
    } catch (err: any) {
      console.error("[CREATE] Error:", err.message);
      await this.logEvent("ERROR", "CREATE", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("CREATE", this.modelName, err);
    }
  }

  /**
   * Update an existing record.
   *
   * @param params       Arguments for model.update(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The updated record
   */
  public async update<T>(params: Parameters<M["update"]>[0], actor: string = this.defaultActor, requestId?: string, logger: Logger = this.defaultLogger): Promise<T> {
    try {
      const result = await this.model.update(params);
      await this.logEvent("INFO", "UPDATE", result, actor, requestId, logger);
      return result;
    } catch (err: any) {
      await this.logEvent("ERROR", "UPDATE", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("UPDATE", this.modelName, err);
    }
  }

  /**
   * Bulk update multiple records.
   *
   * @param params       Arguments for model.updateMany(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The updateMany result ({ count: number })
   */
  public async updateMany(
    params: Parameters<M["updateMany"]>[0],
    actor: string = this.defaultActor,
    requestId?: string,
    logger: Logger = this.defaultLogger
  ): Promise<Awaited<ReturnType<M["updateMany"]>>> {
    try {
      const result = await (this.model as any).updateMany(params);
      await this.logEvent("INFO", "UPDATE_MANY", result, actor, requestId, logger);
      return result as Awaited<ReturnType<M["updateMany"]>>;
    } catch (err: any) {
      await this.logEvent("ERROR", "UPDATE_MANY", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("UPDATE_MANY", this.modelName, err);
    }
  }

  /**
   * Delete a single record.
   *
   * @param params       Arguments for model.delete(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The deleted record
   */
  public async delete<T>(params: Parameters<M["delete"]>[0], actor: string = this.defaultActor, requestId?: string, logger: Logger = this.defaultLogger): Promise<T> {
    try {
      const result = await this.model.delete(params);
      await this.logEvent("INFO", "DELETE", result, actor, requestId, logger);
      return result;
    } catch (err: any) {
      await this.logEvent("ERROR", "DELETE", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("DELETE", this.modelName, err);
    }
  }

  public async deleteByCompositeKey<T>(compositeKey: Record<string, any>, actor: string = this.defaultActor, requestId?: string, logger: Logger = this.defaultLogger): Promise<T> {
    try {
      const result = await this.model.delete({ where: compositeKey });
      await this.logEvent("INFO", "DELETE", result, actor, requestId, logger);
      return result;
    } catch (err: any) {
      await this.logEvent("ERROR", "DELETE", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("DELETE", this.modelName, err);
    }
  }

  /**
   * Delete multiple records.
   *
   * @param params       Arguments for model.deleteMany(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The deleteMany result
   */
  public async deleteMany(
    params: Parameters<M["deleteMany"]>[0],
    actor: string = this.defaultActor,
    requestId?: string,
    logger: Logger = this.defaultLogger
  ): Promise<Awaited<ReturnType<M["deleteMany"]>>> {
    try {
      const result = await this.model.deleteMany(params);
      await this.logEvent("INFO", "DELETE_MANY", result, actor, requestId, logger);
      return result as Awaited<ReturnType<M["deleteMany"]>>;
    } catch (err: any) {
      await this.logEvent("ERROR", "DELETE_MANY", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("DELETE_MANY", this.modelName, err);
    }
  }

  /**
   * Upsert a record (insert or update).
   *
   * @param params       Arguments for model.upsert(...)
   * @param actor        (optional) defaults to this.defaultActor
   * @param requestId    (optional) a request‐correlation ID
   * @param logger       (optional) defaults to this.defaultLogger
   * @returns             The upserted record
   */
  public async upsert<T>(params: Parameters<M["upsert"]>[0], actor: string = this.defaultActor, requestId?: string, logger: Logger = this.defaultLogger): Promise<T> {
    try {
      const result = await this.model.upsert(params);
      await this.logEvent("INFO", "UPSERT", result, actor, requestId, logger);
      return result;
    } catch (err: any) {
      await this.logEvent("ERROR", "UPSERT", { error: err.message }, actor, requestId, logger);
      throw new DatabaseError("UPSERT", this.modelName, err);
    }
  }

  /**
   * Paginate results.
   *
   * @param options  { page, perPage, where?, orderBy? }
   * @returns        An object containing `data: T[]` and `total: number`
   */
  public async paginate<T>(options: { page: number; perPage: number; where?: any; orderBy?: any }): Promise<{ data: T[]; total: number }> {
    try {
      const { page, perPage, where, orderBy } = options;
      const skip = (page - 1) * perPage;
      const [data, total] = await Promise.all([this.model.findMany({ where, orderBy, take: perPage, skip }), (this.model as any).count({ where })]);

      return { data: data as T[], total };
    } catch (err: any) {
      throw new DatabaseError("PAGINATE", this.modelName, err);
    }
  }

  /**
   * Run multiple operations inside a transaction.
   *
   * @param operations  A callback that receives a transactional client
   * @returns           The result of the transaction
   */
  public async transaction(operations: (client: M) => Promise<any[]>, actor: string = this.defaultActor): Promise<any[]> {
    if (typeof (this.model as any).$transaction !== "function") {
      throw new Error("Transactions not supported by this model");
    }

    try {
      const result = await (this.model as any).$transaction(async (txClient: M) => {
        return await operations(txClient);
      });
      return result;
    } catch (err: any) {
      throw new DatabaseError("TRANSACTION", this.modelName, err);
    }
  }

  /**
   * Count records with optional filters.
   *
   * @param args     Arguments for model.count(...)
   * @returns        Number of matching records
   */
  public async count(args: Parameters<M["count"]>[0] = {}): Promise<number> {
    try {
      return await (this.model as any).count(args);
    } catch (err: any) {
      throw new DatabaseError("COUNT", this.modelName, err);
    }
  }
}
