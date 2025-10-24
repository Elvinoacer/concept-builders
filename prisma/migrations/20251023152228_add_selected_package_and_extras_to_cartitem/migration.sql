-- AlterTable
ALTER TABLE "public"."CartItem" ADD COLUMN     "selectedExtras" JSONB,
ADD COLUMN     "selectedPackage" TEXT;
