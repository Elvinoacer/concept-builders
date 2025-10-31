-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "fileIdentifier" TEXT,
ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
