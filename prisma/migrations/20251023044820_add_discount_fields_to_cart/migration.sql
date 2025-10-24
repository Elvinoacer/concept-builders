-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "discountCode" TEXT,
ADD COLUMN     "discountId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "public"."Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
