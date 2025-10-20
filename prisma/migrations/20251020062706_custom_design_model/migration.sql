-- CreateTable
CREATE TABLE "public"."CustomDesignRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "designType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomDesignRequest_pkey" PRIMARY KEY ("id")
);
