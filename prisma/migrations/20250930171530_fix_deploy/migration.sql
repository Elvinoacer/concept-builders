/*
  Warnings:

  - You are about to drop the column `buildingCostEstimates` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `drawingSetsOptions` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `faqs` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `fileTypes` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `floorPlanUrl` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `renderings` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `salesCount` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Design` table. All the data in the column will be lost.
  - The `planDetails` column on the `Design` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_RelatedDesigns` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('CAD', 'PDF', 'IMAGE', 'FLOOR_PLAN');

-- DropForeignKey
ALTER TABLE "public"."Design" DROP CONSTRAINT "Design_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RelatedDesigns" DROP CONSTRAINT "_RelatedDesigns_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_RelatedDesigns" DROP CONSTRAINT "_RelatedDesigns_B_fkey";

-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "buildingCostEstimates",
DROP COLUMN "drawingSetsOptions",
DROP COLUMN "faqs",
DROP COLUMN "fileTypes",
DROP COLUMN "files",
DROP COLUMN "floorPlanUrl",
DROP COLUMN "images",
DROP COLUMN "renderings",
DROP COLUMN "salesCount",
DROP COLUMN "tags",
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "area" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "planDetails",
ADD COLUMN     "planDetails" TEXT[];

-- DropTable
DROP TABLE "public"."_RelatedDesigns";

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."FileType" NOT NULL,
    "designId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Design" ADD CONSTRAINT "Design_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
