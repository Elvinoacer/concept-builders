/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BuildingCostEstimate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DrawingSetOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rendering` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DesignToDrawingSetOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DesignToFileType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DesignToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `buildingCostEstimates` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drawingSetsOptions` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faqs` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileTypes` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planDetails` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `renderings` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Design` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BuildingCostEstimate" DROP CONSTRAINT "BuildingCostEstimate_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FAQ" DROP CONSTRAINT "FAQ_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PlanDetail" DROP CONSTRAINT "PlanDetail_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rendering" DROP CONSTRAINT "Rendering_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToDrawingSetOption" DROP CONSTRAINT "_DesignToDrawingSetOption_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToDrawingSetOption" DROP CONSTRAINT "_DesignToDrawingSetOption_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToFileType" DROP CONSTRAINT "_DesignToFileType_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToFileType" DROP CONSTRAINT "_DesignToFileType_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToTag" DROP CONSTRAINT "_DesignToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DesignToTag" DROP CONSTRAINT "_DesignToTag_B_fkey";

-- AlterTable
ALTER TABLE "public"."Design" ADD COLUMN     "area" INTEGER,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "buildingCostEstimates" JSONB NOT NULL,
ADD COLUMN     "drawingSetsOptions" JSONB NOT NULL,
ADD COLUMN     "faqs" JSONB NOT NULL,
ADD COLUMN     "fileTypes" JSONB NOT NULL,
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "images" JSONB NOT NULL,
ADD COLUMN     "planDetails" JSONB NOT NULL,
ADD COLUMN     "renderings" JSONB NOT NULL,
ADD COLUMN     "tags" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "author" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password",
ADD COLUMN     "hashedPassword" TEXT;

-- DropTable
DROP TABLE "public"."BuildingCostEstimate";

-- DropTable
DROP TABLE "public"."DrawingSetOption";

-- DropTable
DROP TABLE "public"."FAQ";

-- DropTable
DROP TABLE "public"."FileType";

-- DropTable
DROP TABLE "public"."Image";

-- DropTable
DROP TABLE "public"."PlanDetail";

-- DropTable
DROP TABLE "public"."Rendering";

-- DropTable
DROP TABLE "public"."Tag";

-- DropTable
DROP TABLE "public"."_DesignToDrawingSetOption";

-- DropTable
DROP TABLE "public"."_DesignToFileType";

-- DropTable
DROP TABLE "public"."_DesignToTag";
