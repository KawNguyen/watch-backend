import { Router } from "express";
import { MaterialController } from "../controllers/material.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const materialRouter = Router();
const materialController = new MaterialController();

materialRouter.get("/search", materialController.search);
/**
 * @swagger
 * /v1/api/materials:
 *   get:
 *     tags:
 *       - Materials
 *     description: Get all materials
 *     operationId: getAllMaterials
 *     summary: getAllMaterials
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
materialRouter.get("/", materialController.findAll);
materialRouter.get("/:id", materialController.findOne);
materialRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  materialController.create,
);
materialRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  materialController.update,
);
materialRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  materialController.delete,
);

export default materialRouter;
