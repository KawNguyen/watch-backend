import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const movements = [
  { name: "Automatic" },
  { name: "Quartz" },
  { name: "Mechanical" },
];

async function seedMovements() {
  try {
    console.log("Starting movement seeding...");

    for (const movement of movements) {
      const existingMovement = await prisma.movement.findUnique({
        where: { name: movement.name },
      });

      if (!existingMovement) {
        await prisma.movement.create({
          data: movement,
        });
        console.log(`Created movement: ${movement.name}`);
      } else {
        console.log(`Movement ${movement.name} already exists`);
      }
    }

    console.log("Movement seeding completed successfully");
  } catch (error) {
    console.error("Error seeding movements:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMovements();
