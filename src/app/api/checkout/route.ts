import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, generateOrderId } from "@/lib/helpers";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, cardLast4, notes, couponCode } = body as {
      items: CheckoutItem[];
      shippingAddress: Record<string, string>;
      paymentMethod: string;
      cardLast4?: string;
      notes?: string;
      couponCode?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock for each item by looking up the product from DB
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name}" not found` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate shipping (free over $50)
    const shipping = subtotal >= 50 ? 0 : 9.99;

    // Calculate tax (8%)
    const tax = subtotal * 0.08;

    // Apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon) {
        const now = new Date();
        if (
          (!coupon.expiresAt || coupon.expiresAt > now) &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
          subtotal >= coupon.minOrder
        ) {
          if (coupon.type === "fixed") {
            discount = coupon.value;
          } else if (coupon.type === "percentage") {
            discount = subtotal * (coupon.value / 100);
          }
          await db.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const total = subtotal + shipping + tax - discount;
    const orderId = generateOrderId();

    // Determine final payment method string
    const finalPaymentMethod = paymentMethod === "card" ? "card" : "cod";
    const orderNotes = [
      notes || "",
      paymentMethod === "card" && cardLast4 ? `Card ending in ****${cardLast4}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    // Create order with order items in a transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: "pending",
          subtotal,
          shipping,
          tax,
          discount,
          total,
          paymentMethod: finalPaymentMethod,
          shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
          notes: orderNotes || null,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
          productImage: item.image || null,
        })),
      });

      // Deduct stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      {
        ...order,
        orderId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
