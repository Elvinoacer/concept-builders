-- CreateTable
CREATE TABLE "public"."DeliveredFile" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveredFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveredFile_orderItemId_fileId_key" ON "public"."DeliveredFile"("orderItemId", "fileId");

-- AddForeignKey
ALTER TABLE "public"."DeliveredFile" ADD CONSTRAINT "DeliveredFile_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliveredFile" ADD CONSTRAINT "DeliveredFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
