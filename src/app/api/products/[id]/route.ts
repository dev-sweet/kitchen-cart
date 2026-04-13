import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, generateSlug } from "@/lib/helpers";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Try to find by slug first, then by id
    let product = await db.product.findUnique({
      where: { slug: id },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!product) {
      product = await db.product.findUnique({
        where: { id },
        include: {
          category: true,
          variants: true,
          reviews: {
            include: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products (same category, different product)
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        featured: true,
      },
      take: 8,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
      tags: JSON.parse(product.tags),
      relatedProducts: relatedProducts.map((p) => ({
        ...p,
        images: JSON.parse(p.images),
        tags: JSON.parse(p.tags),
      })),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      comparePrice,
      stock,
      sku,
      categoryId,
      images,
      tags,
      featured,
    } = body;

    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const slug = name ? generateSlug(name) : existingProduct.slug;

    // Check for slug uniqueness if name changed
    if (name && slug !== existingProduct.slug) {
      const slugExists = await db.product.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "A product with a similar name already exists" },
          { status: 409 }
        );
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name: name ?? existingProduct.name,
        slug,
        description: description ?? existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        comparePrice: comparePrice !== undefined
          ? comparePrice ? parseFloat(comparePrice) : null
          : existingProduct.comparePrice,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        sku: sku !== undefined ? sku || null : existingProduct.sku,
        categoryId: categoryId ?? existingProduct.categoryId,
        images: images !== undefined ? JSON.stringify(images) : existingProduct.images,
        tags: tags !== undefined ? JSON.stringify(tags) : existingProduct.tags,
        featured: featured !== undefined ? featured : existingProduct.featured,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
      tags: JSON.parse(product.tags),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
