import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Run all queries in parallel
    const [
      totalRevenue,
      ordersToday,
      totalProducts,
      totalCustomers,
      recentOrders,
      allOrders,
    ] = await Promise.all([
      // Total revenue (from completed orders)
      db.order.aggregate({
        where: {
          status: { notIn: ["cancelled"] },
        },
        _sum: { total: true },
      }),
      // Orders today
      db.order.count({
        where: {
          createdAt: { gte: startOfDay },
        },
      }),
      // Total products
      db.product.count(),
      // Total customers
      db.user.count({
        where: { role: "customer" },
      }),
      // Recent orders (last 10)
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          orderItems: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true,
            },
          },
        },
      }),
      // All orders for revenue by day (last 30 days)
      db.order.findMany({
        where: {
          createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
          status: { notIn: ["cancelled"] },
        },
        select: {
          total: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate revenue by day for the last 30 days
    const revenueByDay: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayRevenue = allOrders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate < dayEnd;
        })
        .reduce((sum, order) => sum + order.total, 0);

      revenueByDay.push({
        date: dateStr,
        revenue: Math.round(dayRevenue * 100) / 100,
      });
    }

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      ordersToday,
      totalProducts,
      totalCustomers,
      recentOrders,
      revenueByDay,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
