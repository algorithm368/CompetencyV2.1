import { Request, Response, NextFunction } from "express";
import { LogService } from "@/modules/admin/services/rbac/logService";
import { LogAction } from "@prisma/client_competency";
import type { Log } from "@prisma/client_competency";

const service = new LogService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

// แปลง Log entity ก่อนส่ง response
function LogView(log: Log) {
  return {
    id: log.id,
    action: log.action,
    databaseName: log.databaseName,
    tableName: log.tableName,
    userId: log.userId,
    recordId: log.recordId,
    parameters: log.parameters,
    timestamp: log.timestamp,
  };
}

function LogListView(logs: Log[]) {
  return logs.map(LogView);
}

export class LogController {
  // สร้าง log ใหม่
  static async createLog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { action, databaseName, tableName, recordId, parameters } = req.body;
      const userId = req.user?.userId;

      if (!action || !databaseName || !tableName) {
        return res.status(400).json({ error: "action, databaseName, and tableName are required" });
      }

      // Validate action is valid enum value (optional)
      if (!Object.values(LogAction).includes(action)) {
        return res.status(400).json({ error: "Invalid action value" });
      }

      const log = await service.createLog(action, databaseName, tableName, userId, recordId, parameters);
      return res.status(201).json(LogView(log));
    } catch (error) {
      next(error);
    }
  }

  // ดึง log list โดยรองรับ query filter และ pagination
  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // query params เช่น ?action=CREATE&databaseName=mydb&page=1&perPage=20
      const { action, databaseName, tableName, userId, page = "1", perPage = "20" } = req.query;

      const filter: Partial<Pick<Log, "action" | "databaseName" | "tableName" | "userId">> = {};

      if (action && typeof action === "string") filter.action = action as LogAction;
      if (databaseName && typeof databaseName === "string") filter.databaseName = databaseName;
      if (tableName && typeof tableName === "string") filter.tableName = tableName;
      if (userId && typeof userId === "string") filter.userId = userId;

      const pageNum = parseInt(page as string, 10) || 1;
      const perPageNum = parseInt(perPage as string, 10) || 20;

      const { data, total } = await service.getLogs(filter, pageNum, perPageNum);

      return res.status(200).json({
        total,
        page: pageNum,
        perPage: perPageNum,
        data: LogListView(data),
      });
    } catch (error) {
      next(error);
    }
  }

  // ดึง log ตาม id
  static async getLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const log = await service.getLogById(id);
      if (!log) {
        return res.status(404).json({ error: "Log not found" });
      }

      return res.status(200).json(LogView(log));
    } catch (error) {
      next(error);
    }
  }
}
