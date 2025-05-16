import { Router } from "express";
import { WatchController } from "../controllers/watch.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const watchRouter = Router();
const watchController = new WatchController();

/**
 * @swagger
 * /v1/api/watches:
 *   get:
 *     summary: getWatches
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: bandMaterial
 *         schema:
 *           type: string
 *       - in: query
 *         name: movement
 *         schema:
 *           type: string
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *       - in: query
 *         name: diameter
 *         schema:
 *           type: number
 *       - in: query
 *         name: waterResistance
 *         schema:
 *           type: number
 *       - in: query
 *         name: warranty
 *         schema:
 *           type: number
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
watchRouter.get("/", watchController.getWatches);

// watchRouter.get("/", watchController.findAll);
watchRouter.get("/brand/:brandId", watchController.getWatchesByBrand);
watchRouter.get(
  "/movement/:movementName",
  watchController.getWatchesByMovement,
);
/**
 * @swagger
 * /v1/api/watches/{id}:
 *   get:
 *     summary: Get a watch by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:     
 *         description: Not Found   
 *       500:   
 *         description: Internal Server Error
 */
watchRouter.get("/:id", watchController.findOne);
watchRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  watchController.create,
);
watchRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  watchController.update,
);
watchRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  watchController.delete,
);

export default watchRouter;
