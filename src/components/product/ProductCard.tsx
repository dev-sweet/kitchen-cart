"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  featured: boolean;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

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

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? getDiscountPercent(product.price, product.comparePrice)
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: 1,
      stock: product.stock,
      category: product.category?.name,
      slug: product.slug,
    });

    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    });

    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      {
        description: isWishlisted
          ? `${product.name} removed from your wishlist`
          : `${product.name} added to your wishlist`,
      }
    );
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted">
        <div
          className={`aspect-square transition-all duration-500 ease-out group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </div>

        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Category Badge - Top Left */}
        {product.category && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              className="bg-white/90 text-foreground backdrop-blur-sm text-xs font-medium hover:bg-white/90"
            >
              {product.category.name}
            </Badge>
          </div>
        )}

        {/* Discount Badge - Top Left (below category) */}
        {discount > 0 && (
          <div className="absolute top-9 left-2 z-10">
            <Badge className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0 hover:bg-primary">
              <Percent className="w-3 h-3 mr-0.5" />
              {discount}% OFF
            </Badge>
          </div>
        )}

        {/* Wishlist Heart - Top Right */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <Heart
            size={16}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-foreground/60 hover:text-red-500"
            }
          />
        </button>

        {/* Add to Cart - Bottom (slides up on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-lg text-sm font-medium"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>

        {/* Out of stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="bg-white text-foreground px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 ${compact ? "p-2" : "p-3"}`}>
        {/* Product Name */}
        <h3 className="font-medium text-foreground text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating
          rating={product.rating}
          size={compact ? 12 : 14}
          showValue={!compact}
          reviewCount={product.reviewCount}
        />

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
