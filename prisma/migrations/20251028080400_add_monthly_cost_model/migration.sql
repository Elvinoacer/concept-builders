-- CreateTable
CREATE TABLE "public"."MonthlyCost" (
    "id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "digitalOcean" DOUBLE PRECISION NOT NULL,
    "resendEmails" DOUBLE PRECISION NOT NULL,
    "hosting" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyCost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyCost_month_key" ON "public"."MonthlyCost"("month");
