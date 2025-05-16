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
 *     tags:
 *      - Watches
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

/**
 * @swagger
 * /v1/api/watches/brand/{brandSlug}:
 *   get:
 *     tags:
 *       - Watches
 *     summary: Get watches by brand
 *     parameters:
 *       - in: path
 *         name: brandSlug
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
watchRouter.get("/brand/:brandSlug", watchController.getWatchesByBrand);
watchRouter.get(
  "/movement/:movementName",
  watchController.getWatchesByMovement,
);
/**
 * @swagger
 * /v1/api/watches/{id}:
 *   get:
 *     tags:
 *       - Watches
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
/**
 * @swagger
 * /v1/api/watches/create:
 *   post:
 *     tags:
 *      - Watches
 *     summary: Create a new watch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:         
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               brand:
 *                 type: string
 *               bandMaterial:
 *                 type: string
 *               movement:
 *                 type: string
 *               material:
 *                 type: string
 *               gender:
 *                 type: string
 *               diameter:
 *                 type: number 
 *               waterResistance:
 *                 type: number
 *               warranty:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
watchRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  watchController.create,
);
/**
 * @swagger
 * /v1/api/watches/update/{id}:
 *   put:
 *     tags:
 *      - Watches
 *     summary: Update a watch by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:       
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number 
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               brand:
 *                 type: string
 *               bandMaterial:
 *                 type: string
 *               movement:
 *                 type: string
 *               material:
 *                 type: string
 *               gender:
 *                 type: string
 *               diameter:
 *                 type: number   
 *               waterResistance:
 *                 type: number
 *               warranty:
 *                 type: number
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
watchRouter.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  watchController.update,
);
/**
 * @swagger
 * /v1/api/watches/delete/{id}:
 *   delete:
 *     tags:
 *       - Watches
 *     summary: Delete a watch by ID
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
watchRouter.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  watchController.delete,
);

export default watchRouter;
