/*
  Warnings:

  - You are about to drop the column `bandMaterial` on the `Watch` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Watch` table. All the data in the column will be lost.
  - You are about to drop the column `movement` on the `Watch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "code" SET DEFAULT concat('BR', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Watch" DROP COLUMN "bandMaterial",
DROP COLUMN "material",
DROP COLUMN "movement",
ADD COLUMN     "bandMaterialId" TEXT,
ADD COLUMN     "materialId" TEXT,
ADD COLUMN     "movementId" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('W', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 9)));

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT concat('MT', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8))),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BandMaterial" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT concat('BM', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8))),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BandMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT concat('MV', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8))),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_code_key" ON "Material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE INDEX "Material_name_idx" ON "Material"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BandMaterial_code_key" ON "BandMaterial"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BandMaterial_name_key" ON "BandMaterial"("name");

-- CreateIndex
CREATE INDEX "BandMaterial_name_idx" ON "BandMaterial"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_code_key" ON "Movement"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_name_key" ON "Movement"("name");

-- CreateIndex
CREATE INDEX "Movement_name_idx" ON "Movement"("name");

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_bandMaterialId_fkey" FOREIGN KEY ("bandMaterialId") REFERENCES "BandMaterial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
