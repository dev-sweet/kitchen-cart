import Image from "next/image";
import Link from "next/link";
import { ChefHat, Heart, Truck, Shield, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About KitchenCart</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe every kitchen deserves the best tools. Founded in 2020, KitchenCart has been on a mission to bring premium kitchen products to home cooks and professional chefs at accessible prices.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop" alt="Our kitchen" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>KitchenCart was born from a simple observation: great cooking starts with great tools. Our founder, a passionate home cook, struggled to find quality kitchen products without breaking the bank.</p>
                <p>Today, we curate a collection of over 500 products across 10 categories — from professional-grade knives to artisan baking tools. Every item is tested, reviewed, and approved by our team of culinary experts.</p>
                <p>We partner directly with manufacturers to cut out middlemen, ensuring you get the best products at the most competitive prices. Our commitment to quality means we stand behind every product we sell.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ChefHat, title: "Quality First", desc: "Every product is tested and approved by our culinary team before it reaches your kitchen." },
              { icon: Heart, title: "Customer Love", desc: "Our customers are family. We provide exceptional support and hassle-free returns." },
              { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders over $50 with fast, reliable delivery to your doorstep." },
              { icon: Shield, title: "Secure Shopping", desc: "Your data is protected with industry-standard encryption and secure payment processing." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-xl p-6 text-center border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "500+", label: "Products" },
              { value: "10", label: "Categories" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Founder & CEO", img: "1556909114-f6e7ad7d3136" },
              { name: "James Miller", role: "Head of Product", img: "1507003211169-0a1dd7228f2d" },
              { name: "Emily Rodriguez", role: "Customer Experience", img: "1573497019940-1c28c88b4f3e" },
            ].map((m) => (
              <div key={m.name} className="bg-card rounded-xl p-6 border">
                <div className="h-24 w-24 rounded-full mx-auto mb-4 overflow-hidden relative bg-muted">
                  <Image src={`https://images.unsplash.com/photo-${m.img}?w=200&h=200&fit=crop&crop=face`} alt={m.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to Upgrade Your Kitchen?</h2>
          <p className="text-muted-foreground mb-6">Browse our collection of premium kitchen products and find exactly what you need.</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
