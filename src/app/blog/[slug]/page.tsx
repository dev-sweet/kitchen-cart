"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, ArrowRight, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const allPosts: BlogPost[] = [
  {
    slug: "10-essential-baking-tools-every-home-baker-needs",
    title: "10 Essential Baking Tools Every Home Baker Needs",
    excerpt: "From measuring cups to silicone mats, discover the must-have tools that will transform your baking game and help you create professional-quality treats at home.",
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
Both rubber spatulas for folding and metal spatulas for removing cookies from trays are essential. Silicone spatulas are heat-resistant and won't melt.`,
  },
  {
    slug: "complete-guide-kitchen-knives",
    title: "The Complete Guide to Kitchen Knives: Choosing the Right Blade",
    excerpt: "Understanding the different types of kitchen knives and their uses. Learn which blades are essential for your kitchen and how to maintain them.",
    image: "1593618998160-e34014e67546",
    author: "James Miller",
    date: "January 10, 2025",
    readTime: "7 min read",
    category: "Cutlery",
    content: `A good knife is the most important tool in any kitchen. Whether you're a beginner or a seasoned chef, understanding the different types of knives and their purposes will transform your cooking experience.

## The Essential Three
Every kitchen needs at minimum three knives: a chef's knife, a paring knife, and a serrated knife. These three cover 95% of all cutting tasks.

## Chef's Knife (8-10 inches)
The workhorse of the kitchen. Use it for chopping vegetables, slicing meat, mincing herbs, and dicing onions. The broad blade and curved edge allow for a rocking motion that makes quick work of most ingredients.

## Paring Knife (3-4 inches)
Small but mighty. Perfect for peeling fruits, deveining shrimp, trimming fat, and any detailed precision work. Keep it sharp for the best results.

## Serrated Knife (8-10 inches)
Essential for bread, tomatoes, and delicate cakes. The serrated edge grips and cuts through items with hard exteriors and soft interiors without crushing them.

## Bonus Knives Worth Having
- **Santoku Knife**: The Japanese equivalent of a chef's knife, excellent for thin, precise cuts
- **Boning Knife**: Flexible blade perfect for separating meat from bone
- **Utility Knife**: Mid-sized knife for tasks too big for paring but too small for a chef's knife

## Knife Care Tips
Always hand wash your knives, never put them in the dishwasher. Use a wooden or plastic cutting board — glass and stone will dull the blade. Store knives in a block or on a magnetic strip, not loose in a drawer. Sharpen regularly with a whetstone or honing rod.`,
  },
  {
    slug: "air-fryer-vs-oven-which-is-better",
    title: "Air Fryer vs. Oven: Which Is Better for Your Kitchen?",
    excerpt: "We compare air fryers and traditional ovens across cooking performance, energy efficiency, convenience, and versatility to help you decide.",
    image: "1556909114-44e3e70034e2",
    author: "Emily Rodriguez",
    date: "January 5, 2025",
    readTime: "6 min read",
    category: "Electronics",
    content: `The air fryer has taken kitchens by storm, but is it really better than a traditional oven? Let's break down the pros and cons of each to help you make the right choice for your cooking needs.

## What Is an Air Fryer?
An air fryer is essentially a compact convection oven. It uses rapidly circulating hot air to cook food, producing a crispy exterior similar to deep frying but with significantly less oil.

## Cooking Performance
**Air Fryer**: Excels at crispy, fried-style foods — fries, chicken wings, mozzarella sticks, and reheated leftovers. The compact space creates intense, focused heat.

**Oven**: Better for large items, roasts, casseroles, baking, and anything requiring gentle, even heat. More precise temperature control.

## Energy Efficiency
**Air Fryer wins here.** It preheats in 2-3 minutes (vs. 10-15 for an oven) and uses about 50-75% less energy due to its smaller size. Perfect for quick weeknight meals.

## Capacity
**Oven**: Can handle full meals — sheet pan dinners, large roasts, multiple dishes at once.
**Air Fryer**: Limited capacity (usually 4-8 quarts). Best for 1-2 servings or side dishes.

## Convenience
**Air Fryer**: Faster preheating, easier cleanup (most parts are dishwasher safe), and countertop accessibility.
**Oven**: More versatile, larger capacity, and built into your kitchen.

## The Verdict
If you're cooking for 1-2 people and love crispy foods, an air fryer is a great addition. For families and versatile cooking, your oven remains essential. The ideal setup? Have both!`,
  },
  {
    slug: "organize-your-kitchen-like-a-pro",
    title: "How to Organize Your Kitchen Like a Professional Chef",
    excerpt: "Expert tips and product recommendations for creating a perfectly organized kitchen that maximizes efficiency and minimizes clutter.",
    image: "1556909172-54557c7e4fb7",
    author: "Sarah Chen",
    date: "December 28, 2024",
    readTime: "8 min read",
    category: "Storage",
    content: `Professional chefs know that an organized kitchen isn't just about aesthetics — it's about efficiency, safety, and enjoyment. Here's how to transform your kitchen into a well-oiled cooking machine.

## The Golden Triangle
Arrange your three most-used work areas — sink, stove, and refrigerator — in a triangle formation. This minimizes unnecessary movement and speeds up your cooking workflow.

## Zone Your Kitchen
Divide your kitchen into functional zones:
- **Prep Zone**: Cutting boards, knives, mixing bowls near counter space
- **Cooking Zone**: Pots, pans, utensils near the stove
- **Storage Zone**: Dry goods, spices, canned items in easy-to-reach cabinets
- **Cleaning Zone**: Dish soap, sponges, drying rack near the sink

## Vertical Storage Solutions
Use wall-mounted magnetic strips for knives, pegboards for utensils, and floating shelves for frequently used items. This frees up counter space and keeps essentials within arm's reach.

## Drawer Dividers Are Non-Negotiable
Invest in quality drawer dividers for your utensil drawers. Group items by function — cooking utensils, baking tools, measuring equipment — and assign each group its own section.

## Container Consistency
Use uniform, stackable containers for dry goods storage. Clear containers let you see what's inside, and standardized sizes stack neatly. Label everything for quick identification.

## The One-In, One-Out Rule
For every new kitchen item you bring in, remove an old one. This prevents accumulation and ensures you only keep tools you actually use.

## Maintenance
Spend 10 minutes at the end of each cooking session wiping surfaces and returning items to their designated spots. This daily habit prevents clutter from building up.`,
  },
  {
    slug: "coffee-brewing-methods-explained",
    title: "Coffee Brewing Methods Explained: From French Press to Espresso",
    excerpt: "Explore the most popular coffee brewing methods, their unique characteristics, and the equipment you need to brew the perfect cup every morning.",
    image: "1495474472287-4d71bcdd2085",
    author: "James Miller",
    date: "December 20, 2024",
    readTime: "6 min read",
    category: "Coffee & Tea",
    content: `The way you brew your coffee has a bigger impact on flavor than the beans themselves. Let's explore the most popular brewing methods and help you find your perfect cup.

## French Press
The classic immersion method. Coarsely ground coffee steeps in hot water for 4 minutes, then a metal filter presses the grounds to the bottom. The result is a full-bodied, rich cup with natural oils intact.

**Best for**: Those who enjoy bold, full-bodied coffee with minimal equipment.

## Pour Over
Hot water is poured in a slow, circular motion over medium-fine grounds in a paper filter. The result is a clean, nuanced cup that highlights the coffee's subtle flavors.

**Best for**: Coffee enthusiasts who appreciate delicate flavor notes and the ritual of brewing.

## Espresso
Finely ground coffee is tamped and hot water is forced through at high pressure. Produces a concentrated shot with a rich crema on top. The foundation for lattes, cappuccinos, and more.

**Best for**: Those who love strong coffee and milk-based drinks.

## AeroPress
A versatile method combining immersion and pressure. Grounds steep briefly, then air pressure forces the coffee through a paper filter. Quick, portable, and produces a smooth cup.

**Best for**: Travelers, campers, and anyone who wants great coffee in under 3 minutes.

## Cold Brew
Coarse grounds steep in cold water for 12-24 hours, then are filtered. The result is a smooth, low-acid concentrate that can be stored for up to two weeks.

**Best for**: Hot summer days and those sensitive to coffee acidity.

## Key Tips for Great Coffee
- Use filtered water
- Grind fresh just before brewing
- Use the right water temperature (195-205°F)
- Measure your coffee and water precisely
- Clean your equipment regularly`,
  },
  {
    slug: "best-cookware-materials-compared",
    title: "Stainless Steel vs Cast Iron vs Ceramic: Best Cookware Materials",
    excerpt: "A comprehensive comparison of the most popular cookware materials. Learn the pros and cons of each to make the best choice for your cooking style.",
    image: "1584568694244-14fbdf83bd30",
    author: "Emily Rodriguez",
    date: "December 15, 2024",
    readTime: "7 min read",
    category: "Cookware",
    content: `Choosing the right cookware material can dramatically improve your cooking results. Each material has unique properties that make it better suited for certain tasks. Here's our comprehensive guide.

## Stainless Steel
The workhorse of professional kitchens. Tri-ply stainless steel (aluminum core sandwiched between steel layers) offers excellent heat distribution and a non-reactive cooking surface.

**Pros**: Durable, non-reactive, dishwasher safe, works on all heat sources
**Cons**: Poor heat conductor on its own, food can stick without proper technique
**Best for**: Searing, sautéing, sauces, and everyday cooking

## Cast Iron
Beloved for its exceptional heat retention and natural non-stick properties when properly seasoned. A well-maintained cast iron pan can last generations.

**Pros**: Excellent heat retention, naturally non-stick when seasoned, oven-safe to very high temps, affordable
**Cons**: Heavy, requires seasoning, not dishwasher safe, can react with acidic foods
**Best for**: Searing, frying, baking (cornbread!), and camping

## Ceramic Non-Stick
Modern ceramic coatings offer a chemical-free non-stick surface. They heat up quickly and release food easily, but the coating has a shorter lifespan than traditional materials.

**Pros**: Non-stick without chemicals, easy to clean, colorful designs
**Cons**: Less durable coating, not suitable for high-heat searing, shorter lifespan
**Best for**: Eggs, delicate fish, pancakes, and low-fat cooking

## Carbon Steel
The darling of restaurant kitchens. Similar to cast iron but lighter and smoother. Develops a natural non-stick patina with use.

**Pros**: Lightweight, excellent heat retention, gets better with age, responsive to temperature changes
**Cons**: Requires seasoning, can be reactive with acidic foods
**Best for**: Stir-frying, searing, and high-heat cooking

## The Bottom Line
A well-equipped kitchen benefits from having multiple materials. Start with a good stainless steel set, add a cast iron skillet for searing, and include a non-stick pan for eggs and delicate foods.`,
  },
];

function NotFoundState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <ChefHat className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Post Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild className="mt-2 bg-primary hover:bg-primary/90">
        <Link href="/blog">Back to Blog</Link>
      </Button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-4 w-24 mb-8" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-80 mb-6" />
      <div className="flex gap-4 mb-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-64 md:h-96 w-full rounded-2xl mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = useMemo(() => allPosts.find((p) => p.slug === slug) || null, [slug]);

  if (!post) return <NotFoundState />;

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />Back to Blog
        </Link>

        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
          {post.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">{post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
        </div>

        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <Image
            src={`https://images.unsplash.com/photo-${post.image}?w=1200&h=600&fit=crop`}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-neutral max-w-none">
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{para.replace("## ", "")}</h2>;
            }
            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="list-disc pl-6 mb-4 space-y-1">
                  {para.split("\n").map((line, j) => (
                    <li key={j} className="text-muted-foreground leading-relaxed">
                      {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>;
          })}
        </div>

        <Separator className="my-10" />

        {/* Navigation */}
        <div className="grid sm:grid-cols-2 gap-4">
          {prevPost && (
            <Link href={`/blog/${prevPost.slug}`} className="group block p-4 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <ArrowLeft className="h-3 w-3" />Previous Post
              </div>
              <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{prevPost.title}</p>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="group block p-4 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all sm:text-right sm:ml-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 sm:justify-end">
                Next Post<ArrowRight className="h-3 w-3" />
              </div>
              <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{nextPost.title}</p>
            </Link>
          )}
        </div>

        {/* CTA */}
        <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/20 mt-10">
          <p className="font-semibold mb-2">Ready to upgrade your kitchen tools?</p>
          <p className="text-sm text-muted-foreground mb-4">Browse our collection of premium kitchen essentials.</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/shop">Shop Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
