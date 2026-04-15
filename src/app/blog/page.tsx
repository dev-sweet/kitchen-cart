import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, ChefHat } from "lucide-react";

const blogPosts = [
  {
    slug: "10-essential-baking-tools-every-home-baker-needs",
    title: "10 Essential Baking Tools Every Home Baker Needs",
    excerpt: "From measuring cups to silicone mats, discover the must-have tools that will transform your baking game and help you create professional-quality treats at home.",
    image: "1709837167684-47d7ccf0ed89",
    author: "Sarah Chen",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Baking",
  },
  {
    slug: "complete-guide-kitchen-knives",
    title: "The Complete Guide to Kitchen Knives: Choosing the Right Blade",
    excerpt: "Understanding the different types of kitchen knives and their uses. Learn which blades are essential for your kitchen and how to maintain them.",
    image: "1593618998160-e34014e67546",
    author: "James Miller",
    date: "Jan 10, 2025",
    readTime: "7 min read",
    category: "Cutlery",
  },
  {
    slug: "air-fryer-vs-oven-which-is-better",
    title: "Air Fryer vs. Oven: Which Is Better for Your Kitchen?",
    excerpt: "We compare air fryers and traditional ovens across cooking performance, energy efficiency, convenience, and versatility to help you decide.",
    image: "1556909114-44e3e70034e2",
    author: "Emily Rodriguez",
    date: "Jan 5, 2025",
    readTime: "6 min read",
    category: "Electronics",
  },
  {
    slug: "organize-your-kitchen-like-a-pro",
    title: "How to Organize Your Kitchen Like a Professional Chef",
    excerpt: "Expert tips and product recommendations for creating a perfectly organized kitchen that maximizes efficiency and minimizes clutter.",
    image: "1556909172-54557c7e4fb7",
    author: "Sarah Chen",
    date: "Dec 28, 2024",
    readTime: "8 min read",
    category: "Storage",
  },
  {
    slug: "coffee-brewing-methods-explained",
    title: "Coffee Brewing Methods Explained: From French Press to Espresso",
    excerpt: "Explore the most popular coffee brewing methods, their unique characteristics, and the equipment you need to brew the perfect cup every morning.",
    image: "1495474472287-4d71bcdd2085",
    author: "James Miller",
    date: "Dec 20, 2024",
    readTime: "6 min read",
    category: "Coffee & Tea",
  },
  {
    slug: "best-cookware-materials-compared",
    title: "Stainless Steel vs Cast Iron vs Ceramic: Best Cookware Materials",
    excerpt: "A comprehensive comparison of the most popular cookware materials. Learn the pros and cons of each to make the best choice for your cooking style.",
    image: "1584568694244-14fbdf83bd30",
    author: "Emily Rodriguez",
    date: "Dec 15, 2024",
    readTime: "7 min read",
    category: "Cookware",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-primary/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ChefHat className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">KitchenCart Blog</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Recipes, tips, guides, and inspiration for your kitchen adventures.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          <div className="mb-12">
            <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
                <div className="relative h-64 md:h-auto">
                  <Image src={`https://images.unsplash.com/photo-${blogPosts[0].image}?w=800&h=500&fit=crop`} alt={blogPosts[0].title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{blogPosts[0].category}</span>
                  <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">{blogPosts[0].title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{blogPosts[0].author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{blogPosts[0].date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{blogPosts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Post Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image src={`https://images.unsplash.com/photo-${post.image}?w=600&h=400&fit=crop`} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
