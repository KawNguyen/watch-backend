import { Router } from "express";
import { MovementController } from "../controllers/movement.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const movementRouter = Router();
const movementController = new MovementController();

movementRouter.get("/search", movementController.search);
/**
 * @swagger
 * /v1/api/movements:
 *   get:
 *     tags:
 *       - Movements
 *     description: Get all movements
 *     operationId: getAllMovements
 *     summary: getAllMovements
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer  
 *       - in: query  
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success 
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
movementRouter.get("/", movementController.findAll);
movementRouter.get("/:id", movementController.findOne);
movementRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  movementController.create,
);
movementRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  movementController.update,
);
movementRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  movementController.delete,
);

export default movementRouter;
