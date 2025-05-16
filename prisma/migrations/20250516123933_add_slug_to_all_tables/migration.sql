/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `BandMaterial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Movement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Watch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BandMaterial" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('BM', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('BR', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('MT', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('MV', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Watch" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "code" SET DEFAULT concat('W', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 9)));

-- CreateIndex
CREATE UNIQUE INDEX "BandMaterial_slug_key" ON "BandMaterial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Material_slug_key" ON "Material"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Movement_slug_key" ON "Movement"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_slug_key" ON "Watch"("slug");
