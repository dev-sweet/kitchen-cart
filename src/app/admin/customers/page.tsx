"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import {
  LayoutDashboard, ShoppingBag, Package, Settings, Users, ArrowLeft, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Settings },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

interface Customer {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatar: string | null;
  createdAt: string;
  _count?: { orders: number };
}

export default function AdminCustomersPage() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session || (session.user as any)?.role !== "admin") return;
    let active = true;
    fetch("/api/admin/customers")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (active) setCustomers(data); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session]);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!session || (session.user as any)?.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-destructive">Unauthorized Access</p>
          <p className="text-sm text-muted-foreground mt-2">Admin privileges required.</p>
          <Button asChild className="mt-4"><Link href="/">Go Home</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2 overflow-x-auto">
            <Link href="/" className="mr-2"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></Link>
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button variant={link.href === "/admin/customers" ? "default" : "ghost"} size="sm" className="gap-1.5 whitespace-nowrap">
                  <link.icon className="h-4 w-4" />{link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Customer</th>
                    <th className="text-left p-3 text-sm font-medium">Role</th>
                    <th className="text-left p-3 text-sm font-medium">Joined</th>
                    <th className="text-center p-3 text-sm font-medium">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {c.name?.charAt(0)?.toUpperCase() || c.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{c.name || "No name"}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant={c.role === "admin" ? "default" : "secondary"}>
                          {c.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {format(new Date(c.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline">{c._count?.orders || 0}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No customers found.</div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
