import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MovementService {
    async findAll() {
        const movements = await prisma.movement.findMany();
        return {
            items: movements,
            meta: {
                total: movements.length
            }
        };
    }

    async findOne(id: string) {
        return await prisma.movement.findUnique({
            where: { id }
        });
    }

    async create(data: { name: string }) {
        return await prisma.movement.create({
            data
        });
    }

    async update(id: string, data: { name: string }) {
        return await prisma.movement.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return await prisma.movement.delete({
            where: { id }
        });
    }
}