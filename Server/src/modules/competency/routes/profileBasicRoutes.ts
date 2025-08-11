import { Router } from "express";
import { getUserBasicInfoController } from "../controllers/profileController";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/competency/profile/basic:
 *   get:
 *     summary: Get basic user info (for avatar/display purposes)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Basic user info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstNameEN:
 *                       type: string
 *                     firstNameTH:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, getUserBasicInfoController);

export default router;
