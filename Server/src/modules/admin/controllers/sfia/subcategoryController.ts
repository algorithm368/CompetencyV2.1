import { Request, Response, NextFunction } from "express";
import { SubcategoryService } from "@Admin/services/sfia/SubcategoryService";
import type { Subcategory } from "@prisma/client_sfia";

const subcatService = new SubcategoryService();

export class SubcategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await subcatService.getAll();
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const item = await subcatService.getById(id);
      if (!item) {
        return res.status(404).json({ error: `Subcategory with id ${id} not found` });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const data = req.body as Omit<Subcategory, "id">;
      const newItem = await subcatService.create(data, actor);
      res.status(201).json(newItem);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = req.params.id;
      const updates = req.body as Partial<Omit<Subcategory, "id">>;
      const updated = await subcatService.update(id, updates, actor);
      res.json(updated);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Subcategory with id ${req.params.id} not found` });
      }
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = req.params.id;
      await subcatService.delete(id, actor);
      res.status(204).send();
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Subcategory with id ${req.params.id} not found` });
      }
      next(err);
    }
  }
}
