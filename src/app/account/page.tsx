"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  avatar: string | null;
  createdAt: string;
  orderCount: number;
  wishlistCount: number;
  addressCount: number;
}

interface OrderItem {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: { id: string; productName: string; quantity: number }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  processing: ShoppingBag,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Clock,
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/account/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch {
      console.error("Failed to fetch profile");
    }
  }, []);

  const fetchRecentOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?limit=3");
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.data || []);
      }
    } catch {
      console.error("Failed to fetch orders");
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      let active = true;
      fetch("/api/account/profile")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => { if (active && data) setProfile(data); })
        .catch(() => {});
      fetch("/api/orders?limit=3")
        .then((res) => (res.ok ? res.json() : { data: [] }))
        .then((data) => { if (active) setRecentOrders(data.data || []); })
        .catch(() => {})
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }
  }, [status, router]);

  const handleSignOut = async () => {
    toast.success("Signed out successfully");
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64 mt-6" />
      </div>
    );
  }

  if (!session) return null;

  const quickLinks = [
    {
      title: "My Orders",
      description: "Track and manage your orders",
      icon: Package,
      href: "/account/orders",
      count: profile?.orderCount || 0,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Wishlist",
      description: "Items you've saved for later",
      icon: Heart,
      href: "/account/wishlist",
      count: profile?.wishlistCount || 0,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Addresses",
      description: "Manage your shipping addresses",
      icon: MapPin,
      href: "/account/addresses",
      count: profile?.addressCount || 0,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Profile",
      description: "Update your personal information",
      icon: User,
      href: "/account/profile",
      count: null,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Account</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user?.name || "there"}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Info Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">
                  {(session.user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{session.user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {session.user?.role || "customer"}
              </Badge>

              <Separator className="my-4" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <p className="text-lg font-bold">{profile?.orderCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{profile?.wishlistCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Wishlist</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{profile?.addressCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Addresses</p>
                </div>
              </div>

              <Separator className="my-4" />

              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Quick Links + Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${link.color}`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">{link.title}</h3>
                          {link.count !== null && (
                            <Badge variant="secondary" className="text-xs">
                              {link.count}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {link.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Link href="/account/orders">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                  <Link href="/">
                    <Button variant="outline" size="sm" className="mt-3">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || Clock;
                    return (
                      <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/30 hover:bg-orange-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {order.orderItems
                                .slice(0, 2)
                                .map((i) => i.productName)
                                .join(", ")}
                              {order.orderItems.length > 2 &&
                                ` +${order.orderItems.length - 2} more`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              &middot; {order.orderItems.length} item
                              {order.orderItems.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4 shrink-0">
                          <p className="text-sm font-semibold">
                            ${order.total.toFixed(2)}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
