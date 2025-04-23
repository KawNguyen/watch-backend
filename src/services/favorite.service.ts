import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PAGE_SIZE = 20;

export class FavoriteService {
  async addToFavorites(userId: string, watchId: string) {
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        watchId,
      },
      include: {
        watch: {
          include: {
            brand: true,
            images: true,
          },
        },
      },
    });

    return {
      status: 201,
      message: "Added to favorites successfully",
      data: {
        item: favorite,
      },
    };
  }

  async removeFromFavorites(userId: string, watchId: string) {
    const favorite = await prisma.favorite.delete({
      where: {
        userId_watchId: {
          userId,
          watchId,
        },
      },
    });

    return {
      status: 200,
      message: "Removed from favorites successfully",
      data: {
        item: favorite,
      },
    };
  }

  async getUserFavorites(userId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * pageSize;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: {
          userId,
        },
        skip,
        take: pageSize,
        include: {
          watch: {
            include: {
              brand: true,
              images: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.favorite.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      status: 200,
      message: "Favorites fetched successfully",
      data: {
        items: favorites,
      },
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / pageSize),
        itemsPerPage: pageSize,
      },
    };
  }

  async checkFavorite(userId: string, watchId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_watchId: {
          userId,
          watchId,
        },
      },
    });

    return {
      status: 200,
      message: "Favorite status checked successfully",
      data: {
        isFavorite: !!favorite,
      },
    };
  }
}