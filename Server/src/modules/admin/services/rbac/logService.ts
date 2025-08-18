import { LogRepository } from "@Competency/repositories/RoleRepository";
import type { Log, LogAction } from "@prisma/client_competency";
import { BaseService } from "@Utils/BaseService";

export class LogService extends BaseService<Log, "id"> {
  constructor() {
    super(new LogRepository(), ["databaseName", "tableName", "userId", "action"], "id");
  }

  // สร้าง log ใหม่
  async createLog(action: LogAction, databaseName: string, tableName: string, userId?: string, recordId?: string, parameters?: string): Promise<Log> {
    return this.repo.create(
      {
        action,
        databaseName,
        tableName,
        userId,
        recordId,
        parameters,
        timestamp: new Date(),
      },
      userId || "system"
    );
  }

  // ดึง log ทั้งหมด โดยมีตัวเลือก filter
  async getLogs(filter?: Partial<Pick<Log, "action" | "databaseName" | "tableName" | "userId">>, page?: number, perPage?: number): Promise<{ data: Log[]; total: number }> {
    const where = { ...filter };
    return this.getAll(undefined, page, perPage);
  }

  // ดึง log ตาม id
  async getLogById(id: number): Promise<Log | null> {
    return this.getById(id);
  }
}
