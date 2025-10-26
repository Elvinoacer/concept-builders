/*
  Warnings:

  - A unique constraint covering the columns `[cartId,designId,selectedFileType,selectedPackage,selectedExtras]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CartItem_cartId_designId_selectedPackage_selectedExtras_key";

-- AlterTable
ALTER TABLE "public"."CartItem" ADD COLUMN     "selectedFileType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_designId_selectedFileType_selectedPackage_s_key" ON "public"."CartItem"("cartId", "designId", "selectedFileType", "selectedPackage", "selectedExtras");
