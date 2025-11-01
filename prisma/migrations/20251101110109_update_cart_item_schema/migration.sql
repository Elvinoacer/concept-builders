/*
  Warnings:

  - You are about to drop the column `selectedDocuments` on the `CartItem` table. All the data in the column will be lost.
  - The `selectedPackage` column on the `CartItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cartId,designId,selectedFileTypes,selectedPackage,selectedExtras]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CartItem_cartId_designId_selectedDocuments_selectedPackage__key";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "selectedDocuments",
ADD COLUMN     "selectedFileTypes" TEXT[],
DROP COLUMN "selectedPackage",
ADD COLUMN     "selectedPackage" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_designId_selectedFileTypes_selectedPackage__key" ON "public"."CartItem"("cartId", "designId", "selectedFileTypes", "selectedPackage", "selectedExtras");
