import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PAGE_SIZE = 20;

export class UserService {
  async getAllUsers(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    return {
      status: 200,
      message: "Users fetched successfully",
      data: {
        items: users,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async getAllCustomers(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'CUSTOMER',
        },
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),
    ]);

    return {
      status: 200,
      message: "Customers fetched successfully",
      data: {
        items: users,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async searchUsers(filters: {
      query?: string;
      page?: number;
      pageSize?: number;
    }) {
      const {
        query,
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE,
      } = filters;
  
      const skip = (page - 1) * pageSize;
      const where: any = {};
  
      if (query) {
        where.OR = [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            }
          },
          {
            phone: {
              contains: query,
              mode: 'insensitive',
            }
          },
        ];
      }
  
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: pageSize,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.user.count({ where }),
      ]);
  
      return {
        status: 200,
        message: "Users searched successfully",
        data: {
          items: users,
        },
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / pageSize),
          itemsPerPage: pageSize,
        },
      };
    }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        gender: true,
        paymentMethod: true,
        addresses: {
          select: {
            id: true,
            street: true,
            district: true,
            ward: true,
            city: true,
            country: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      data: {
        item: user,
      },
    };
  }

  async updateUser(id: string, data: any) {
    const {
      name,
      email,
      phone,
      avatar,
      gender,
      addresses,
      paymentMethod,
    } = data;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        avatar,
        gender,
        addresses,
        paymentMethod,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        phone: true,
        gender: true,
        paymentMethod: true,
        addresses: {
          select: {
            id: true,
            street: true,
            district: true,
            ward: true,
            city: true,
            country: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      status: 200,
      message: "User updated successfully",
      data: {
        item: updatedUser,
      },
    };
  }

  async deleteUser(id: string) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return {
      status: 200,
      message: "User deleted successfully",
      data: {
        item: {
          id: deletedUser.id,
        },
      },
    };
  }
}
