-- CreateEnum
CREATE TYPE "public"."CustomDesignRequestStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."CustomDesignRequest" ADD COLUMN     "status" "public"."CustomDesignRequestStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
