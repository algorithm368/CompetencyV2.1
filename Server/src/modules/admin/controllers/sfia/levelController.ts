import { Request, Response, NextFunction } from "express";
import { LevelsService } from "@Admin/services/sfia/LevelsService";
import type { Levels } from "@prisma/client_sfia";

const levelsService = new LevelsService();

export class LevelsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await levelsService.getAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = await levelsService.getById(id);
      if (!item) {
        return res.status(404).json({ error: `Levels with id ${id} not found` });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const data = req.body as Omit<Levels, "id">;
      const newItem = await levelsService.create(data, actor);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      const updates = req.body as Partial<Omit<Levels, "id">>;
      const updated = await levelsService.update(id, updates, actor);
      res.json(updated);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Levels with id ${req.params.id} not found` });
      }
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      await levelsService.delete(id, actor);
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Levels with id ${req.params.id} not found` });
      }
      next(err);
    }
  }
}
