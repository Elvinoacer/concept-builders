/*
  Warnings:

  - You are about to drop the column `text` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `title` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Banner" DROP COLUMN "text",
ADD COLUMN     "title" TEXT NOT NULL;
