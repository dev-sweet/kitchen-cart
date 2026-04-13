import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, generateOrderId } from "@/lib/helpers";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress, notes, couponCode } = body;

    // Get user's cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate stock for each item
    for (const item of cartItems) {
      const availableStock = item.variant
        ? item.variant.stock
        : item.product.stock;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.product.name}. Available: ${availableStock}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const basePrice = item.product.price;
      const modifier = item.variant?.priceModifier || 0;
      return sum + (basePrice + modifier) * item.quantity;
    }, 0);

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
          // Increment coupon usage
          await db.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const total = subtotal + shipping + tax - discount;

    // Generate order ID
    const orderId = generateOrderId();

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
          paymentMethod: "cod",
          shippingAddress: shippingAddress || null,
          notes: notes || null,
        },
      });

      await tx.orderItem.createMany({
        data: cartItems.map((item) => {
          const productImages = JSON.parse(item.product.images) as string[];
          return {
            orderId: newOrder.id,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price: item.product.price + (item.variant?.priceModifier || 0),
            productName: item.product.name,
            productImage: productImages.length > 0 ? productImages[0] : null,
          };
        }),
      });

      // Clear the user's cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

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
