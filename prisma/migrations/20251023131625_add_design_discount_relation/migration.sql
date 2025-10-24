-- CreateTable
CREATE TABLE "public"."DesignDiscount" (
    "designId" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,

    CONSTRAINT "DesignDiscount_pkey" PRIMARY KEY ("designId","discountId")
);

-- AddForeignKey
ALTER TABLE "public"."DesignDiscount" ADD CONSTRAINT "DesignDiscount_designId_fkey" FOREIGN KEY ("designId") REFERENCES "public"."Design"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignDiscount" ADD CONSTRAINT "DesignDiscount_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "public"."Discount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
