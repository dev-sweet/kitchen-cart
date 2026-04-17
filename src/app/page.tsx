"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft, ChevronRight, ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones,
  ChefHat, Cookie, Wrench, Zap, Package, Flame, UtensilsCrossed, Coffee,
  Sparkles, Mail, Loader2, CheckCircle, Eye, Cake, Archive, Wine, Scissors, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: { products: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
  category: { name: string; slug: string };
  featured: boolean;
  stock: number;
}

const categoryIconMap: Record<string, React.ElementType> = {
  "Baking Tools": Cake,
  "Kitchen Tools & Gadgets": Wrench,
  "Kitchen Electronics": Zap,
  "Kitchen Storage": Archive,
  "Aprons & Hats": Scissors,
  "Cookware & Bakeware": Flame,
  "Cutlery & Knives": UtensilsCrossed,
  "Dining & Serving": Wine,
  "Coffee & Tea": Coffee,
  "Cleaning & Care": Sparkles,
};

const heroSlides = [
  {
    image: "/bg/1.png",
    title: "Premium Kitchen Essentials",
    subtitle: "Elevate your cooking with professional-grade tools and equipment",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "View Collection", href: "/shop?featured=true" },
    badge: "New Arrivals",
  },
  {
    image: "/bg/2.png",
    title: "Master the Art of Baking",
    subtitle: "From mixing bowls to precision scales — everything a baker needs",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "View Collection", href: "/shop?category=baking-tools" },
    badge: "Best Sellers",
  },
  {
    image: "/bg/3.png",
    title: "Smart Kitchen Electronics",
    subtitle: "Discover innovative appliances that make cooking effortless",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "View Collection", href: "/shop?category=kitchen-electronics" },
    badge: "Trending",
  },
];

function getIcon(name: string) {
  return categoryIconMap[name] || ChefHat;
}

function SectionWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </section>
  );
}

/* 1. Hero Carousel */
function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slide = heroSlides[current];
  const go = (i: number) => setCurrent(i);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] lg:h-[600px] overflow-hidden bg-black">
      {heroSlides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <Image src={s.image} alt={s.title} fill className="object-cover" priority={i === 0} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}
      <div className="relative z-20 h-full flex items-center bg-[#000000]/40">
        <SectionWrap className="w-full">
          <div className="max-w-xl animate-[fadeInUp]">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-4 text-sm">{slide.badge}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">{slide.title}</h1>
            <p className="text-white/85 text-base sm:text-lg md:text-xl mb-8 max-w-md">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-lg"><Link href={slide.primaryCta.href}>{slide.primaryCta.label} <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm px-6"><Link href={slide.secondaryCta.href}>{slide.secondaryCta.label}</Link></Button>
            </div>
          </div>
        </SectionWrap>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`h-2.5 rounded-full transition-all ${i === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/70"}`} />
        ))}
      </div>
      <button onClick={() => go((current - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={() => go((current + 1) % heroSlides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white flex items-center justify-center"><ChevronRight className="w-5 h-5" /></button>
    </div>
  );
}

/* 2. Category Grid */
function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <SectionWrap className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Browse our wide selection of kitchen categories</p>
        </div>
        <Link href="/shop" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = getIcon(cat.name);
          return (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group bg-card rounded-xl border border-border p-4 md:p-5 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:border-primary/40">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors"><Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" /></div>
              <div>
                <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">{cat.name}</h3>
                {/* <p className="text-xs text-muted-foreground mt-0.5">{cat._count.products} products</p> */}
              </div>
            </Link>
          );
        })}
      </div>
    </SectionWrap>
  );
}

/* 3. Featured Products Scroll */
function FeaturedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -scrollRef.current.clientWidth * 0.7 : scrollRef.current.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <SectionWrap className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-6">
        <div><h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2><p className="text-muted-foreground mt-1 text-sm md:text-base">Handpicked items our customers love</p></div>
        <Link href="/shop?featured=true" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="relative group/scroll">
        <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all opacity-0 group-hover/scroll:opacity-100 pointer-events-none group-hover/scroll:pointer-events-auto"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all opacity-0 group-hover/scroll:opacity-100 pointer-events-none group-hover/scroll:pointer-events-auto"><ChevronRight className="w-5 h-5" /></button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {products.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[270px] snap-start"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* 4. Promo Banner */
function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#48C6EF] to-[#2D6AD4]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
      <SectionWrap className="relative z-10 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Truck className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">Free Shipping on Orders Over $50</h3>
              <p className="text-white/80 mt-1 text-sm md:text-base">Enjoy complimentary shipping on all qualifying orders. No coupon needed!</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#2a5fb5] hover:bg-white/90 font-semibold rounded-lg shadow-lg flex-shrink-0"><Link href="/shop">Shop Now <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
        </div>
      </SectionWrap>
    </div>
  );
}

/* 5. Best Sellers */
function BestSellers({ products }: { products: Product[] }) {
  return (
    <SectionWrap className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div><h2 className="text-2xl md:text-3xl font-bold">Best Sellers</h2><p className="text-muted-foreground mt-1 text-sm md:text-base">Our most popular products based on customer reviews</p></div>
        <Link href="/shop?sort=popular" className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </SectionWrap>
  );
}

/* 6. Shop by Collection */
const collections = [
  { name: "Baking Collection", slug: "baking-tools", count: 8, desc: "Everything you need for the perfect bake", icon: Cake, color: "from-amber-100 via-orange-50 to-amber-50", btnBg: "bg-amber-600 hover:bg-amber-700" },
  { name: "Cooking Collection", slug: "cookware-bakeware", count: 8, desc: "Professional cookware for the home chef", icon: Flame, color: "from-orange-100 via-red-50 to-orange-50", btnBg: "bg-orange-600 hover:bg-orange-700" },
  { name: "Storage Collection", slug: "kitchen-storage", count: 8, desc: "Smart storage solutions for your kitchen", icon: Package, color: "from-emerald-50 via-teal-50 to-cyan-50", btnBg: "bg-emerald-600 hover:bg-emerald-700" },
];

function ShopByCollection() {
  return (
    <SectionWrap className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div><h2 className="text-2xl md:text-3xl font-bold">Shop by Collection</h2><p className="text-muted-foreground mt-1 text-sm md:text-base">Curated collections for every kitchen need</p></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {collections.map((col) => {
          const Icon = col.icon;
          return (
            <Link key={col.slug} href={`/shop?category=${col.slug}`} className="group block h-full">
              <Card className={`bg-gradient-to-br ${col.color} border-0 rounded-2xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-xl hover:-translate-y-1`}>
                <div className="p-6 md:p-8 flex flex-col items-center text-center min-h-[240px] justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Icon className={`w-10 h-10 ${col.btnBg.replace("bg-", "text-").replace("hover:", "")}`} /></div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{col.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{col.desc}</p>
                    <Badge variant="outline" className="text-xs font-medium">{col.count} items</Badge>
                  </div>
                  <Button size="sm" className={`mt-2 ${col.btnBg} text-white rounded-lg font-medium`}>Shop Now <ArrowRight className="ml-1 w-4 h-4" /></Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </SectionWrap>
  );
}

/* 7. Trust Badges */
const trustBadges = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "SSL encrypted checkout" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

function TrustBadges() {
  return (
    <SectionWrap className="py-12 md:py-16 border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {trustBadges.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="w-7 h-7 text-primary" /></div>
              <div><h4 className="font-semibold text-sm md:text-base">{b.title}</h4><p className="text-muted-foreground text-xs md:text-sm mt-0.5">{b.desc}</p></div>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}

/* 8. Newsletter */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      if (res.ok) { setSent(true); setEmail(""); toast.success("Subscribed!"); }
      else { const d = await res.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Network error"); }
    setLoading(false);
  };

  return (
    <div className="bg-[#1A1A1A] text-white">
      <SectionWrap className="py-14 md:py-20">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5"><Mail className="w-7 h-7 text-primary" /></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base">Get 10% off your first order and stay updated with the latest products & deals</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary rounded-lg pr-4" />
            </div>
            <Button type="submit" size="lg" disabled={loading || !email.trim()} className="h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg px-6 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
            </Button>
          </form>
          {sent && <p className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm"><CheckCircle className="w-4 h-4" />Successfully subscribed!</p>}
        </div>
      </SectionWrap>
    </div>
  );
}

/* 9. Recently Viewed */
function RecentlyViewed() {
  const [items, setItems] = useState<{ id: string; name: string; slug: string; price: number; image: string }[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("kitchencart-recently-viewed");
      if (stored) { const parsed = JSON.parse(stored); if (Array.isArray(parsed)) return parsed.slice(0, 10); }
    } catch {}
    return [];
  });

  console.log(items)
  if (items.length === 0) return null;
  return (
    <SectionWrap className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-6">
        <div><h2 className="text-2xl md:text-3xl font-bold">Recently Viewed</h2><p className="text-muted-foreground mt-1 text-sm">Products you&apos;ve been looking at</p></div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
        {items.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px]">
            <Link href={`/product/${p.slug}`} className="group block bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden bg-muted">
                {p.image && <Image src={p.image} alt={p.name} fill sizes="220px" className="object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />}
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h4>
                <p className="text-sm font-bold text-primary mt-1">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* Skeletons */
function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="aspect-square bg-muted" />
          <div className="p-3 space-y-2"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /><div className="h-5 bg-muted rounded w-1/3 mt-2" /></div>
        </div>
      ))}
    </div>
  );
}

function CategoryGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-4 md:p-5 flex flex-col items-center gap-3 animate-pulse">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted" /><div className="h-4 bg-muted rounded w-20" /><div className="h-3 bg-muted rounded w-12" />
        </div>
      ))}
    </div>
  );
}

/* Main Page */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingFeat, setLoadingFeat] = useState(true);
  const [loadingBest, setLoadingBest] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setCategories(d.slice(0, 10)); }).catch(() => {}).finally(() => setLoadingCat(false));
    fetch("/api/products?featured=true&limit=12").then((r) => r.json()).then((d) => { if (d.data) setFeatured(d.data); }).catch(() => {}).finally(() => setLoadingFeat(false));
    fetch("/api/products?sort=popular&limit=8").then((r) => r.json()).then((d) => { if (d.data) setBestSellers(d.data); }).catch(() => {}).finally(() => setLoadingBest(false));
  }, []);

  return (
    <div className="w-full">
      <HeroBanner />
      {loadingCat ? <SectionWrap className="py-12 md:py-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">Shop by Category</h2><CategoryGridSkeleton /></SectionWrap> : <CategoryGrid categories={categories} />}
      {loadingFeat ? <SectionWrap className="py-12 md:py-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Products</h2><ProductGridSkeleton count={4} /></SectionWrap> : <FeaturedProducts products={featured} />}
      <PromoBanner />
      {loadingBest ? <SectionWrap className="py-12 md:py-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">Best Sellers</h2><ProductGridSkeleton count={8} /></SectionWrap> : <BestSellers products={bestSellers} />}
      <ShopByCollection />
      <TrustBadges />
      <Newsletter />
      <RecentlyViewed />
    </div>
  );
}
