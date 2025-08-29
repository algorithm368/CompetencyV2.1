import { Request, Response, NextFunction } from "express";
import { SectorService } from "@Admin/services/tpqi/SectorService";

const service = new SectorService();

export class SectorController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const page = req.query.page ? Number(req.query.page) : undefined;
      const perPage = req.query.perPage ? Number(req.query.perPage) : undefined;

      const result = await service.getAll(search, page, perPage);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await service.getById(id);
      if (!item) {
        return res.status(404).json({ error: `Sector with id ${id} not found` });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const data = req.body as Omit<import("@prisma/client_tpqi").Sector, "id_sector">;
      const newItem = await service.create(data, actor);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      const updates = req.body as Partial<Omit<import("@prisma/client_tpqi").Sector, "id_sector">>;
      const updated = await service.update(id, updates, actor);
      res.json(updated);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Sector with id ${req.params.id} not found` });
      }
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      await service.delete(id, actor);
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Sector with id ${req.params.id} not found` });
      }
      next(err);
    }
  }
}
