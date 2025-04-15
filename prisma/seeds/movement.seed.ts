import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const movements = [
    { name: "Automatic" },
    { name: "Manual Winding" },
    { name: "Quartz" },
    { name: "Solar" },
    { name: "Kinetic" },
    { name: "Spring Drive" },
    { name: "Mechanical" },
    { name: "Chronograph" },
    { name: "Eco-Drive" },
    { name: "Co-Axial" },
    { name: "Tourbillon" },
    { name: "Perpetual Calendar" }
];

async function seedMovements() {
    try {
        console.log('Starting movement seeding...');

        for (const movement of movements) {
            const existingMovement = await prisma.movement.findUnique({
                where: { name: movement.name }
            });

            if (!existingMovement) {
                await prisma.movement.create({
                    data: movement
                });
                console.log(`Created movement: ${movement.name}`);
            } else {
                console.log(`Movement ${movement.name} already exists`);
            }
        }

        console.log('Movement seeding completed successfully');
    } catch (error) {
        console.error('Error seeding movements:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedMovements();