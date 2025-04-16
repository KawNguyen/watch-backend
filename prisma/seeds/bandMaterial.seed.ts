import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bandMaterials = [
  { name: "Stainless Steel" },
  { name: "Leather" },
  { name: "Rubber" },
  { name: "Silicone" },
  { name: "NATO Strap" },
  { name: "Canvas" },
  { name: "Titanium" },
  { name: "Gold" },
  { name: "Platinum" },
  { name: "Ceramic" },
  { name: "Nylon" },
  { name: "Mesh" },
  { name: "Alligator Leather" },
  { name: "Crocodile Leather" },
  { name: "Calfskin Leather" },
];

async function seedBandMaterials() {
  try {
    console.log("Starting band material seeding...");

    for (const material of bandMaterials) {
      const existingMaterial = await prisma.bandMaterial.findUnique({
        where: { name: material.name },
      });

      if (!existingMaterial) {
        await prisma.bandMaterial.create({
          data: material,
        });
        console.log(`Created band material: ${material.name}`);
      } else {
        console.log(`Band material ${material.name} already exists`);
      }
    }

    console.log("Band material seeding completed successfully");
  } catch (error) {
    console.error("Error seeding band materials:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBandMaterials();
