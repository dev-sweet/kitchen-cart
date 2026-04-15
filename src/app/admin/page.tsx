"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  ShieldX,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  orderItems: { productName: string; quantity: number; price: number }[];
}

interface RevenueDay {
  date: string;
  revenue: number;
}

interface AdminStats {
  totalRevenue: number;
  ordersToday: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: RecentOrder[];
  revenueByDay: RevenueDay[];
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
}

function UnauthorizedMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <ShieldX className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Unauthorized</h2>
      <p className="text-gray-500 text-center max-w-md">
        You do not have permission to access the admin panel. Please contact an administrator.
      </p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 bg-[#E65100] text-white rounded-lg hover:bg-[#BF360C] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full mb-2" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = status !== "loading";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetch("/api/admin/stats")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch stats");
          return res.json();
        })
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load dashboard stats");
          setLoading(false);
        });
    }
  }, [session?.user?.role]);

  if (!mounted || status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UnauthorizedMessage />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? formatPrice(stats.totalRevenue) : "$0.00",
      icon: DollarSign,
      change: "+12.5%",
      changeLabel: "from last month",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Orders Today",
      value: stats ? stats.ordersToday.toString() : "0",
      icon: ShoppingCart,
      change: "+4.2%",
      changeLabel: "from yesterday",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats ? stats.totalProducts.toString() : "0",
      icon: Package,
      change: "+2.0%",
      changeLabel: "this month",
      color: "text-[#E65100]",
      bg: "bg-primary/10",
    },
    {
      title: "Total Customers",
      value: stats ? stats.totalCustomers.toString() : "0",
      icon: Users,
      change: "+8.1%",
      changeLabel: "this month",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Navigation Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-4">Manage your store from one place</p>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="dashboard" asChild>
              <Link href="/admin">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="products" asChild>
              <Link href="/admin/products">Products</Link>
            </TabsTrigger>
            <TabsTrigger value="orders" asChild>
              <Link href="/admin/orders">Orders</Link>
            </TabsTrigger>
            <TabsTrigger value="categories" asChild>
              <Link href="/admin/categories">Categories</Link>
            </TabsTrigger>
            <TabsTrigger value="customers" asChild>
              <Link href="/admin/customers">Customers</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && stats && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center text-xs mt-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">{stat.change}</span>
                    <span className="text-gray-400 ml-1">{stat.changeLabel}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Revenue Overview (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueByDay}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E65100" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E65100" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      tickFormatter={(value: string) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9CA3AF" }}
                      tickFormatter={(value: number) => `$${value}`}
                      axisLine={{ stroke: "#E5E7EB" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [formatPrice(value), "Revenue"]}
                      labelFormatter={(label: string) => {
                        const date = new Date(label);
                        return date.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#E65100"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Orders
              </CardTitle>
              <Link
                href="/admin/orders"
                className="text-sm text-[#E65100] hover:text-[#BF360C] flex items-center gap-1 font-medium"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 12)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {order.user?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.user?.email || ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {order.orderItems?.length || 0} items
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm">
                          {formatPrice(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusBadge(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
