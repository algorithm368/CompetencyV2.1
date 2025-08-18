import { Request, Response, NextFunction } from "express";
import { OperationService } from "@/modules/admin/services/rbac/operationService";
import type { Operation } from "@prisma/client_competency";

const service = new OperationService();

interface AuthenticatedRequest extends Request {
  user?: { userId?: string };
}

function OperationView(operation: Operation) {
  return {
    id: operation.id,
    name: operation.name,
    description: operation.description,
    updatedAt: operation.updatedAt,
  };
}

function OperationListView(operations: Operation[]) {
  return operations.map(OperationView);
}

export class OperationController {
  static async createOperation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const actor = req.user?.userId || "system";

      if (!name) {
        return res.status(400).json({ error: "name is required" });
      }

      const operation = await service.createOperation(name, description, actor);
      return res.status(201).json(OperationView(operation));
    } catch (error) {
      next(error);
    }
  }

  static async updateOperation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updates = req.body;
      const actor = req.user?.userId || "system";

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      // คัดกรองเฉพาะ fields ที่อนุญาตแก้ไข
      const allowedFields = ["name", "description"] as const;
      type AllowedField = (typeof allowedFields)[number];
      const filteredUpdates: Partial<Omit<Operation, "id" | "updatedAt">> = {};

      for (const key of allowedFields) {
        if (key in updates) {
          filteredUpdates[key] = updates[key as AllowedField];
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const updatedOperation = await service.updateOperation(id, filteredUpdates, actor);
      return res.status(200).json(OperationView(updatedOperation));
    } catch (error) {
      next(error);
    }
  }

  static async deleteOperation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const actor = req.user?.userId || "system";

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const deletedOperation = await service.deleteOperation(id, actor);
      return res.status(200).json(OperationView(deletedOperation));
    } catch (error) {
      next(error);
    }
  }

  static async getOperationById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }

      const operation = await service.getById(id);
      if (!operation) {
        return res.status(404).json({ error: "Operation not found" });
      }

      return res.status(200).json(OperationView(operation));
    } catch (error) {
      next(error);
    }
  }

  static async getOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.getAll();
      return res.status(200).json({
        total: result.total,
        data: OperationListView(result.data),
      });
    } catch (error) {
      next(error);
    }
  }
}
