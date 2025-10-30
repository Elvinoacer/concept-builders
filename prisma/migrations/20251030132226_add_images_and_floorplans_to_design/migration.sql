-- AlterEnum
ALTER TYPE "public"."FileType" ADD VALUE 'FLOOR_PLAN';

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "designFloorPlanId" TEXT,
ADD COLUMN     "designImageId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designImageId_fkey" FOREIGN KEY ("designImageId") REFERENCES "public"."Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designFloorPlanId_fkey" FOREIGN KEY ("designFloorPlanId") REFERENCES "public"."Design"("id") ON DELETE SET NULL ON UPDATE CASCADE;
