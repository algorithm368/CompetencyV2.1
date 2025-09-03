import { Router } from "express";
import { UserController } from "@/modules/admin/controllers/rbac/userController";
import { withAuth } from "@/middlewares/withAuth";

const router = Router();

router.post("/users", withAuth({ resource: "User", action: "create" }, UserController.createUser));

router.get("/users", withAuth({ resource: "User", action: "read" }, UserController.getAll));

router.get("/users/:id", withAuth({ resource: "User", action: "read" }, UserController.getUserById));

router.get("/users/by-email", withAuth({ resource: "User", action: "read" }, UserController.getUserByEmail));

router.get("/users/search-by-email", withAuth({ resource: "User", action: "read" }, UserController.searchUsersByEmail));

router.put("/users/:id", withAuth({ resource: "User", action: "update" }, UserController.updateUser));

// ลบ user เฉพาะ admin
router.delete("/users/:id", withAuth({ roles: "admin" }, UserController.deleteUser));

export default router;
