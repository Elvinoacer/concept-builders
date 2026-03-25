import { DiscountType } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

type ValidDiscountResult = {
  valid: true;
  discount: {
    id: string;
    code: string;
    type: DiscountType;
    value: number;
  };
  appliedAmount: number;
  finalTotal: number;
};

type InvalidDiscountResult = {
  valid: false;
  error: string;
};

export type DiscountResult = ValidDiscountResult | InvalidDiscountResult;

export async function validateAndApplyDiscount(
  discountCode: string,
  calculatedTotal: number,
  userId: string,
): Promise<DiscountResult> {
  const discount = await prisma.discount.findUnique({
    where: { code: discountCode },
  });

  if (!discount) {
    return { valid: false, error: "Invalid discount code" };
  }

  if (!discount.isActive) {
    return { valid: false, error: "Discount is not active" };
  }

  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, error: "Discount has expired" };
  }

  if (discount.maxUses && discount.uses >= discount.maxUses) {
    return {
      valid: false,
      error: "Discount has reached its maximum uses",
    };
  }

  if (discount.minPurchaseAmount && calculatedTotal < discount.minPurchaseAmount) {
    return {
      valid: false,
      error: `Minimum purchase of $${discount.minPurchaseAmount.toFixed(2)} required`,
    };
  }

  const alreadyUsed = await prisma.order.findFirst({
    where: {
      userId,
      discountId: discount.id,
      status: { in: ["PAID", "REFUND_REQUESTED"] },
    },
  });

  if (alreadyUsed) {
    return { valid: false, error: "You have already used this discount code" };
  }

  let appliedAmount =
    discount.type === DiscountType.PERCENTAGE
      ? calculatedTotal * (discount.value / 100)
      : discount.value;

  appliedAmount = Math.min(appliedAmount, calculatedTotal);

  return {
    valid: true,
    discount: {
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value,
    },
    appliedAmount,
    finalTotal: calculatedTotal - appliedAmount,
  };
}
