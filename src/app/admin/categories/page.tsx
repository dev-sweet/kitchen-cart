"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Plus, Search, Package, Settings, Users, ShoppingBag, LayoutDashboard, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Settings },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  bannerImage: string | null;
  featured: boolean;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", icon: "", bannerImage: "", featured: false,
  });

  const loadCategories = () => {
    let active = true;
    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (active) setCategories(data); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  };

  useEffect(() => {
    if (session && session.user && (session.user as any).role === "admin") {
      return loadCategories();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Category created");
        setDialogOpen(false);
        setForm({ name: "", description: "", icon: "", bannerImage: "", featured: false });
        loadCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    }
    setSubmitting(false);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!session || (session.user as any).role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-destructive">Unauthorized Access</p>
          <p className="text-sm text-muted-foreground mt-2">You need admin privileges to view this page.</p>
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
                <Button variant={link.href === "/admin/categories" ? "default" : "ghost"} size="sm" className="gap-1.5 whitespace-nowrap">
                  <link.icon className="h-4 w-4" />{link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5"><Plus className="h-4 w-4" />Add Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Category</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Icon Name</Label>
                  <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. Cake, Zap, Coffee" />
                </div>
                <div>
                  <Label>Banner Image URL</Label>
                  <Input value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <Label>Featured</Label>
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center"><p className="text-muted-foreground">No categories found.</p></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Category</th>
                    <th className="text-left p-3 text-sm font-medium">Slug</th>
                    <th className="text-center p-3 text-sm font-medium">Products</th>
                    <th className="text-center p-3 text-sm font-medium">Featured</th>
                    <th className="text-left p-3 text-sm font-medium">Banner</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr key={cat.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{cat.slug}</td>
                      <td className="p-3 text-center"><Badge variant="secondary">{cat._count.products}</Badge></td>
                      <td className="p-3 text-center">{cat.featured ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}</td>
                      <td className="p-3">
                        {cat.bannerImage ? (
                          <div className="h-8 w-16 rounded overflow-hidden relative">
                            <Image src={cat.bannerImage} alt={cat.name} fill className="object-cover" sizes="64px" />
                          </div>
                        ) : <span className="text-xs text-muted-foreground">None</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
