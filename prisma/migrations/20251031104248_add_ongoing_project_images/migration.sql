-- CreateTable
CREATE TABLE "public"."OngoingProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "clientName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OngoingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OngoingProjectImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OngoingProjectImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OngoingProjectImage" ADD CONSTRAINT "OngoingProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."OngoingProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
