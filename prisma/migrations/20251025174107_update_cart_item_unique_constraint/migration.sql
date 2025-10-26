/*
  Warnings:

  - A unique constraint covering the columns `[cartId,designId,selectedPackage,selectedExtras]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CartItem_cartId_designId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_designId_selectedPackage_selectedExtras_key" ON "public"."CartItem"("cartId", "designId", "selectedPackage", "selectedExtras");
