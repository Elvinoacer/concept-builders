-- Performance indexes for design filtering, sorting, and combined list queries
CREATE INDEX IF NOT EXISTS "Design_categoryId_idx" ON "public"."Design"("categoryId");
CREATE INDEX IF NOT EXISTS "Design_isFeatured_idx" ON "public"."Design"("isFeatured");
CREATE INDEX IF NOT EXISTS "Design_createdAt_idx" ON "public"."Design"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Design_views_idx" ON "public"."Design"("views" DESC);
CREATE INDEX IF NOT EXISTS "Design_basePrice_idx" ON "public"."Design"("basePrice");
CREATE INDEX IF NOT EXISTS "Design_bedrooms_idx" ON "public"."Design"("bedrooms");
CREATE INDEX IF NOT EXISTS "Design_categoryId_isFeatured_createdAt_idx" ON "public"."Design"("categoryId", "isFeatured", "createdAt" DESC);
