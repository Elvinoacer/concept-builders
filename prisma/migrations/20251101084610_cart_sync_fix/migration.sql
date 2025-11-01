/*
  Warnings:

  - You are about to drop the column `selectedFileType` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,designId,selectedDocuments,selectedPackage,selectedExtras]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CartItem_cartId_designId_selectedFileType_selectedPackage_s_key";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "selectedFileType",
ADD COLUMN     "selectedDocuments" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_designId_selectedDocuments_selectedPackage__key" ON "public"."CartItem"("cartId", "designId", "selectedDocuments", "selectedPackage", "selectedExtras");
