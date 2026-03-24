// app/api/intasend/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { DiscountType } from "@/generated/prisma/client";

class APIException extends Error {
  public statusCode: number;
  public metadata: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    metadata: Record<string, unknown> = {},
  ) {
    super(message);
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.name = "APIException";
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function getObject(error: unknown): Record<string, unknown> {
  if (typeof error === "object" && error !== null) {
    return error as Record<string, unknown>;
  }

  return {};
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();

    const { first_name, last_name, email, phone_number, discountCode } = body;

    // Validate required fields
    if (!first_name || !email || !phone_number) {
      throw new APIException("Missing required fields", 400, {
        missingFields: {
          first_name: !first_name,
          email: !email,
          phone_number: !phone_number,
        },
      });
    }

    // Find user cart
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            design: {
              include: {
                packageOptions: true,
              },
            },
          },
        },
      },
    });

    if (!userCart) {
      throw new APIException("Cart not found", 404);
    }

    if (!userCart.items || userCart.items.length === 0) {
      throw new APIException("Cart is empty", 400);
    }

    // Calculate total amount from cart items
    let calculatedTotal = userCart.items.reduce((total, item) => {
      // Cast item to satisfy the type expected by calculateItemTotal if necessary,
      // though the include structure should match.
      // We need to ensure selectedExtras is treated correctly (Json vs any[])
      const selectedExtras = Array.isArray(item.selectedExtras)
        ? (item.selectedExtras as Array<{ price?: number }>).map((extra) => ({
            price: typeof extra?.price === "number" ? extra.price : 0,
          }))
        : [];

      const itemForCalculation = {
        ...item,
        selectedExtras,
      };
      return total + calculateItemTotal(itemForCalculation);
    }, 0);

    let appliedDiscountAmount = 0;

    // Handle Discount
    if (discountCode) {
      const discount = await prisma.discount.findUnique({
        where: { code: discountCode },
      });

      if (discount) {
        // Validate Discount
        let isValid = true;
        let errorMessage = "";

        if (!discount.isActive) {
          isValid = false;
          errorMessage = "Discount is not active";
        } else if (
          discount.expiresAt &&
          new Date(discount.expiresAt) < new Date()
        ) {
          isValid = false;
          errorMessage = "Discount has expired";
        } else if (discount.maxUses && discount.uses >= discount.maxUses) {
          isValid = false;
          errorMessage = "Discount has reached its maximum uses";
        } else if (
          discount.minPurchaseAmount &&
          calculatedTotal < discount.minPurchaseAmount
        ) {
          isValid = false;
          errorMessage = `Minimum purchase of ${discount.minPurchaseAmount.toFixed(2)} required`;
        }

        if (isValid) {
          // Check if user already used it
          const existingOrderWithDiscount = await prisma.order.findFirst({
            where: {
              userId: userId,
              discountId: discount.id,
              status: {
                in: ["PAID", "REFUND_REQUESTED"],
              },
            },
          });

          if (existingOrderWithDiscount) {
            isValid = false;
            errorMessage = "You have already used this discount code";
          }
        }

        if (isValid) {
          if (discount.type === DiscountType.PERCENTAGE) {
            appliedDiscountAmount = calculatedTotal * (discount.value / 100);
          } else if (discount.type === DiscountType.FIXED_AMOUNT) {
            appliedDiscountAmount = discount.value;
          }

          // Cap discount at total
          appliedDiscountAmount = Math.min(
            appliedDiscountAmount,
            calculatedTotal,
          );

          calculatedTotal -= appliedDiscountAmount;

          // Update cart with valid discount
          await prisma.cart.update({
            where: { id: userCart.id },
            data: {
              discountAmount: appliedDiscountAmount,
              discountCode: discountCode,
              discountId: discount.id,
            },
          });
        } else {
          console.warn(
            `Invalid discount code provided: ${discountCode} - ${errorMessage}`,
          );
          throw new APIException(errorMessage, 400);
        }
      } else {
        throw new APIException("Invalid discount code", 404);
      }
    }

    // Ensure amount is positive
    if (calculatedTotal <= 0) {
      throw new APIException(
        "Amount must be greater than 0 for M-Pesa payment",
        400,
      );
    }

    // CRITICAL: Validate IntaSend configuration
    if (!process.env.INTASEND_PUBLISHABLE_KEY) {
      throw new APIException("INTASEND_PUBLISHABLE_KEY not configured", 500);
    }
    if (!process.env.INTASEND_SECRET_KEY) {
      throw new APIException("INTASEND_SECRET_KEY not configured", 500);
    }

    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!host) {
      throw new APIException("App URL not configured", 500);
    }

    // Fetch USD to KES exchange rate
    let usdToKesRate: number;
    try {
      const exchangeRateRes = await fetch(
        `${req.nextUrl.origin}/api/exchange-rate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        },
      );

      if (!exchangeRateRes.ok) {
        console.error("Exchange rate API failed, using fallback");
        usdToKesRate = 130;
      } else {
        const exchangeRateData = await exchangeRateRes.json();
        usdToKesRate = exchangeRateData.usdToKesRate;
      }
    } catch {
      console.error("Exchange rate fetch error, using fallback");
      usdToKesRate = 130;
    }

    if (!usdToKesRate || usdToKesRate <= 0) {
      usdToKesRate = 130;
    }

    // Convert amount to KES
    const amountKES = calculatedTotal * usdToKesRate;

    const isTestMode = process.env.INTASEND_TEST_MODE === "true";

    console.log("🔧 Initializing IntaSend:", {
      mode: isTestMode ? "TEST" : "LIVE",
      publishableKeyStart:
        process.env.INTASEND_PUBLISHABLE_KEY?.substring(0, 15) + "...",
      secretKeyStart: process.env.INTASEND_SECRET_KEY?.substring(0, 20) + "...",
      calculatedTotalUSD: calculatedTotal,
      amountKES: amountKES,
      discountApplied: appliedDiscountAmount,
    });

    // Initialize IntaSend SDK
    // Third parameter controls IntaSend environment.
    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY!,
      process.env.INTASEND_SECRET_KEY!,
      isTestMode,
    );
    // Format phone number
    let formattedPhone = phone_number.trim().replace(/\D/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = `254${formattedPhone.substring(1)}`;
    }

    // Validate phone number
    if (
      formattedPhone.length !== 12 ||
      (!formattedPhone.startsWith("2547") && !formattedPhone.startsWith("2541"))
    ) {
      throw new APIException(
        "Phone number must be 12 digits starting with 2547 or 2541",
        400,
      );
    }

    // Prepare STK payload - Following IntaSend NodeJS SDK documentation
    const apiRef = `cart_${userCart.id}_${Date.now()}`;

    const stkPayload = {
      first_name: first_name.trim(),
      last_name: (last_name || "").trim(),
      email: email.trim(),
      amount: amountKES,
      phone_number: formattedPhone,
      api_ref: apiRef,
      host: host,
      // Note: IntaSend Node SDK doesn't require 'currency' or 'callback_url' parameters
      // The currency is automatically set to KES for M-Pesa
      // Webhooks are configured in your IntaSend account dashboard
    };

    // Execute STK Push
    try {
      const collection = intasend.collection();
      const resp = await collection.mpesaStkPush(stkPayload);

      console.log("✅ IntaSend STK Push Success Response:", resp);

      return NextResponse.json({
        success: true,
        data: resp,
        metadata: {
          amountKES: amountKES.toFixed(2),
          apiRef: apiRef,
          exchangeRate: usdToKesRate,
          calculatedTotalUSD: calculatedTotal,
          discountApplied: appliedDiscountAmount,
        },
      });
    } catch (intaSendError: unknown) {
      const errorObj = getObject(intaSendError);
      const responseObj = getObject(errorObj.response);
      console.error("❌ IntaSend API Call Failed:");
      console.error("Error object:", JSON.stringify(intaSendError, null, 2));

      // Enhanced error logging
      if (Object.keys(responseObj).length > 0) {
        console.error("Response status:", responseObj.status);
        console.error("Response headers:", responseObj.headers);

        try {
          // Try to get the actual error response from IntaSend
          let errorData;
          if (typeof responseObj.data === "string") {
            errorData = responseObj.data;
          } else if (
            responseObj.data &&
            typeof (responseObj.data as { text?: unknown }).text === "function"
          ) {
            errorData = await (
              responseObj.data as { text: () => Promise<string> }
            ).text();
          } else {
            errorData = responseObj.data;
          }
          console.error(
            "IntaSend Error Response:",
            JSON.stringify(errorData, null, 2),
          );
        } catch (parseError) {
          console.error("Could not parse IntaSend error response", parseError);
        }
      }

      console.error("Error details:", {
        message: getErrorMessage(intaSendError),
        code: errorObj.code,
        stack: errorObj.stack,
      });

      // Specific error handling
      if (responseObj.status === 401) {
        throw new APIException(
          "IntaSend authentication failed. Your credentials were rejected. Please verify: 1) API keys are correct in .env, 2) Your IntaSend account is approved for LIVE payments, 3) You have sufficient permissions. Check server logs for detailed error response.",
          401,
          {
            gateway: "intasend",
            code: "AUTHENTICATION_FAILED",
            environment: "LIVE",
            keysProvided: {
              publishableKey: !!process.env.INTASEND_PUBLISHABLE_KEY,
              secretKey: !!process.env.INTASEND_SECRET_KEY,
            },
          },
        );
      }

      throw new APIException(
        "Payment gateway error: " + getErrorMessage(intaSendError),
        500,
        { gateway: "intasend" },
      );
    }
  } catch (error: unknown) {
    console.error("STK Push Error:", getErrorMessage(error));

    if (error instanceof APIException) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.metadata,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to initiate M-Pesa STK Push",
        details:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
