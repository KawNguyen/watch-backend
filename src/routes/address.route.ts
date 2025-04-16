import { Router } from "express";
import { AddressController } from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const addressRouter = Router();
const addressController = new AddressController();

addressRouter.use(authMiddleware);

addressRouter.get("/", (req, res) => addressController.findAllByUser(req, res));
addressRouter.get("/:id", (req, res) => addressController.findOne(req, res));
addressRouter.post("/create", (req, res) => addressController.create(req, res));
addressRouter.put("/update/:id", (req, res) =>
  addressController.update(req, res),
);
addressRouter.delete("/delete/:id", (req, res) =>
  addressController.delete(req, res),
);

export default addressRouter;
