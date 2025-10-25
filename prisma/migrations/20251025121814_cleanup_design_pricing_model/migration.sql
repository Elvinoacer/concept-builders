/*
  Warnings:

  - You are about to drop the column `areaPrice` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `bathroomsPrice` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `bedroomsPrice` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `calculatorOptions` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `dynamicUnitPricingOptions` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `storiesPrice` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "areaPrice",
DROP COLUMN "bathroomsPrice",
DROP COLUMN "bedroomsPrice",
DROP COLUMN "calculatorOptions",
DROP COLUMN "dynamicUnitPricingOptions",
DROP COLUMN "storiesPrice",
ADD COLUMN     "buildingCostFactors" JSONB,
ADD COLUMN     "packageOptions" JSONB;
