-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DesignDiscount" DROP CONSTRAINT "DesignDiscount_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_designFloorPlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_designImageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PackageOption" DROP CONSTRAINT "PackageOption_designId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_designId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designImageId_fkey" FOREIGN KEY ("designImageId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_designFloorPlanId_fkey" FOREIGN KEY ("designFloorPlanId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignDiscount" ADD CONSTRAINT "DesignDiscount_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageOption" ADD CONSTRAINT "PackageOption_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
