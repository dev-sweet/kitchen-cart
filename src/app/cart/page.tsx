'use client';

import { useState } from 'react';
import { useCartStore, type CartItemType } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  Tag,
  Truck,
  Percent,
  ArrowLeft,
  Home,
  Loader2,
  X,
} from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [mounted] = useState(() => typeof window !== 'undefined');

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = mounted ? getShipping() : 0;
  const tax = mounted ? getTax() : 0;
  const total = mounted ? getTotal() : 0;
  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);
  const freeShippingRemaining = Math.max(50 - subtotal, 0);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Invalid coupon code');
        return;
      }

      applyCoupon(data.code, data.discount);
      toast.success(data.message || 'Coupon applied successfully!');
      setCouponInput('');
    } catch {
      toast.error('Failed to apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };

  const handleQuantityChange = (id: string, newQty: number) => {
    updateQuantity(id, newQty);
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  // Breadcrumb
  const Breadcrumb = () => (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground font-medium">Shopping Cart</span>
    </nav>
  );

  // Empty Cart State
  if (mounted && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <ShoppingCart className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Looks like you haven&apos;t added any kitchen essentials yet. Start exploring our collection!
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/')}
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-1">
            {mounted ? `${items.length} item${items.length !== 1 ? 's' : ''} in your cart` : 'Loading...'}
          </p>
        </div>
        {mounted && items.length > 0 && (
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-red-500"
            onClick={() => {
              clearCart();
              toast.success('Cart cleared');
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress */}
          {mounted && subtotal < 50 && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Add <span className="text-primary font-bold">{formatPrice(freeShippingRemaining)}</span> more for
                    free shipping!
                  </p>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {mounted && subtotal >= 50 && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-700">
                    🎉 You qualify for <span className="font-bold">FREE shipping!</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart Items List */}
          {!mounted ? (
            // Loading Skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 self-center" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!mounted ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600">FREE</span>
                    ) : (
                      <span className="font-medium">{formatPrice(shipping)}</span>
                    )}
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  {/* Coupon Discount */}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Discount ({couponCode})
                      </span>
                      <span className="text-green-600 font-medium">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Coupon Input */}
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">{couponCode}</p>
                          <p className="text-xs text-green-600">
                            You save {formatPrice(couponDiscount)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-red-500 hover:bg-green-100 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Coupon Code</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="flex-1 h-10"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          variant="outline"
                          className="h-10 px-4"
                        >
                          {couponLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold mt-2"
                    onClick={() => router.push('/checkout')}
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Secure checkout powered by KitchenCart
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Cart Item Row ──────────── */
function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItemType;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string, name: string) => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Product Image */}
          <Link
            href={item.slug ? `/product/${item.slug}` : '#'}
            className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-100"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 96px, 128px"
            />
          </Link>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={item.slug ? `/product/${item.slug}` : '#'}
                  className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.variant && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {item.variant}
                  </Badge>
                )}
              </div>
              {/* Remove Button (mobile) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id, item.name)}
                className="text-muted-foreground hover:text-red-500 flex-shrink-0 h-8 w-8 p-0 sm:hidden"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Price & Quantity Row */}
            <div className="flex items-end justify-between mt-3 gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-0 border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-9 w-9 p-0 rounded-l-lg rounded-r-none hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="h-9 w-9 p-0 rounded-r-lg rounded-l-none hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Price & Remove (desktop) */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </p>
                  <p className="font-bold text-base sm:text-lg text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id, item.name)}
                  className="text-muted-foreground hover:text-red-500 hidden sm:flex h-9 w-9 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stock Warning */}
            {item.stock <= 5 && item.stock > 0 && (
              <p className="text-xs text-amber-600 mt-2">
                Only {item.stock} left in stock
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
