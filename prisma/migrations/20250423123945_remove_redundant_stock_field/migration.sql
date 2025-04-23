/*
  Warnings:

  - You are about to drop the column `stock` on the `Watch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BandMaterial" ALTER COLUMN "code" SET DEFAULT concat('BM', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "code" SET DEFAULT concat('BR', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "code" SET DEFAULT concat('MT', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Movement" ALTER COLUMN "code" SET DEFAULT concat('MV', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Watch" DROP COLUMN "stock",
ALTER COLUMN "code" SET DEFAULT concat('W', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 9)));
