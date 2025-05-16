import { Router } from "express";
import { BandMaterialController } from "../controllers/bandMaterial.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const bandMaterialRouter = Router();
const bandMaterialController = new BandMaterialController();

bandMaterialRouter.get("/search", bandMaterialController.search);
/**
 * @swagger
 * /v1/api/band-materials:
 *   get:
 *     tags:
 *       - Band
 *     description: Get all bandMaterials
 *     operationId: getAllBandMaterials
 *     summary: getAllBandMaterials
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
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
bandMaterialRouter.get("/", bandMaterialController.findAll);
bandMaterialRouter.get("/:id", bandMaterialController.findOne);
bandMaterialRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.create,
);
bandMaterialRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.update,
);
bandMaterialRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  bandMaterialController.delete,
);

export default bandMaterialRouter;
