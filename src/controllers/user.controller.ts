import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await userService.getAllCustomers();
      res.json(customers);
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json(user);
      return;
    } catch (error: any) {
      res.status(404).json({ message: error.message });
      return;
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await userService.updateUser(id, userData);
      res.status(200).json({
        message: "User updated successfully",
        user: {
          id: user.data.item.id,
          name: user.data.item.name,
          email: user.data.item.email,
          role: user.data.item.role,
          avatar: user.data.item.avatar,
          // gender: user.data.item.gender,
          // phone: user.data.item.phone,
          // address: user.data.item.addresses,
          // paymentMethod: user.data.item.paymentMethod,
        },
      });
      return;
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: "User deleted successfully" });
      return;
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return;
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const { query, page, limit } = req.query;

      const filters = {
        query: query as string,
        page: page ? Number(page) : undefined,
        pageSize: limit ? Number(limit) : undefined,
      };

      const result = await userService.searchUsers(filters);

      if (!result.data.items.length) {
        res.status(404).json({
          message: "No watches found matching your search criteria",
        });
        return;
      }

      res.json(result);
      return;
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
}
