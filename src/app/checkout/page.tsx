'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  Home,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
  Package,
  ArrowLeft,
  ShieldCheck,
  Tag,
  Percent,
} from 'lucide-react';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const defaultAddress: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    items,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    couponCode,
    couponDiscount,
    clearCart,
  } = useCartStore();

  const [mounted] = useState(() => typeof window !== 'undefined');
  const [address, setAddress] = useState<ShippingAddress>(() => {
    if (typeof window === 'undefined') return defaultAddress;
    return defaultAddress;
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Partial<ShippingAddress>>({});

  // Pre-fill email and name from session using useMemo
  const prefilledAddress = session?.user
    ? {
        ...address,
        email: address.email || session.user.email || '',
        fullName: address.fullName || session.user.name || '',
      }
    : address;

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = mounted ? getShipping() : 0;
  const tax = mounted ? getTax() : 0;
  const total = mounted ? getTotal() : 0;

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  const validateAddress = (): boolean => {
    const errors: Partial<ShippingAddress> = {};

    const addr = prefilledAddress;
    if (!addr.fullName.trim()) errors.fullName = 'Full name is required';
    if (!addr.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email))
      errors.email = 'Invalid email format';
    if (!addr.phone.trim()) errors.phone = 'Phone number is required';
    if (!addr.addressLine1.trim())
      errors.addressLine1 = 'Address is required';
    if (!addr.city.trim()) errors.city = 'City is required';
    if (!addr.state.trim()) errors.state = 'State is required';
    if (!addr.zip.trim()) errors.zip = 'ZIP code is required';
    if (!addr.country.trim()) errors.country = 'Country is required';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateAddress()) {
      toast.error('Please fill in all required fields');
      // Scroll to the first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: prefilledAddress,
          notes: notes.trim() || undefined,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to place order');
        setIsSubmitting(false);
        return;
      }

      // Save order info for success page
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'kitchencart-last-order',
          JSON.stringify({
            orderId: data.orderId,
            id: data.id,
            total: data.total,
            itemCount: items.length,
            paymentMethod: paymentMethod,
            date: new Date().toISOString(),
          })
        );
      }

      // Clear Zustand cart
      clearCart();

      // Redirect to success page
      router.push(
        `/checkout/success?orderId=${data.orderId || data.id}&total=${data.total}`
      );
    } catch {
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Login prompt for unauthenticated users
  if (mounted && status !== 'loading' && !session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/cart" className="hover:text-primary transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <Card className="max-w-lg mx-auto mt-12">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Sign in to Checkout</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to your account to complete your purchase. You&apos;ll be able to track
              your orders and manage your account.
            </p>
            <Button
              size="lg"
              onClick={() => signIn('credentials', { callbackUrl: '/checkout' })}
              className="bg-primary hover:bg-primary/90 text-white w-full mb-3"
            >
              Sign In to Continue
            </Button>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state while checking session
  if (!mounted || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-4 mb-8">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-[500px] rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[400px] rounded-xl sticky top-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/cart" className="hover:text-primary transition-colors">
          Cart
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">1</span>
            Shipping
          </span>
          <div className="w-8 h-px bg-gray-300" />
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-muted-foreground text-xs flex items-center justify-center font-medium">2</span>
            Payment
          </span>
          <div className="w-8 h-px bg-gray-300" />
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-gray-200 text-muted-foreground text-xs flex items-center justify-center font-medium">3</span>
            Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5 text-primary" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={prefilledAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    data-error={!!addressErrors.fullName}
                    className={addressErrors.fullName ? 'border-red-500' : ''}
                  />
                  {addressErrors.fullName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={prefilledAddress.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                    data-error={!!addressErrors.email}
                    className={addressErrors.email ? 'border-red-500' : ''}
                  />
                  {addressErrors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={address.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    data-error={!!addressErrors.phone}
                    className={addressErrors.phone ? 'border-red-500' : ''}
                  />
                  {addressErrors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.phone}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    data-error={!!addressErrors.country}
                    className={addressErrors.country ? 'border-red-500' : ''}
                  />
                  {addressErrors.country && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-2">
                <Label htmlFor="addressLine1">
                  Street Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="123 Main Street, Apt 4B"
                  value={address.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  data-error={!!addressErrors.addressLine1}
                  className={addressErrors.addressLine1 ? 'border-red-500' : ''}
                />
                {addressErrors.addressLine1 && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {addressErrors.addressLine1}
                  </p>
                )}
              </div>

              {/* Address Line 2 (optional) */}
              <div className="space-y-2">
                <Label htmlFor="addressLine2">
                  Address Line 2 <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                  id="addressLine2"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={address.addressLine2}
                  onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    data-error={!!addressErrors.city}
                    className={addressErrors.city ? 'border-red-500' : ''}
                  />
                  {addressErrors.city && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.city}
                    </p>
                  )}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    data-error={!!addressErrors.state}
                    className={addressErrors.state ? 'border-red-500' : ''}
                  />
                  {addressErrors.state && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.state}
                    </p>
                  )}
                </div>

                {/* ZIP */}
                <div className="space-y-2">
                  <Label htmlFor="zip">
                    ZIP Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={address.zip}
                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                    data-error={!!addressErrors.zip}
                    className={addressErrors.zip ? 'border-red-500' : ''}
                  />
                  {addressErrors.zip && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {addressErrors.zip}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {/* Cash on Delivery - Primary/Highlighted */}
                <label
                  htmlFor="cod"
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-primary bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Cash on Delivery</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay with cash when your order is delivered. No extra fees.
                    </p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                </label>

                {/* Card Payment - Placeholder */}
                <label
                  htmlFor="card"
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Credit / Debit Card</p>
                      <span className="text-xs bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pay securely with Visa, Mastercard, or other cards via Stripe.
                    </p>
                  </div>
                </label>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Online card payments will be available soon. Please select Cash on Delivery to
                    continue.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-primary" />
                Order Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Special instructions for delivery, gift messages, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Optional — add any special instructions for your order.
              </p>
            </CardContent>
          </Card>

          {/* Back to Cart */}
          <Link href="/cart">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

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
                  <span className="text-green-600 font-medium">
                    -{formatPrice(couponDiscount)}
                  </span>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              {/* Payment Method Summary */}
              <div className="flex items-center justify-between text-sm text-muted-foreground bg-gray-50 rounded-lg p-3">
                <span>Payment:</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  {paymentMethod === 'cod' ? (
                    <>
                      <Banknote className="w-4 h-4 text-green-600" />
                      Cash on Delivery
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Credit Card
                    </>
                  )}
                </span>
              </div>

              {/* Place Order Button */}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold"
                onClick={handleSubmit}
                disabled={isSubmitting || paymentMethod === 'card'}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Place Order — {formatPrice(total)}
                  </>
                )}
              </Button>

              {paymentMethod === 'card' && (
                <p className="text-xs text-center text-amber-600">
                  Card payments are not available yet. Please use Cash on Delivery.
                </p>
              )}

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Tracked
                </span>
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  Best Price
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
