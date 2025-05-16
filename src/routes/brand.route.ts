import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const brandRouter = Router();
const brandController = new BrandController();

brandRouter.get("/search", brandController.search);
/**
 * @swagger
 * /v1/api/brands:
 *   get:
 *     tags:
 *       - Brands
 *     description: Get all brands
 *     operationId: getAllBrands
 *     summary: getAlltBrands
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

 */
brandRouter.get("/", brandController.findAll);
brandRouter.get("/:id", brandController.findOne);
brandRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  brandController.create,
);
brandRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  brandController.update,
);
brandRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  brandController.delete,
);

export default brandRouter;
