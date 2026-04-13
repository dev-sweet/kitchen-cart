import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, requireAdmin } from "@/lib/helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const now = new Date();

    // Check expiration
    if (coupon.expiresAt && coupon.expiresAt < now) {
      return NextResponse.json(
        { error: "This coupon has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    const orderSubtotal = subtotal || 0;
    if (orderSubtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order amount of $${coupon.minOrder} required for this coupon` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    } else if (coupon.type === "percentage") {
      discountAmount = orderSubtotal * (coupon.value / 100);
    }

    return NextResponse.json({
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.round(discountAmount * 100) / 100,
      message:
        coupon.type === "fixed"
          ? `$${discountAmount.toFixed(2)} discount applied`
          : `${coupon.value}% discount applied`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
