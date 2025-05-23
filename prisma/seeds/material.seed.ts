import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const materials = [
  { name: "Stainless Steel" },
  { name: "Titanium" },
  { name: "Gold" },
  { name: "Pink Gold" },
  { name: "White Gold" },
  { name: "Platinum" },
  { name: "Ceramic" },
  { name: "Carbon Fiber" },
  { name: "Oystersteel" },
  { name: "Carbon Fiber" },
  { name: "Sapphire" },
];

async function seedMaterials() {
  try {
    console.log("Starting material seeding...");

    for (const material of materials) {
      const existingMaterial = await prisma.material.findUnique({
        where: { name: material.name },
      });

      if (!existingMaterial) {
        await prisma.material.create({
          data: material,
        });
        console.log(`Created material: ${material.name}`);
      } else {
        console.log(`Material ${material.name} already exists`);
      }
    }

    console.log("Material seeding completed successfully");
  } catch (error) {
    console.error("Error seeding materials:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMaterials();
