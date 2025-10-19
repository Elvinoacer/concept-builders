/*
  Warnings:

  - The `calculatorOptions` column on the `Design` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "calculatorOptions",
ADD COLUMN     "calculatorOptions" JSONB[];
