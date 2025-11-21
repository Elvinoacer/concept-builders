-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "status" "public"."UploadStatus" NOT NULL DEFAULT 'COMPLETED';
