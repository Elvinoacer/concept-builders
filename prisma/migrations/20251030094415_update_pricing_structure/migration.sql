/*
  Warnings:

  - You are about to drop the column `cadPrice` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `pdfAndCadPrice` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `pdfPrice` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "cadPrice",
DROP COLUMN "pdfAndCadPrice",
DROP COLUMN "pdfPrice",
ADD COLUMN     "architecturalCadPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "architecturalPdfPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "billOfQuantitiesPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "structuralCadPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "structuralPdfPrice" DOUBLE PRECISION DEFAULT 0;
