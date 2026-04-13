"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  Loader2,
  Star,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  category?: { name: string } | null;
}

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingCartId, setAddingCartId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status, router, fetchWishlist]);

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      const res = await fetch(`/api/wishlist/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        toast.success("Removed from wishlist");
      } else {
        toast.error("Failed to remove item");
      }
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (item.product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    setAddingCartId(item.productId);
    try {
      addItem({
        id: `wishlist-${item.productId}-${Date.now()}`,
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || "/images/placeholder.jpg",
        quantity: 1,
        stock: item.product.stock,
        category: item.product.category?.name,
        slug: item.product.slug,
      });
      openCart();
      toast.success(`${item.product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingCartId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-8 w-40 mb-1" />
        <Skeleton className="h-5 w-56 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-primary transition-colors">
          My Account
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">
          {items.length} item{items.length !== 1 ? "s" : ""} saved for later
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Save your favorite products here so you can easily find them
                later. Start browsing and tap the heart icon on products you
                love.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Explore Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const product = item.product;
              const hasDiscount =
                product.comparePrice && product.comparePrice > product.price;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.comparePrice! - product.price) /
                      product.comparePrice!) *
                      100
                  )
                : 0;
              const isOutOfStock = product.stock <= 0;

              return (
                <Card
                  key={item.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Link href={`/product/${product.slug}`}>
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        )}
                      </Link>
                      {/* Remove Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(item.id);
                        }}
                        disabled={removingId === item.id}
                      >
                        {removingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <Badge className="absolute top-3 left-3 bg-primary text-white text-xs">
                          {discountPercent}% OFF
                        </Badge>
                      )}
                      {/* Out of Stock Overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="secondary" className="bg-white text-foreground text-sm px-3 py-1">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-2">
                      {product.category && (
                        <p className="text-xs text-muted-foreground">
                          {product.category.name}
                        </p>
                      )}
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {product.rating > 0 && (
                          <>
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-muted-foreground">
                              {product.rating.toFixed(1)}
                              {product.reviewCount > 0 &&
                                ` (${product.reviewCount})`}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.comparePrice!.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {/* Actions */}
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white mt-1"
                        size="sm"
                        disabled={isOutOfStock || addingCartId === product.id}
                        onClick={() => handleAddToCart(item)}
                      >
                        {addingCartId === product.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : isOutOfStock ? (
                          "Out of Stock"
                        ) : (
                          <>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Back to Account */}
      <div className="mt-8">
        <Link href="/account">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
