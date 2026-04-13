"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShieldX,
  Loader2,
  Eye,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderUser {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
  user: OrderUser;
  orderItems: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="w-3 h-3" />;
    case "processing":
      return <ShoppingCart className="w-3 h-3" />;
    case "shipped":
      return <Truck className="w-3 h-3" />;
    case "delivered":
      return <CheckCircle className="w-3 h-3" />;
    case "cancelled":
      return <XCircle className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
}

function getPaymentIcon(method: string) {
  switch (method) {
    case "cod":
      return <Banknote className="w-3.5 h-3.5 text-green-600" />;
    case "card":
      return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
    default:
      return <CreditCard className="w-3.5 h-3.5 text-gray-500" />;
  }
}

function getPaymentLabel(method: string) {
  switch (method) {
    case "cod":
      return "Cash on Delivery";
    case "card":
      return "Credit Card";
    default:
      return method;
  }
}

function UnauthorizedMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <ShieldX className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Unauthorized</h2>
      <p className="text-gray-500 text-center max-w-md">
        You do not have permission to access this page.
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

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-64" />
      <Card>
        <CardContent className="p-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mounted] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
  }, [status, router]);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
    });
    if (activeTab !== "all") {
      params.set("status", activeTab);
    }

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
        setLoading(false);
      });
  }, [activeTab, page]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchOrders();
    }
  }, [session?.user?.role, fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!mounted || status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersSkeleton />
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">
              Manage and track customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {total} total orders
            </Badge>
          </div>
        </div>
        <Tabs defaultValue="orders">
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

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={
                activeTab === tab.value
                  ? "bg-[#E65100] hover:bg-[#BF360C] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  (
                  {orders.filter(
                    (o) => o.status === tab.value
                  ).length || ""}
                  )
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Card>
          <CardContent className="p-4">
            <OrdersSkeleton />
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No orders found
            </h3>
            <p className="text-gray-500">
              {activeTab !== "all"
                ? `No ${activeTab} orders at the moment`
                : "No orders have been placed yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                {activeTab === "all"
                  ? "All Orders"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({total} results)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-[140px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-xs text-gray-600">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {order.user?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {order.user?.email || ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100"
                          >
                            {order.orderItems?.length || 0} items
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-sm text-gray-900">
                            {formatPrice(order.total)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1.5">
                            {getPaymentIcon(order.paymentMethod)}
                            <span className="text-xs text-gray-500 hidden sm:inline">
                              {getPaymentLabel(order.paymentMethod)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {updatingId === order.id ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-[#E65100]" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${getStatusBadge(order.status)}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{order.status}</span>
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value)
                              }
                              disabled={updatingId === order.id}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                  <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-xs"
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Link href={`/account/orders/${order.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {idx > 0 && arr[idx - 1] < p - 1 && (
                        <span className="text-gray-400 px-1">...</span>
                      )}
                      <Button
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={
                          p === page
                            ? "bg-[#E65100] hover:bg-[#BF360C] text-white h-8 w-8 p-0"
                            : "h-8 w-8 p-0"
                        }
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </span>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
