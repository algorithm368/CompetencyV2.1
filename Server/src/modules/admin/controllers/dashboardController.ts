import { Request, Response, NextFunction } from "express";
import { DashboardService } from "@Admin/services/DashboardService";

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await DashboardService.getSummary();
      res.json(summary);
    } catch (err) {
      console.error("Dashboard summary error:", err);
      next(err);
    }
  }
}
