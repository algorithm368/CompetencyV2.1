import { Request, Response, NextFunction } from "express";
import { InformationService } from "@Admin/services/sfia/InformationService";
import type { Information } from "@prisma/client_sfia";

const infoService = new InformationService();

export class InformationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await infoService.getAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await infoService.getById(id);
      if (!item) {
        return res.status(404).json({ error: `Information with id ${id} not found` });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const data = req.body as Omit<Information, "id">;
      const newItem = await infoService.create(data, actor);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      const updates = req.body as Partial<Omit<Information, "id">>;
      const updated = await infoService.update(id, updates, actor);
      res.json(updated);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Information with id ${req.params.id} not found` });
      }
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      await infoService.delete(id, actor);
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Information with id ${req.params.id} not found` });
      }
      next(err);
    }
  }
}
