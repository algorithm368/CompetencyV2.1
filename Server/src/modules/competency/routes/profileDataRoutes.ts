import { Router } from "express";
import { getUserProfileController, updateUserProfileController } from "../controllers/profileController";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/competency/profile:
 *   get:
 *     summary: Get current user's profile data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate, getUserProfileController);

/**
 * @swagger
 * /api/competency/profile:
 *   put:
 *     summary: Update current user's profile data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstNameTH:
 *                 type: string
 *               lastNameTH:
 *                 type: string
 *               firstNameEN:
 *                 type: string
 *               lastNameEN:
 *                 type: string
 *               phone:
 *                 type: string
 *               line:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/", authenticate, updateUserProfileController);

export default router;
