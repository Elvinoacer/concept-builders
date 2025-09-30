/*
  Warnings:

  - You are about to drop the column `images` on the `Design` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Design` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceRange` to the `Design` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CLIENT', 'TEAM', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'REFUND_REQUESTED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "images",
DROP COLUMN "price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "floorPlanUrl" TEXT,
ADD COLUMN     "priceRange" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rendering" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "Rendering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanDetail" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "PlanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BuildingCostEstimate" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "designId" TEXT NOT NULL,

    CONSTRAINT "BuildingCostEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FileType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DrawingSetOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DrawingSetOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_RelatedDesigns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedDesigns_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DesignToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DesignToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DesignToFileType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DesignToFileType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DesignToDrawingSetOption" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DesignToDrawingSetOption_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DesignToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DesignToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FileType_name_key" ON "public"."FileType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DrawingSetOption_name_key" ON "public"."DrawingSetOption"("name");

-- CreateIndex
CREATE INDEX "_RelatedDesigns_B_index" ON "public"."_RelatedDesigns"("B");

-- CreateIndex
CREATE INDEX "_DesignToTag_B_index" ON "public"."_DesignToTag"("B");

-- CreateIndex
CREATE INDEX "_DesignToFileType_B_index" ON "public"."_DesignToFileType"("B");

-- CreateIndex
CREATE INDEX "_DesignToDrawingSetOption_B_index" ON "public"."_DesignToDrawingSetOption"("B");

-- CreateIndex
CREATE INDEX "_DesignToUser_B_index" ON "public"."_DesignToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rendering" ADD CONSTRAINT "Rendering_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanDetail" ADD CONSTRAINT "PlanDetail_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BuildingCostEstimate" ADD CONSTRAINT "BuildingCostEstimate_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RelatedDesigns" ADD CONSTRAINT "_RelatedDesigns_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RelatedDesigns" ADD CONSTRAINT "_RelatedDesigns_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToTag" ADD CONSTRAINT "_DesignToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToTag" ADD CONSTRAINT "_DesignToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToFileType" ADD CONSTRAINT "_DesignToFileType_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToFileType" ADD CONSTRAINT "_DesignToFileType_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."FileType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToDrawingSetOption" ADD CONSTRAINT "_DesignToDrawingSetOption_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToDrawingSetOption" ADD CONSTRAINT "_DesignToDrawingSetOption_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."DrawingSetOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToUser" ADD CONSTRAINT "_DesignToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DesignToUser" ADD CONSTRAINT "_DesignToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
