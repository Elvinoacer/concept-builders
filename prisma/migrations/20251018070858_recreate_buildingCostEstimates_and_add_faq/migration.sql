-- AlterTable
ALTER TABLE "Design" DROP COLUMN "buildingCostEstimates";
ALTER TABLE "Design" ADD COLUMN "buildingCostEstimates" JSONB[];
ALTER TABLE "Design" ADD COLUMN "faq" JSONB[];