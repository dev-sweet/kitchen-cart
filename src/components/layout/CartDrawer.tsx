"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore, type CartItemType } from "@/store/cart-store";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  X,
  ArrowRight,
  Truck,
} from "lucide-react";

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 py-4">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={item.image || "/images/placeholder-product.png"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-product.png";
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.slug || item.productId}`}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          {item.variant && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {item.variant}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 border border-border rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-l-md hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-7 w-8 items-center justify-center text-sm font-medium border-x border-border">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-r-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
              aria-label="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Your cart is empty
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[240px]">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <Button asChild onClick={onClose} className="bg-primary hover:bg-primary/90">
        <Link href="/shop">
          Continue Shopping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    couponCode,
    couponDiscount,
    removeCoupon,
    applyCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Sync coupon input with store
  useEffect(() => {
    if (couponCode) {
      setCouponInput(couponCode);
    }
  }, [couponCode]);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon code");
        return;
      }

      applyCoupon(data.code, data.discount);
    } catch {
      setCouponError("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, applyCoupon]);

  const handleRemoveCoupon = useCallback(() => {
    setCouponInput("");
    setCouponError("");
    removeCoupon();
  }, [removeCoupon]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs min-w-[20px] h-5 px-1.5 font-medium">
                {itemCount}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your shopping cart items
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyCart onClose={closeCart} />
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 px-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ScrollArea>

            {/* Coupon & Summary */}
            <div className="flex-shrink-0 border-t border-border bg-background">
              {/* Coupon Section */}
              <div className="px-6 py-4">
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {couponCode}
                      </span>
                      <span className="text-xs text-green-600">
                        (-${couponDiscount.toFixed(2)})
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className="h-9 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="h-9 px-3 flex-shrink-0"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-destructive mt-1.5">
                    {couponError}
                  </p>
                )}
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="px-6 py-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -${couponDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        Free
                      </span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <SheetFooter className="px-6 pb-6 pt-0 flex flex-col gap-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-semibold">
                  <Link href="/checkout" onClick={closeCart}>
                    Checkout — ${total.toFixed(2)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-10 text-sm">
                  <Link href="/cart" onClick={closeCart}>
                    View Cart
                  </Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
