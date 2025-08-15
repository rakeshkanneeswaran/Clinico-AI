-- AlterTable
ALTER TABLE "public"."CustomDocument" ADD COLUMN     "custom" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "custom" BOOLEAN NOT NULL DEFAULT false;
