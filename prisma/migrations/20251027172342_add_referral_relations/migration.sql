-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_referredByCode_fkey" FOREIGN KEY ("referredByCode") REFERENCES "public"."User"("referralCode") ON DELETE SET NULL ON UPDATE CASCADE;
