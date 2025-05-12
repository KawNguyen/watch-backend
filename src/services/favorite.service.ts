import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FavoriteService {
  async addToFavorites(userId: string, watchId: string) {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_watchId: {
          userId,
          watchId,
        },
      },
    });

    if (existingFavorite) {
      return {
        status: 400,
        message: "This watch is already in your favorites list",
      };
    }

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

  async getUserFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        watch: {
          include: {
            brand: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      status: 200,
      message: "Favorites fetched successfully",
      data: {
        items: favorites,
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
