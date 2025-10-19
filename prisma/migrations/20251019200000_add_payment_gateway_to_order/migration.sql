-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentGateway" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");
