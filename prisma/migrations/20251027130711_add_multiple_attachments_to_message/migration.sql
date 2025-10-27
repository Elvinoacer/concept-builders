/*
  Warnings:

  - You are about to drop the column `attachmentType` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `attachmentUrl` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "attachmentType",
DROP COLUMN "attachmentUrl";

-- CreateTable
CREATE TABLE "public"."Attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
