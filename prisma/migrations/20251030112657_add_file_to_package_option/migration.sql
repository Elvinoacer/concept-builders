/*
  Warnings:

  - You are about to drop the column `packageOptions` on the `Design` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Design" DROP COLUMN "packageOptions";

-- CreateTable
CREATE TABLE "public"."PackageOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "fileId" TEXT,
    "designId" TEXT NOT NULL,

    CONSTRAINT "PackageOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PackageOption_fileId_key" ON "public"."PackageOption"("fileId");

-- AddForeignKey
ALTER TABLE "public"."PackageOption" ADD CONSTRAINT "PackageOption_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageOption" ADD CONSTRAINT "PackageOption_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
