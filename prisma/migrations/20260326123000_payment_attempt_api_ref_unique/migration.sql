-- Make PaymentAttempt.apiRef unique for idempotent webhook handling.
CREATE UNIQUE INDEX "PaymentAttempt_apiRef_key" ON "public"."PaymentAttempt"("apiRef");
