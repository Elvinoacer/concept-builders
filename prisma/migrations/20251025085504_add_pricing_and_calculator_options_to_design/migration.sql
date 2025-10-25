/*
  Warnings:

  - The `calculatorOptions` column on the `Design` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Design" ADD COLUMN     "cadPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "pdfAndCadPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "pdfPrice" DOUBLE PRECISION DEFAULT 0,
DROP COLUMN "calculatorOptions",
ADD COLUMN     "calculatorOptions" JSONB;
