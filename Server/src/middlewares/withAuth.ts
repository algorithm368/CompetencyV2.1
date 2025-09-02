import { Request, Response, NextFunction } from "express";
import { authenticate, authorizeRole, authorizeInstance } from "./authMiddleware";

type Handler = (req: Request, res: Response, next: NextFunction) => any;

interface AuthOptions {
  resource?: string;
  action?: string;
  roles?: string | string[];
}

export const withAuth = (options: AuthOptions, handler: Handler) => {
  const middlewares: Handler[] = [authenticate];

  if (options.roles) {
    // ถ้ามี roles กำหนดเฉพาะ role-based auth
    middlewares.push(authorizeRole(options.roles));
  } else if (options.resource && options.action) {
    // ถ้า resource + action กำหนด permission-level auth
    middlewares.push(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const resource = options.resource!;
        const action = options.action!;
        await authorizeInstance(resource, action)(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }

  return [...middlewares, handler];
};
