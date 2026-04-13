import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const searchTerm = query.trim();

    const where = {
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { tags: { contains: searchTerm } },
        { category: { name: { contains: searchTerm } } },
      ],
    };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      db.product.count({ where }),
    ]);

    const productsWithParsedData = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images),
      tags: JSON.parse(product.tags),
    }));

    return NextResponse.json({
      data: productsWithParsedData,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      query: searchTerm,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
