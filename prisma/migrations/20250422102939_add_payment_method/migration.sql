-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'MOMO');

-- AlterTable
ALTER TABLE "BandMaterial" ALTER COLUMN "code" SET DEFAULT concat('BM', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "code" SET DEFAULT concat('BR', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "code" SET DEFAULT concat('MT', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "Movement" ALTER COLUMN "code" SET DEFAULT concat('MV', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 8)));

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';

-- AlterTable
ALTER TABLE "Watch" ALTER COLUMN "code" SET DEFAULT concat('W', upper(substring(replace(cast(gen_random_uuid() as varchar), '-', ''), 1, 9)));
