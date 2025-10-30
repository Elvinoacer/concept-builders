/*
  Warnings:

  - The values [FLOOR_PLAN] on the enum `FileType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fileIdentifier` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `isLatest` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `originalFileName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `File` table. All the data in the column will be lost.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('ARCHITECTURAL', 'STRUCTURAL', 'BILL_OF_QUANTITIES');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."FileType_new" AS ENUM ('PDF', 'CAD', 'EXCEL', 'IMAGE', 'OTHER');
ALTER TABLE "public"."File" ALTER COLUMN "type" TYPE "public"."FileType_new" USING ("type"::text::"public"."FileType_new");
ALTER TYPE "public"."FileType" RENAME TO "FileType_old";
ALTER TYPE "public"."FileType_new" RENAME TO "FileType";
DROP TYPE "public"."FileType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_designId_fkey";

-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "fileIdentifier",
DROP COLUMN "isLatest",
DROP COLUMN "originalFileName",
DROP COLUMN "updatedAt",
DROP COLUMN "version",
ADD COLUMN     "cadDocumentId" TEXT,
ADD COLUMN     "excelDocumentId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pdfDocumentId" TEXT,
ADD COLUMN     "size" INTEGER,
ALTER COLUMN "designId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."DesignDocuments" (
    "id" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "description" TEXT,
    "overview" TEXT,
    "features" TEXT[],
    "specifications" JSONB,
    "architecturalDesignId" TEXT,
    "structuralDesignId" TEXT,
    "billOfQuantitiesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DesignDocuments_architecturalDesignId_key" ON "public"."DesignDocuments"("architecturalDesignId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignDocuments_structuralDesignId_key" ON "public"."DesignDocuments"("structuralDesignId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignDocuments_billOfQuantitiesId_key" ON "public"."DesignDocuments"("billOfQuantitiesId");

-- AddForeignKey
ALTER TABLE "public"."DesignDocuments" ADD CONSTRAINT "DesignDocuments_architecturalDesignId_fkey" FOREIGN KEY ("architecturalDesignId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignDocuments" ADD CONSTRAINT "DesignDocuments_structuralDesignId_fkey" FOREIGN KEY ("structuralDesignId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignDocuments" ADD CONSTRAINT "DesignDocuments_billOfQuantitiesId_fkey" FOREIGN KEY ("billOfQuantitiesId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_pdfDocumentId_fkey" FOREIGN KEY ("pdfDocumentId") REFERENCES "public"."DesignDocuments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_cadDocumentId_fkey" FOREIGN KEY ("cadDocumentId") REFERENCES "public"."DesignDocuments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_excelDocumentId_fkey" FOREIGN KEY ("excelDocumentId") REFERENCES "public"."DesignDocuments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;
