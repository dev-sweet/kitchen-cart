import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-primary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-neutral">
          <h2 className="text-xl font-bold mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We collect personal information that you provide when registering, placing orders, or contacting us. This includes your name, email address, shipping address, phone number, and payment information.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We use your information to process orders, communicate about your purchases, improve our services, send promotional communications (with your consent), and comply with legal obligations.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">3. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We implement industry-standard security measures to protect your personal data. All transactions are encrypted using SSL/TLS technology. We never store your full credit card information on our servers.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">4. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookies through your browser settings.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">5. Third-Party Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We do not sell or rent your personal information. We may share data with trusted service providers who assist in operating our website and fulfilling orders (e.g., shipping carriers, payment processors).</p>

          <h2 className="text-xl font-bold mt-8 mb-3">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">You have the right to access, correct, or delete your personal data. You can manage your account information through your dashboard or contact us directly.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">7. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>

          <h2 className="text-xl font-bold mt-8 mb-3">8. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">If you have any questions about our privacy practices, contact us at privacy@laventerprise.com or through our contact page.</p>
        </div>
      </section>
    </div>
  );
}
