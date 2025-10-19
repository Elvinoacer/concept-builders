-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_designId_fkey";

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
