import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BandMaterialService {
    async findAll() {
        return await prisma.bandMaterial.findMany({
            include: {
                watches: true
            }
        });
    }

    async findOne(id: string) {
        return await prisma.bandMaterial.findUnique({
            where: { id },
            include: {
                watches: true
            }
        });
    }

    async create(data: { name: string }) {
        return await prisma.bandMaterial.create({
            data
        });
    }

    async update(id: string, data: { name: string }) {
        return await prisma.bandMaterial.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return await prisma.bandMaterial.delete({
            where: { id }
        });
    }
}