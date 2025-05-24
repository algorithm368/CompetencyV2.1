import { Request, Response, NextFunction } from "express";
import { CategoryService } from "@Admin/services/sfia/CategoryService";

const service = new CategoryService();

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const perPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : undefined;
      const items = await service.getAll(search, page, perPage);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = await service.getById(id);
      if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
      }
      res.json(category);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const data = req.body as Omit<import("@prisma/client_sfia").Category, "id">;
      const newCategory = await service.create(data, actor);
      res.status(201).json(newCategory);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.headers["x-actor-id"] as string;
      const id = Number(req.params.id);
      const updates = req.body as Partial<Omit<import("@prisma/client_sfia").Category, "id">>;
      const updated = await service.update(id, updates, actor);
      res.json(updated);
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Category with id ${req.params.id} not found` });
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
        return res.status(404).json({ error: `Category with id ${req.params.id} not found` });
      }
      next(err);
    }
  }
}
