import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const posts: Record<string, {
  title: string; excerpt: string; content: string; image: string; author: string; date: string; readTime: string; category: string;
}> = {
  "10-essential-baking-tools-every-home-baker-needs": {
    title: "10 Essential Baking Tools Every Home Baker Needs",
    excerpt: "From measuring cups to silicone mats, discover the must-have tools that will transform your baking game.",
    image: "1486427944544-d2c246c4df8e",
    author: "Sarah Chen",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Baking",
    content: `Baking is both an art and a science. Having the right tools can make the difference between a frustrating experience and a joyful one. Here are the 10 essential baking tools every home baker needs in their kitchen.

## 1. Measuring Cups and Spoons
Precision is key in baking. Invest in a good set of stainless steel measuring cups and spoons with engraved markings that won't fade over time. Look for sets that include odd sizes like 2/3 cup and 1.5 tablespoons.

## 2. Silicone Baking Mats
These reusable, non-stick mats replace parchment paper and cooking sprays. They provide even heat distribution and ensure your cookies, pastries, and roasted vegetables slide right off without sticking.

## 3. Stand Mixer
A stand mixer is the ultimate baking investment. It handles everything from whipping cream to kneading bread dough. The 6-quart size is versatile enough for most home bakers.

## 4. Rolling Pin
A good rolling pin is essential for pies, cookies, and pastries. Choose one with comfortable handles and a non-stick surface. French-style rolling pins (without handles) offer more control.

## 5. Digital Kitchen Scale
For the most accurate results, weigh your ingredients. A digital scale accurate to 0.1 grams takes the guesswork out of baking and ensures consistent results every time.

## 6. Piping Bags and Tips
Elevate your cake and cupcake decorating with a set of piping bags and tips. Start with basic round and star tips, then expand your collection as you develop your skills.

## 7. Cooling Racks
Proper cooling is crucial for baked goods. Wire cooling racks allow air to circulate underneath, preventing sogginess. Stackable racks save space.

## 8. Oven Thermometer
Most ovens are off by 10-25 degrees. An oven thermometer ensures you're baking at the correct temperature, which is critical for success.

## 9. Cookie Cutters
A set of basic cookie cutters in various shapes adds fun to baking. Look for stainless steel cutters with sharp edges for clean cuts.

## 10. Spatulas
Both rubber spatulas for folding and metal spatulas for removing cookies from trays are essential. Silicone spatulas are heat-resistant and won't melt.

## Getting Started
Start with the basics and add specialty tools as your skills grow. Remember, even professional bakers started with just a few essential tools. The key is to practice and have fun!`,
  },
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // For static pages, we render all possible slugs
  // This is a simplified approach - in production you'd fetch from a CMS
  return <BlogPostContent />;
}

function BlogPostContent() {
  const post = posts["10-essential-baking-tools-every-home-baker-needs"];
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />Back to Blog
        </Link>

        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">{post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
        </div>

        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image src={`https://images.unsplash.com/photo-${post.image}?w=1200&h=600&fit=crop`} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-neutral max-w-none">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{para.replace("## ", "")}</h2>;
            }
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>;
          })}
        </div>

        <Separator className="my-8" />

        {/* CTA */}
        <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
          <p className="font-semibold mb-2">Ready to upgrade your baking tools?</p>
          <p className="text-sm text-muted-foreground mb-4">Browse our collection of premium baking essentials.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/shop?category=baking-tools">Shop Baking Tools <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
