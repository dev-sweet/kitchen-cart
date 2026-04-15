"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  sku: string | null;
  images: string[];
  tags: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  reviews: Review[];
  relatedProducts: Product[];
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

const RECENTLY_VIEWED_KEY = "kitchencart-recently-viewed";
const MAX_RECENTLY_VIEWED = 10;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Product options state
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewHover, setReviewHover] = useState(0);

  // Reviews pagination
  const [reviewsPage, setReviewsPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setNotFound(false);

    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setAllReviews(data.reviews || []);
        setSelectedImageIndex(0);
        setQuantity(1);
        setSelectedVariants({});
        setReviewRating(0);
        setReviewTitle("");
        setReviewBody("");
        setReviewsPage(1);
        setIsLoading(false);

        // Save to recently viewed
        if (typeof window !== "undefined") {
          try {
            const stored = JSON.parse(
              localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]"
            );
            const filtered = stored.filter(
              (item: { id: string }) => item.id !== data.id
            );
            filtered.unshift({
              id: data.id,
              name: data.name,
              slug: data.slug,
              price: data.price,
              image: data.images?.[0] || "",
            });
            localStorage.setItem(
              RECENTLY_VIEWED_KEY,
              JSON.stringify(filtered.slice(0, MAX_RECENTLY_VIEWED))
            );
          } catch {
            // Ignore localStorage errors
          }
        }

        // Check wishlist status if logged in
        if (session?.user) {
          fetch("/api/wishlist")
            .then((r) => r.json())
            .then((wishlist) => {
              if (Array.isArray(wishlist)) {
                const isW = wishlist.some(
                  (w: { productId: string }) => w.productId === data.id
                );
                setIsWishlisted(isW);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setNotFound(true);
        setIsLoading(false);
      });
  }, [slug, session?.user]);

  // Group variants by name
  const groupedVariants = useMemo(() => {
    if (!product?.variants) return {};
    const groups: Record<string, ProductVariant[]> = {};
    product.variants.forEach((v) => {
      if (!groups[v.name]) groups[v.name] = [];
      groups[v.name].push(v);
    });
    return groups;
  }, [product?.variants]);

  // Calculate effective price based on selected variants
  const effectivePrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    Object.values(selectedVariants).forEach((variantId) => {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) price += variant.priceModifier;
    });
    return Math.max(0, price);
  }, [product, selectedVariants]);

  // Calculate effective stock
  const effectiveStock = useMemo(() => {
    if (!product) return 0;
    if (Object.keys(selectedVariants).length === 0) return product.stock;
    let stock = Infinity;
    Object.values(selectedVariants).forEach((variantId) => {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant && variant.stock < stock) stock = variant.stock;
    });
    return stock === Infinity ? product.stock : stock;
  }, [product, selectedVariants]);

  // Stock status
  const stockStatus = useMemo(() => {
    if (effectiveStock <= 0) return { label: "Out of Stock", color: "text-red-500", bg: "bg-red-50" };
    if (effectiveStock <= 5) return { label: `Only ${effectiveStock} left in stock`, color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "In Stock", color: "text-emerald-600", bg: "bg-emerald-50" };
  }, [effectiveStock]);

  // Rating distribution for reviews tab (must be before early returns)
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return dist;
  }, [allReviews]);

  const avgReviewRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : product?.rating ?? 0;

  // Handle variant selection
  const handleVariantSelect = (variantName: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: variantId }));
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= effectiveStock) {
      setQuantity(newQty);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || effectiveStock <= 0) return;

    const variantLabel = Object.entries(selectedVariants)
      .map(([name, variantId]) => {
        const v = product.variants.find((v) => v.id === variantId);
        return v ? `${name}: ${v.value}` : "";
      })
      .filter(Boolean)
      .join(", ");

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.images?.[0] || "",
      quantity,
      stock: effectiveStock,
      category: product.category?.name,
      slug: product.slug,
      variant: variantLabel || undefined,
    });

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    });

    openCart();
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!product || !session?.user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    if (isWishlisted) {
      // Remove from wishlist - find the wishlist item
      try {
        const res = await fetch("/api/wishlist");
        const wishlist = await res.json();
        const item = wishlist.find(
          (w: { productId: string }) => w.productId === product.id
        );
        if (item) {
          await fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        }
      } catch {
        toast.error("Failed to remove from wishlist");
      }
    } else {
      // Add to wishlist
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        } else {
          const data = await res.json();
          if (res.status === 409) {
            setIsWishlisted(true);
            toast.info("Already in your wishlist");
          } else {
            toast.error(data.error || "Failed to add to wishlist");
          }
        }
      } catch {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  // Handle review submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !session?.user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (reviewRating < 1) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle || undefined,
          body: reviewBody || undefined,
        }),
      });

      if (res.ok) {
        toast.success("Review submitted! Thank you for your feedback.");
        setReviewRating(0);
        setReviewTitle("");
        setReviewBody("");
        // Refresh reviews
        const reviewsRes = await fetch(
          `/api/reviews?productId=${product.id}`
        );
        const reviewsData = await reviewsRes.json();
        setAllReviews(reviewsData.data || []);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl bg-muted" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-20 h-20 rounded-lg bg-muted shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div className="space-y-5">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-32" />
              <Separator />
              <Skeleton className="h-10 w-40" />
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16 rounded-lg" />
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-40 rounded-lg" />
                <Skeleton className="h-12 w-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <PackageX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? getDiscountPercent(product.price, product.comparePrice)
      : 0;

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImageIndex] || product.images[0]
      : "/placeholder.png";

  // avgReviewRating and ratingDistribution moved before early returns above

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 sm:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" asChild>
                <Link href="/" className="flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop" asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {product.category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/shop?categoryId=${product.category.id}`}
                    asChild
                  >
                    <Link href={`/shop?categoryId=${product.category.id}`}>
                      {product.category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-transform duration-300 ${
                  isZoomed ? "scale-[2.5]" : "scale-100"
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
                priority
              />

              {/* Discount badge on image */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1">
                    {discount}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === idx
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Category */}
            {product.category && (
              <Link
                href={`/shop?categoryId=${product.category.id}`}
                className="inline-block"
              >
                <Badge
                  variant="secondary"
                  className="text-xs font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  {product.category.name}
                </Badge>
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating
                rating={product.rating}
                size={18}
                showValue
                reviewCount={product.reviewCount}
              />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(effectivePrice)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    effectiveStock <= 0
                      ? "bg-red-500"
                      : effectiveStock <= 5
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                />
                {stockStatus.label}
              </div>
              {product.sku && (
                <span className="text-xs text-muted-foreground">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <Separator />

<h3 className="text-xl font-bold mb-0">Product Details:</h3>
           
   <iframe
  srcDoc={product?.description
    ?.replace(/\\r\\n|\\r|\\n|\\t/g, "")
    .replace(/\s+/g, " ")
    .trim()}
/>
            {/* Variant Selectors */}
            {Object.keys(groupedVariants).length > 0 &&
              Object.entries(groupedVariants).map(([variantName, variants]) => (
                <div key={variantName} className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {variantName}:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedVariants[variantName]
                        ? variants.find(
                            (v) => v.id === selectedVariants[variantName]
                          )?.value
                        : "Select"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const isSelected =
                        selectedVariants[variantName] === variant.id;
                      const isOutOfStock = variant.stock <= 0;
                      return (
                        <button
                          key={variant.id}
                          onClick={() =>
                            !isOutOfStock &&
                            handleVariantSelect(variantName, variant.id)
                          }
                          disabled={isOutOfStock}
                          className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-primary"
                              : isOutOfStock
                                ? "border-border bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                                : "border-border hover:border-primary/50 text-foreground"
                          }`}
                        >
                          {variant.value}
                          {isOutOfStock && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="h-px w-full bg-muted-foreground/40 rotate-[-25deg] absolute" />
                            </span>
                          )}
                          {variant.priceModifier !== 0 && (
                            <span className="text-xs ml-1 opacity-70">
                              {variant.priceModifier > 0 ? "+" : ""}
                              {formatPrice(variant.priceModifier)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Quantity + Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">
                  Quantity:
                </span>
                <div className="flex items-center border-2 border-border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center font-semibold text-foreground border-x-2 border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= effectiveStock}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold gap-2"
                  onClick={handleAddToCart}
                  disabled={effectiveStock <= 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {effectiveStock <= 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 w-12 p-0 shrink-0 ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 hover:bg-red-100"
                      : ""
                  }`}
                  onClick={handleWishlistToggle}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-foreground"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Free Shipping</p>
                  <p className="text-xs">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Easy Returns</p>
                  <p className="text-xs">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Payment</p>
                  <p className="text-xs">100% protected</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 sm:mt-14">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-muted/50 h-auto p-0 rounded-lg overflow-x-auto">
              <TabsTrigger
                value="description"
                className="px-5 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="px-5 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="px-5 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="px-5 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                Shipping Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="max-w-3xl">
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  {product.description ? (
                    product.description.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No description available for this product.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="max-w-2xl">
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30 w-40">
                          SKU
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.sku || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30">
                          Category
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.category?.name || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30">
                          Availability
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={stockStatus.color}>
                            {stockStatus.label}
                          </span>
                        </td>
                      </tr>
                      {product.variants && product.variants.length > 0 && (
                        <tr className="border-b border-border">
                          <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30">
                            Variants
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {Object.keys(groupedVariants).join(", ")}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-border">
                        <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30">
                          Rating
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.rating.toFixed(1)} out of 5 (
                          {product.reviewCount} reviews)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-foreground bg-muted/30">
                          Tags
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.tags && product.tags.length > 0
                            ? product.tags.join(", ")
                            : "None"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-4xl">
                {/* Review Summary */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8 p-6 bg-muted/30 rounded-xl">
                  <div className="text-center sm:text-left shrink-0">
                    <div className="text-4xl font-bold text-foreground">
                      {avgReviewRating.toFixed(1)}
                    </div>
                    <StarRating rating={avgReviewRating} size={18} />
                    <p className="text-sm text-muted-foreground mt-1">
                      {allReviews.length} review
                      {allReviews.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star - 1];
                      const percentage =
                        allReviews.length > 0
                          ? (count / allReviews.length) * 100
                          : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-3 text-muted-foreground">
                            {star}
                          </span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Form (logged-in users) */}
                {session?.user ? (
                  <div className="mb-8 p-6 border border-border rounded-xl">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Write a Review
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Star selector */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Your Rating *
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              className="p-0.5 transition-transform hover:scale-110"
                              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                              <Star
                                size={28}
                                className={
                                  star <= (reviewHover || reviewRating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                          {reviewRating > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {reviewRating} star{reviewRating > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Review Title
                        </label>
                        <Input
                          placeholder="Summarize your experience"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="bg-background"
                        />
                      </div>

                      {/* Body */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">
                          Your Review
                        </label>
                        <Textarea
                          placeholder="Tell us what you liked or disliked about this product..."
                          rows={4}
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          className="bg-background resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmittingReview || reviewRating < 1}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="mb-8 p-6 border border-border rounded-xl text-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Please{" "}
                      <Link
                        href="/auth/signin"
                        className="text-primary font-medium hover:underline"
                      >
                        sign in
                      </Link>{" "}
                      to write a review.
                    </p>
                  </div>
                )}

                {/* Reviews list */}
                <div className="space-y-6">
                  {allReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    allReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-5 border border-border rounded-xl"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {review.user?.name || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-2">
                                <StarRating
                                  rating={review.rating}
                                  size={12}
                                />
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 gap-0.5"
                                  >
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {timeAgo(review.createdAt)}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="text-sm font-semibold text-foreground mb-1.5">
                            {review.title}
                          </h4>
                        )}
                        {review.body && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.body}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-2xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Free Standard Shipping
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enjoy free standard shipping on all orders over $50. Orders
                      under $50 have a flat shipping rate of $5.99.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <PackageX className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Estimated Delivery
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Standard shipping takes 5-7 business days. Express
                      shipping (2-3 business days) is available for an
                      additional $9.99.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Returns & Exchanges
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We offer a 30-day hassle-free return policy. Items must be
                      unused and in original packaging. Contact our support team
                      to initiate a return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      Order Protection
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All orders are insured against damage during transit. If
                      your items arrive damaged, we&apos;ll send a free
                      replacement.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                You May Also Like
              </h2>
              <Button variant="ghost" asChild className="text-primary gap-1">
                <Link href="/shop">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {product.relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
