/*
  Warnings:

  - You are about to drop the `OngoingProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OngoingProjectImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ProjectCategory" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'RENOVATION', 'INFRASTRUCTURE', 'INTERIOR_FIT_OUT');

-- AlterEnum
ALTER TYPE "public"."ProjectStatus" ADD VALUE 'NEARING_COMPLETION';

-- DropForeignKey
ALTER TABLE "public"."OngoingProjectImage" DROP CONSTRAINT "OngoingProjectImage_projectId_fkey";

-- DropTable
DROP TABLE "public"."OngoingProject";

-- DropTable
DROP TABLE "public"."OngoingProjectImage";

-- CreateTable
CREATE TABLE "public"."ongoing_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT,
    "location" TEXT,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "category" "public"."ProjectCategory" NOT NULL,
    "startDate" TIMESTAMP(3),
    "estimatedCompletionDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "featuredImage" TEXT,
    "gallery" JSONB,
    "size" TEXT,
    "value" TEXT,
    "highlights" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ongoing_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ongoing_projects_slug_key" ON "public"."ongoing_projects"("slug");
