CREATE TYPE "public"."OrderDeliveryStatus" AS ENUM ('PENDING', 'PARTIAL', 'DELIVERED', 'MANUAL_REVIEW');
CREATE TYPE "public"."OrderItemStatus" AS ENUM ('PENDING', 'READY', 'DELIVERED', 'MANUAL_DELIVERY_REQUIRED');

ALTER TABLE "public"."Order"
ADD COLUMN "deliveryStatus" "public"."OrderDeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "missingFiles" TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "public"."OrderItem"
ADD COLUMN "deliveryStatus" "public"."OrderItemStatus" NOT NULL DEFAULT 'PENDING';
