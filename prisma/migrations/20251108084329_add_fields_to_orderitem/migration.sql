-- AlterTable
ALTER TABLE "public"."OrderItem" ADD COLUMN     "selectedExtras" JSONB,
ADD COLUMN     "selectedFileTypes" TEXT[];
