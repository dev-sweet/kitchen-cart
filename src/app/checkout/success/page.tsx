'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  Package,
  Truck,
  Mail,
  Clock,
  MapPin,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

interface OrderData {
  orderId: string;
  id?: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  date: string;
}

// Confetti animation component
function ConfettiParticle({ delay, left, color }: { delay: number; left: string; color: string }) {
  return (
    <div
      className="absolute top-0 animate-confetti-fall"
      style={{
        left,
        animationDelay: `${delay}s`,
        backgroundColor: color,
      }}
    >
      <div className="w-3 h-3 rounded-sm rotate-45 opacity-80" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [mounted] = useState(() => typeof window !== 'undefined');
  const [orderData] = useState<OrderData | null>(() => {
    if (typeof window === 'undefined') return null;
    // Read from URL search params
    const params = new URLSearchParams(window.location.search);
    const paramOrderId = params.get('orderId');
    const paramTotal = params.get('total');
    if (paramOrderId) {
      return {
        orderId: paramOrderId,
        total: paramTotal ? parseFloat(paramTotal) : 0,
        itemCount: 0,
        paymentMethod: 'cod',
        date: new Date().toISOString(),
      };
    }
    // Fallback to localStorage
    const stored = localStorage.getItem('kitchencart-last-order');
    if (stored) {
      try {
        return JSON.parse(stored) as OrderData;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (orderData?.orderId) {
      navigator.clipboard.writeText(orderData.orderId).then(() => {
        setCopied(true);
        toast.success('Order ID copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const estimatedDelivery = orderData
    ? (() => {
        const deliveryDate = new Date(orderData.date);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        return deliveryDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });
      })()
    : '';

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-pulse space-y-6 text-center py-20">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
        </div>
      </div>
    );
  }

  const confettiColors = ['#E65100', '#FF9800', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Order Confirmed</span>
      </nav>

      {/* Success Content */}
      <div className="text-center py-8">
        {/* Confetti decoration */}
        <div className="relative h-0 w-full mb-0 overflow-hidden">
          {confettiColors.map((color, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.15}
              left={`${10 + i * 16}%`}
              color={color}
            />
          ))}
        </div>

        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto animate-success-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-3">
          Order Confirmed!{' '}
          <span className="inline-block animate-success-emoji">&#127881;</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for your order! We&apos;ve received it and will start preparing it right away.
        </p>

        {/* Order ID */}
        {orderData && (
          <div className="mb-8">
            <Card className="inline-block">
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-lg tracking-wider text-primary">
                  {orderData.orderId || orderData.id || 'N/A'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOrderId}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Confirmation Email</p>
                <p className="text-xs text-muted-foreground">
                  A confirmation has been sent to your email.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Estimated Delivery</p>
                <p className="text-xs text-muted-foreground">{estimatedDelivery || '3-5 business days'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Payment Method</p>
                <p className="text-xs text-muted-foreground">
                  {orderData?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        {orderData && (
          <Card className="text-left mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{orderData.orderId || orderData.id}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Date</span>
                  <span className="font-medium">
                    {new Date(orderData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">
                    {orderData.itemCount} {orderData.itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium">
                    {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Processing
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Total Paid</span>
                  <span className="text-xl font-bold text-primary">
                    {orderData.total > 0
                      ? formatPrice(orderData.total)
                      : 'See your email for total'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next */}
        <Card className="text-left mb-8 bg-orange-50/50 border-orange-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Order Confirmed</span> — Your order
                  has been placed and is being processed.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Packed & Shipped</span> — We&apos;ll
                  pack your items carefully and ship them to you.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">Delivered to You</span> — Your
                  package arrives at your door! Pay with cash on delivery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Track Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
