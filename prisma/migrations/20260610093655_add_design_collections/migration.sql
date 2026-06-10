/*
  Warnings:

  - You are about to drop the column `search_vector` on the `Design` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Design_search_vector_idx";

-- AlterTable
ALTER TABLE "Design" DROP COLUMN "search_vector";

-- CreateTable
CREATE TABLE "DesignCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "categoryId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignCollection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DesignCollection" ADD CONSTRAINT "DesignCollection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
