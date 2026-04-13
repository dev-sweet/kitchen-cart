import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral">
          <h2 className="text-xl font-bold mt-8 mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">By accessing and using KitchenCart, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our website or services.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">2. Account Registration</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">3. Products and Pricing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">All product descriptions and prices are subject to change without notice. We make every effort to ensure accuracy, but we reserve the right to correct errors. Prices are displayed in USD.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">4. Orders and Payment</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">By placing an order, you agree to pay the total amount including product prices, shipping, and applicable taxes. We accept Cash on Delivery, credit/debit cards, and other payment methods as displayed at checkout.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">5. Shipping and Delivery</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We ship to addresses within the United States. Standard delivery takes 3-5 business days. Free shipping is available on orders over $50. Risk of loss transfers to you upon delivery.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">6. Returns and Refunds</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We offer a 30-day return policy for unused items in original packaging. Refunds are processed within 5-10 business days. Damaged items are eligible for immediate replacement or refund.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">7. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">All content on KitchenCart, including text, images, logos, and design, is our intellectual property or used with permission. You may not reproduce or distribute any content without written consent.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">KitchenCart is not liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid by you for the product.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">For questions about these terms, contact us at legal@kitchencart.com or through our contact page.</p>
        </div>
      </section>
    </div>
  );
}
