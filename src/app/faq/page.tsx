"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout for an additional fee. Free shipping is included on all orders over $50." },
      { q: "Do you ship internationally?", a: "Currently, we only ship within the United States. We are working on expanding to Canada and other countries soon. Sign up for our newsletter to be the first to know." },
      { q: "How can I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can also check your order status in your account dashboard under 'My Orders'." },
      { q: "What if my order arrives damaged?", a: "We're sorry if your order arrived damaged. Please contact us within 48 hours of delivery with photos of the damage, and we'll arrange a free replacement or full refund." },
      { q: "Can I change or cancel my order?", a: "You can modify or cancel your order within 1 hour of placing it. After that, our warehouse may have already started processing. Contact our support team for assistance." },
    ],
  },
  {
    category: "Products",
    items: [
      { q: "Are your products dishwasher safe?", a: "Most of our products are dishwasher safe. Check the product description page for specific care instructions. Items like wooden cutting boards and some knife sets should be hand washed." },
      { q: "Do you offer product warranties?", a: "Yes! All our products come with a minimum 1-year manufacturer warranty. Premium items like our stand mixers and Dutch ovens include extended warranties of up to 5 years." },
      { q: "How do I know if a product is in stock?", a: "Stock status is displayed on each product page. If an item is out of stock, you can sign up for a notification when it becomes available again." },
      { q: "Can I return a product?", a: "Absolutely. We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Contact our support team to initiate a return." },
    ],
  },
  {
    category: "Payments & Pricing",
    items: [
      { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), credit/debit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All online payments are securely processed." },
      { q: "Is Cash on Delivery available?", a: "Yes! Cash on Delivery (COD) is our most popular payment method. You pay in cash when your order arrives at your doorstep. No advance payment required." },
      { q: "Do you offer discounts for bulk orders?", a: "Yes, we offer special pricing for bulk orders of 10+ items. Contact our sales team at bulk@laventerprise.com for a custom quote." },
      { q: "How do I apply a coupon code?", a: "Enter your coupon code in the cart page or checkout page in the 'Coupon Code' field. The discount will be applied to your order total automatically." },
    ],
  },
  {
    category: "Account & Security",
    items: [
      { q: "How do I create an account?", a: "Click 'Create Account' in the top navigation bar. Fill in your name, email, and password. You'll receive a confirmation email and can start shopping immediately." },
      { q: "I forgot my password. How do I reset it?", a: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a password reset link." },
      { q: "Is my personal information secure?", a: "We take security seriously. All data is encrypted using SSL/TLS, and we never share your personal information with third parties. We comply with all applicable data protection regulations." },
      { q: "Can I have multiple shipping addresses?", a: "Yes! You can save multiple addresses in your account dashboard under 'Addresses'. Select your preferred address at checkout." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="font-medium text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQs = faqs
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const displayedFAQs = activeCategory ? filteredFAQs.filter((c) => c.category === activeCategory) : filteredFAQs;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-primary/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Find answers to common questions about orders, products, and more.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="bg-primary hover:bg-primary/90"
            >
              All
            </Button>
            {faqs.map((cat) => (
              <Button
                key={cat.category}
                variant={activeCategory === cat.category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              >
                {cat.category}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          {displayedFAQs.map((cat) => (
            <div key={cat.category} className="mb-8">
              <h2 className="text-xl font-bold mb-2">{cat.category}</h2>
              <div className="bg-card rounded-xl border p-4 md:p-6">
                {cat.items.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {displayedFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No questions found matching &quot;{search}&quot;</p>
              <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
            </div>
          )}

          {/* Still need help */}
          <div className="mt-12 bg-primary/10 rounded-xl p-8 text-center border border-primary/20">
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">Our support team is here to help you with anything.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
