-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "district" TEXT,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "ward" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BandMaterial" ALTER COLUMN "code" SET DEFAULT concat('BM', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "code" SET DEFAULT concat('BR', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "code" SET DEFAULT concat('MT', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Movement" ALTER COLUMN "code" SET DEFAULT concat('MV', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "UserGender";

-- AlterTable
ALTER TABLE "Watch" ALTER COLUMN "code" SET DEFAULT concat('W', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 9)));
