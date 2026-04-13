import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    let cartItems;
    if (user) {
      // Return cart items for the logged-in user
      cartItems = await db.cartItem.findMany({
        where: { userId: user.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              images: true,
              stock: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              value: true,
              priceModifier: true,
              stock: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // No user, return empty
      cartItems = [];
    }

    const cartItemsWithParsedImages = cartItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        images: JSON.parse(item.product.images),
      },
    }));

    return NextResponse.json(cartItemsWithParsedImages);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, variantId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    // Check if product exists and has stock
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if variant exists if variantId provided
    if (variantId) {
      const variant = await db.productVariant.findUnique({
        where: { id: variantId },
      });
      if (!variant) {
        return NextResponse.json(
          { error: "Variant not found" },
          { status: 404 }
        );
      }
    }

    // Check if item already in cart
    const existingItem = await db.cartItem.findFirst({
      where: {
        userId: user.id,
        productId,
        variantId: variantId || null,
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: true,
          variant: true,
        },
      });
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          userId: user.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: true,
          variant: true,
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
