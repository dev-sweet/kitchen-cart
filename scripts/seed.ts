import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────
const categories = [
  {
    name: "Baking Tools",
    slug: "baking-tools",
    description:
      "Everything you need to bake like a pro, from precision measuring tools to specialty bakeware.",
    icon: "Cake",
    bannerImage:
      "https://images.unsplash.com/photo-1486427944544-d2c246c4df8e?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Kitchen Tools & Gadgets",
    slug: "kitchen-tools-gadgets",
    description:
      "Smart gadgets and essential tools that make cooking faster, easier, and more enjoyable.",
    icon: "Wrench",
    bannerImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Kitchen Electronics",
    slug: "kitchen-electronics",
    description:
      "Modern kitchen appliances and electronics designed to streamline your cooking experience.",
    icon: "Zap",
    bannerImage:
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Kitchen Storage",
    slug: "kitchen-storage",
    description:
      "Keep your kitchen organized with our range of containers, racks, and storage solutions.",
    icon: "Archive",
    bannerImage:
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=400&fit=crop",
    featured: false,
  },
  {
    name: "Aprons & Hats",
    slug: "aprons-hats",
    description:
      "Professional-grade aprons and chef hats for home cooks and culinary enthusiasts alike.",
    icon: "User",
    bannerImage:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=400&fit=crop",
    featured: false,
  },
  {
    name: "Cookware & Bakeware",
    slug: "cookware-bakeware",
    description:
      "Premium pots, pans, and bakeware built for performance, durability, and even heat distribution.",
    icon: "Flame",
    bannerImage:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Cutlery & Knives",
    slug: "cutlery-knives",
    description:
      "Precision-crafted knives and cutlery sets for effortless slicing, dicing, and presentation.",
    icon: "UtensilsCrossed",
    bannerImage:
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Dining & Serving",
    slug: "dining-serving",
    description:
      "Elegant dinnerware, serveware, and table accessories to elevate every mealtime occasion.",
    icon: "Wine",
    bannerImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop",
    featured: false,
  },
  {
    name: "Coffee & Tea",
    slug: "coffee-tea",
    description:
      "From French presses to espresso machines, find everything to brew your perfect cup.",
    icon: "Coffee",
    bannerImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=400&fit=crop",
    featured: true,
  },
  {
    name: "Cleaning & Care",
    slug: "cleaning-care",
    description:
      "Essential cleaning supplies and care products to keep your kitchen spotless and hygienic.",
    icon: "Sparkles",
    bannerImage:
      "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=1200&h=400&fit=crop",
    featured: false,
  },
];

// ──────────────────────────────────────────────
// Products (8 per category = 80 total)
// ──────────────────────────────────────────────
// Helper: 3 image URLs per product
const img = (ids: [string, string, string]) =>
  ids.map(
    (id) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop`
  );

const products = [
  // ── Baking Tools (8 products) ──
  {
    name: "Professional Silicone Baking Mat Set",
    slug: "professional-silicone-baking-mat-set",
    description:
      "This FDA-approved silicone baking mat set provides a non-stick surface for perfectly even baking every time. The set includes two half-sheet mats that fit standard ovens. Dishwasher-safe and reusable for thousands of uses, they eliminate the need for parchment paper and cooking sprays.",
    price: 19.99,
    comparePrice: 29.99,
    stock: 85,
    sku: "KC-BT-001",
    categoryId: "baking-tools",
    images: img([
      "1486427944544-d2c246c4df8e",
      "1558301211-0d8c8ddee6ec",
      "1509365390695-33aee754301f",
    ]),
    tags: ["silicone", "baking mat", "non-stick", "oven-safe", "reusable"],
    featured: true,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    name: "Premium Stainless Steel Measuring Cups",
    slug: "premium-stainless-steel-measuring-cups",
    description:
      "Crafted from heavy-duty 18/10 stainless steel, these measuring cups feature engraved markings that won't fade over time. The set of seven cups nests together for compact storage and includes a convenient ring clip. Their solid construction ensures accurate measurements for consistent baking results.",
    price: 24.99,
    comparePrice: 34.99,
    stock: 62,
    sku: "KC-BT-002",
    categoryId: "baking-tools",
    images: img([
      "1571091718767-18b5b1457add",
      "1585515320310-259814833e62",
      "1606890658213-1a73e0b4c558",
    ]),
    tags: ["stainless steel", "measuring cups", "kitchen essentials", "baking"],
    featured: true,
    rating: 4.8,
    reviewCount: 38,
  },
  {
    name: "Maple Wood Rolling Pin",
    slug: "maple-wood-rolling-pin",
    description:
      "Handcrafted from natural maple wood, this classic rolling pin features smooth, tapered handles for a comfortable grip. Its non-stick surface is naturally antimicrobial and easy to clean. Perfect for pie crusts, cookies, and pastries, the 12-inch barrel provides excellent coverage.",
    price: 18.95,
    comparePrice: null,
    stock: 45,
    sku: "KC-BT-003",
    categoryId: "baking-tools",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1558618666-fcd25c85f82e",
      "1558301211-0d8c8ddee6ec",
    ]),
    tags: ["maple wood", "rolling pin", "handcrafted", "baking essential"],
    featured: false,
    rating: 4.5,
    reviewCount: 27,
  },
  {
    name: "Decorative Cookie Cutter Set (24 Pieces)",
    slug: "decorative-cookie-cutter-set-24-pieces",
    description:
      "This comprehensive 24-piece cookie cutter set includes shapes for every season and occasion, from holidays to birthdays. Made from durable food-grade stainless steel with sharp edges for clean cuts. Each cutter features a comfortable grip top and nests neatly for space-saving storage.",
    price: 15.99,
    comparePrice: 22.99,
    stock: 93,
    sku: "KC-BT-004",
    categoryId: "baking-tools",
    images: img([
      "1486427944544-d2c246c4df8e",
      "1558301211-0d8c8ddee6ec",
      "1509365390695-33aee754301f",
    ]),
    tags: ["cookie cutter", "stainless steel", "baking shapes", "gift set"],
    featured: false,
    rating: 4.4,
    reviewCount: 31,
  },
  {
    name: "Adjustable Cake Leveler Tool",
    slug: "adjustable-cake-leveler-tool",
    description:
      "Create perfectly even cake layers every time with this adjustable cake leveler featuring a serrated stainless steel wire. The easy-grip handle and adjustable height guide make it simple to slice through cakes of any size. An essential tool for professional-looking layered cakes and tortes.",
    price: 12.99,
    comparePrice: 17.99,
    stock: 58,
    sku: "KC-BT-005",
    categoryId: "baking-tools",
    images: img([
      "1563729784474-d77dbb933a9e",
      "1486427944544-d2c246c4df8e",
      "1558301211-0d8c8ddee6ec",
    ]),
    tags: ["cake leveler", "baking tool", "cake decorating", "layer cakes"],
    featured: false,
    rating: 4.3,
    reviewCount: 19,
  },
  {
    name: "Digital Kitchen Scale (Ultra-Precise)",
    slug: "digital-kitchen-scale-ultra-precise",
    description:
      "Measure ingredients with precision using this ultra-thin digital kitchen scale accurate to 0.1g. The sleek tempered glass platform supports up to 11 pounds and features tare, unit conversion, and a backlit LCD display. Its compact design slips easily into any drawer when not in use.",
    price: 22.99,
    comparePrice: null,
    stock: 71,
    sku: "KC-BT-006",
    categoryId: "baking-tools",
    images: img([
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["digital scale", "kitchen scale", "precision", "baking tool"],
    featured: false,
    rating: 4.6,
    reviewCount: 45,
  },
  {
    name: "Piping Bags & Tips Decorating Kit (52 Pieces)",
    slug: "piping-bags-tips-decorating-kit-52-pieces",
    description:
      "Unleash your creativity with this complete cake and cupcake decorating set featuring 48 stainless steel tips, 3 reusable silicone piping bags, and a coupler. Each tip is numbered for easy identification and comes with a pattern guide. The included storage case keeps everything organized and accessible.",
    price: 29.99,
    comparePrice: 44.99,
    stock: 38,
    sku: "KC-BT-007",
    categoryId: "baking-tools",
    images: img([
      "1563729784474-d77dbb933a9e",
      "1486427944544-d2c246c4df8e",
      "1509365390695-33aee754301f",
    ]),
    tags: ["piping bags", "cake decorating", "frosting tips", "bakery tools"],
    featured: true,
    rating: 4.9,
    reviewCount: 50,
  },
  {
    name: "Oven Thermometer with Large Dial",
    slug: "oven-thermometer-with-large-dial",
    description:
      "Ensure your oven is at the right temperature with this easy-to-read oven thermometer featuring a 2-inch dial face. It accurately measures from 100°F to 600°F and can be hung or stood on an oven rack. Knowing your oven's true temperature is the secret to perfectly baked goods.",
    price: 9.99,
    comparePrice: 14.99,
    stock: 80,
    sku: "KC-BT-008",
    categoryId: "baking-tools",
    images: img([
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["oven thermometer", "temperature", "baking accuracy", "essential"],
    featured: false,
    rating: 4.2,
    reviewCount: 15,
  },

  // ── Kitchen Tools & Gadgets (8 products) ──
  {
    name: "Ergonomic Chef's Tongs Set (3 Pack)",
    slug: "ergonomic-chefs-tongs-set-3-pack",
    description:
      "This versatile set includes 9-inch, 12-inch, and 16-inch silicone-tipped tongs with scalloped heads for a secure grip on any food. The ergonomic handles feature a pull-ring locking mechanism for easy storage. Heat-resistant up to 480°F and completely dishwasher safe for effortless cleanup.",
    price: 18.99,
    comparePrice: 26.99,
    stock: 67,
    sku: "KC-TG-001",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["tongs", "silicone", "cooking tool", "kitchen essential", "set"],
    featured: true,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    name: "15-Piece Nylon Kitchen Utensil Set",
    slug: "15-piece-nylon-kitchen-utensil-set",
    description:
      "Equip your kitchen with this complete 15-piece utensil set including spatula, slotted spoon, ladle, whisk, and more. Each tool features a heat-resistant nylon head up to 410°F and a comfortable non-slip handle. The included stainless steel caddy keeps all your tools organized and within reach.",
    price: 34.99,
    comparePrice: 49.99,
    stock: 42,
    sku: "KC-TG-002",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["utensil set", "nylon", "heat-resistant", "cooking tools", "caddy"],
    featured: true,
    rating: 4.5,
    reviewCount: 28,
  },
  {
    name: "Vegetable Spiralizer (5-Blade)",
    slug: "vegetable-spiralizer-5-blade",
    description:
      "Transform vegetables into healthy noodles with this powerful 5-blade spiralizer that creates spaghetti, fettuccine, ribbon cuts, and more. The extra-strong suction base keeps it stable during use, and all blades are BPA-free and dishwasher safe. Perfect for zucchini noodles, sweet potato curls, and creative salads.",
    price: 29.99,
    comparePrice: null,
    stock: 55,
    sku: "KC-TG-003",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1590794056226-79ef3a8147e1",
      "1556909114-f6e7ad7d3136",
      "1584568694244-14fbdf83bd30",
    ]),
    tags: ["spiralizer", "vegetable noodles", "healthy cooking", "zucchini"],
    featured: false,
    rating: 4.3,
    reviewCount: 22,
  },
  {
    name: "Instant-Read Meat Thermometer",
    slug: "instant-read-meat-thermometer",
    description:
      "Get accurate temperature readings in just 3 seconds with this professional instant-read thermometer. The waterproof probe folds away for safe storage and the backlit display is easy to read in any lighting. With a range of -58°F to 572°F, it's perfect for grilling, baking, and candy making.",
    price: 14.99,
    comparePrice: 21.99,
    stock: 73,
    sku: "KC-TG-004",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1571091718767-18b5b1457add",
      "1585515320310-259814833e62",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["thermometer", "meat", "instant-read", "grilling", "cooking"],
    featured: false,
    rating: 4.7,
    reviewCount: 41,
  },
  {
    name: "Multifunctional Can Opener & Bottle Opener",
    slug: "multifunctional-can-opener-bottle-opener",
    description:
      "This sleek stainless steel can opener features an oversized turning knob for effortless operation and leaves smooth, safe edges on every can. The built-in bottle opener and pop-top lifter add extra convenience. Its ergonomic design fits comfortably in your hand and is dishwasher safe.",
    price: 11.99,
    comparePrice: null,
    stock: 90,
    sku: "KC-TG-005",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1556909114-f6e7ad7d3136",
      "1571091718767-18b5b1457add",
      "1585515320310-259814833e62",
    ]),
    tags: ["can opener", "bottle opener", "stainless steel", "kitchen gadget"],
    featured: false,
    rating: 4.1,
    reviewCount: 18,
  },
  {
    name: "Mandoline Slicer with Safety Gloves",
    slug: "mandoline-slicer-with-safety-gloves",
    description:
      "Create uniform slices, julienne strips, and waffle cuts with this adjustable mandoline featuring 30 blade settings. The included cut-resistant gloves and safety hand guard protect your fingers during use. Compact and foldable, it stores flat and includes a dedicated blade storage container.",
    price: 27.99,
    comparePrice: 39.99,
    stock: 36,
    sku: "KC-TG-006",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1590794056226-79ef3a8147e1",
      "1556909114-f6e7ad7d3136",
      "1584568694244-14fbdf83bd30",
    ]),
    tags: ["mandoline", "slicer", "julienne", "safety gloves", "food prep"],
    featured: false,
    rating: 4.4,
    reviewCount: 25,
  },
  {
    name: "Garlic Press with Cleaning Brush",
    slug: "garlic-press-with-cleaning-brush",
    description:
      "Crush garlic effortlessly with this heavy-duty garlic press made from premium zinc alloy with an ergonomic silicone handle. The large capacity chamber fits multiple cloves without peeling, and the built-in scraper removes crushed garlic easily. A bonus cleaning brush makes cleanup quick and thorough.",
    price: 13.99,
    comparePrice: 19.99,
    stock: 82,
    sku: "KC-TG-007",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1585515320310-259814833e62",
      "1556909114-f6e7ad7d3136",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["garlic press", "zinc alloy", "kitchen gadget", "garlic mincer"],
    featured: false,
    rating: 4.5,
    reviewCount: 33,
  },
  {
    name: "Collapsible Over-Sink Colander Set",
    slug: "collapsible-over-sink-colander-set",
    description:
      "Save kitchen space with this expandable over-sink colander that stretches to fit most sinks for hands-free rinsing and draining. Made from premium BPA-free silicone, it collapses flat to just 2 inches for easy storage. The set includes a large colander and a smaller bowl colander for versatile food prep.",
    price: 21.99,
    comparePrice: null,
    stock: 48,
    sku: "KC-TG-008",
    categoryId: "kitchen-tools-gadgets",
    images: img([
      "1556909114-f6e7ad7d3136",
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
    ]),
    tags: ["colander", "collapsible", "over-sink", "space-saving", "drainer"],
    featured: true,
    rating: 4.3,
    reviewCount: 20,
  },

  // ── Kitchen Electronics (8 products) ──
  {
    name: "Digital Air Fryer 5.8Qt",
    slug: "digital-air-fryer-5-8qt",
    description:
      "Cook crispy, delicious meals with up to 85% less fat using this powerful 1700W air fryer with a generous 5.8-quart capacity. The digital touchscreen offers 8 preset cooking functions and adjustable temperature from 180°F to 400°F. The non-stick basket is dishwasher safe and the sleek design complements any modern kitchen.",
    price: 89.99,
    comparePrice: 129.99,
    stock: 32,
    sku: "KC-EL-001",
    categoryId: "kitchen-electronics",
    images: img([
      "1556909114-44e3e70034e2",
      "1571091718767-18b5b1457add",
      "1584568694244-14fbdf83bd30",
    ]),
    tags: ["air fryer", "digital", "healthy cooking", "kitchen appliance"],
    featured: true,
    rating: 4.8,
    reviewCount: 48,
  },
  {
    name: "Professional Countertop Blender",
    slug: "professional-countertop-blender",
    description:
      "Blend smoothies, soups, and sauces to perfection with this 1200W professional blender featuring a 64-ounce Tritan container. The 6 stainless steel blades and variable speed dial give you complete control over texture and consistency. Its self-cleaning function makes maintenance a breeze after every use.",
    price: 74.99,
    comparePrice: 99.99,
    stock: 28,
    sku: "KC-EL-002",
    categoryId: "kitchen-electronics",
    images: img([
      "1571091718767-18b5b1457add",
      "1556909114-44e3e70034e2",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["blender", "smoothie", "professional", "kitchen appliance", "Tritan"],
    featured: true,
    rating: 4.6,
    reviewCount: 35,
  },
  {
    name: "Smart Stand Mixer 6-Quart",
    slug: "smart-stand-mixer-6-quart",
    description:
      "This versatile 6-quart stand mixer features a 500W motor with 10 speed settings and a smart timer for precise mixing control. It comes with a flat beater, dough hook, and wire whip for tackling any recipe. The tilt-head design provides easy access to the bowl and attachments are dishwasher safe.",
    price: 149.99,
    comparePrice: 199.99,
    stock: 15,
    sku: "KC-EL-003",
    categoryId: "kitchen-electronics",
    images: img([
      "1556909114-44e3e70034e2",
      "1584568694244-14fbdf83bd30",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["stand mixer", "smart", "6-quart", "baking", "kitchen appliance"],
    featured: true,
    rating: 4.9,
    reviewCount: 50,
  },
  {
    name: "Electric Kettle with Temperature Control",
    slug: "electric-kettle-with-temperature-control",
    description:
      "Boil water to the perfect temperature for any beverage with this 1500W electric kettle featuring 5 preset temperature settings. The double-wall stainless steel design keeps water hot longer while the exterior stays cool to the touch. A real-time LED display shows current temperature and the keep-warm function lasts up to 2 hours.",
    price: 59.99,
    comparePrice: 79.99,
    stock: 44,
    sku: "KC-EL-004",
    categoryId: "kitchen-electronics",
    images: img([
      "1585515320310-259814833e62",
      "1556909114-44e3e70034e2",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["electric kettle", "temperature control", "stainless steel", "LED"],
    featured: false,
    rating: 4.7,
    reviewCount: 37,
  },
  {
    name: "2-Slice Toaster with Wide Slots",
    slug: "2-slice-toaster-with-wide-slots",
    description:
      "Toast bread, bagels, and waffles to perfection with this 2-slice toaster featuring extra-wide 1.5-inch slots and 6 browning levels. The high-lift lever makes it easy to retrieve smaller items without burning your fingers. Its stainless steel housing and removable crumb tray combine style with practical cleanup.",
    price: 39.99,
    comparePrice: null,
    stock: 56,
    sku: "KC-EL-005",
    categoryId: "kitchen-electronics",
    images: img([
      "1556909114-44e3e70034e2",
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
    ]),
    tags: ["toaster", "wide slots", "stainless steel", "kitchen appliance"],
    featured: false,
    rating: 4.3,
    reviewCount: 22,
  },
  {
    name: "Multi-Cooker Pressure Cooker 8Qt",
    slug: "multi-cooker-pressure-cooker-8qt",
    description:
      "Replace 7 kitchen appliances with this 1000W multi-cooker that functions as a pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. The 8-quart capacity feeds up to 8 people with 15 one-touch smart programs for effortless cooking. Safety features include 10+ built-in mechanisms for worry-free operation.",
    price: 119.99,
    comparePrice: 169.99,
    stock: 20,
    sku: "KC-EL-006",
    categoryId: "kitchen-electronics",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1556909114-44e3e70034e2",
      "1571091718767-18b5b1457add",
    ]),
    tags: [
      "pressure cooker",
      "multi-cooker",
      "slow cooker",
      "rice cooker",
      "smart",
    ],
    featured: false,
    rating: 4.8,
    reviewCount: 44,
  },
  {
    name: "Hand Immersion Blender 500W",
    slug: "hand-immersion-blender-500w",
    description:
      "Blend directly in pots, pitchers, and bowls with this powerful 500W hand blender featuring a stainless steel shaft and 4-blade head. The variable speed trigger gives you precise control for everything from smooth purées to chunky salsas. Included attachments: whisk, chopper bowl, and a 20-ounce beaker for maximum versatility.",
    price: 34.99,
    comparePrice: 49.99,
    stock: 61,
    sku: "KC-EL-007",
    categoryId: "kitchen-electronics",
    images: img([
      "1571091718767-18b5b1457add",
      "1590794056226-79ef3a8147e1",
      "1556909114-44e3e70034e2",
    ]),
    tags: ["immersion blender", "hand blender", "stainless steel", "portable"],
    featured: false,
    rating: 4.4,
    reviewCount: 26,
  },
  {
    name: "Food Processor 12-Cup",
    slug: "food-processor-12-cup",
    description:
      "Tackle any food prep task with this 450W food processor featuring a generous 12-cup work bowl and multiple blade discs. Slice, shred, knead, and chop with the S-blade, reversible slicing disc, and shredding disc. The pulse function provides precise control and all removable parts are dishwasher safe for easy cleanup.",
    price: 69.99,
    comparePrice: null,
    stock: 30,
    sku: "KC-EL-008",
    categoryId: "kitchen-electronics",
    images: img([
      "1556909114-44e3e70034e2",
      "1584568694244-14fbdf83bd30",
      "1585515320310-259814833e62",
    ]),
    tags: ["food processor", "12-cup", "slicer", "shredder", "kitchen appliance"],
    featured: false,
    rating: 4.5,
    reviewCount: 29,
  },

  // ── Kitchen Storage (8 products) ──
  {
    name: "Airtight Glass Food Storage Set (14 Pieces)",
    slug: "airtight-glass-food-storage-set-14-pieces",
    description:
      "Keep your food fresher for longer with this 14-piece borosilicate glass storage set featuring snap-lock lids with silicone seals. Each container is oven-safe, microwave-safe, and freezer-safe for maximum versatility. The clear glass design lets you see contents at a glance and they nest together for efficient storage.",
    price: 42.99,
    comparePrice: 59.99,
    stock: 50,
    sku: "KC-ST-001",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1590794056226-79ef3a8147e1",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["glass storage", "airtight", "food containers", "borosilicate"],
    featured: true,
    rating: 4.7,
    reviewCount: 40,
  },
  {
    name: "Rotating Spice Rack Organizer (20 Jars)",
    slug: "rotating-spice-rack-organizer-20-jars",
    description:
      "This elegant rotating spice rack holds 20 pre-filled glass jars with a 360-degree stainless steel base for easy access. Each jar features a freshness seal and adjustable shaker lids with three settings: pour, sprinkle, and seal. The compact design fits neatly on any countertop or in a cabinet.",
    price: 38.99,
    comparePrice: 54.99,
    stock: 35,
    sku: "KC-ST-002",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1585515320310-259814833e62",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["spice rack", "rotating", "organizer", "glass jars", "countertop"],
    featured: true,
    rating: 4.5,
    reviewCount: 32,
  },
  {
    name: "Pantry Cabinet Organizer System",
    slug: "pantry-cabinet-organizer-system",
    description:
      "Transform cluttered cabinets into a model of organization with this modular pantry system featuring 5 stackable bins, 2 turntables, and shelf dividers. Made from durable clear acrylic, these organizers let you see everything at a glance while maximizing vertical space. Perfect for dry goods, canned items, and snacks.",
    price: 54.99,
    comparePrice: null,
    stock: 27,
    sku: "KC-ST-003",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1571091718767-18b5b1457add",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["pantry organizer", "cabinet organizer", "modular", "acrylic"],
    featured: false,
    rating: 4.3,
    reviewCount: 18,
  },
  {
    name: "Under-Cabinet Stemware Rack",
    slug: "under-cabinet-stemware-rack",
    description:
      "Showcase your wine glasses while freeing up shelf space with this solid wood under-cabinet stemware rack. The sleek design securely holds up to 8 glasses and mounts easily with included hardware. Its natural finish blends seamlessly with any kitchen décor and the inverted storage keeps glasses dust-free.",
    price: 24.99,
    comparePrice: 34.99,
    stock: 43,
    sku: "KC-ST-004",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
    ]),
    tags: ["stemware rack", "wine glass", "under-cabinet", "wood", "space-saving"],
    featured: false,
    rating: 4.4,
    reviewCount: 21,
  },
  {
    name: "Magnetic Knife Strip (18 Inch)",
    slug: "magnetic-knife-strip-18-inch",
    description:
      "Keep your knives sharp and accessible with this powerful magnetic knife strip made from brushed stainless steel. The strong neodymium magnets securely hold even heavy chef's knives without scratching the blades. Easy wall-mount installation and its sleek design adds a professional touch to any kitchen.",
    price: 16.99,
    comparePrice: null,
    stock: 68,
    sku: "KC-ST-005",
    categoryId: "kitchen-storage",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1556909172-54557c7e4fb7",
    ]),
    tags: ["knife strip", "magnetic", "stainless steel", "wall mount", "organizer"],
    featured: false,
    rating: 4.6,
    reviewCount: 30,
  },
  {
    name: "Cereal & Dry Food Dispenser Set",
    slug: "cereal-dry-food-dispenser-set",
    description:
      "Reduce waste and keep cereal, nuts, and candy fresh with this sleek stainless steel dispenser set featuring portion-control levers. Each container holds up to 17.5 ounces and the airtight seal preserves freshness for weeks. The transparent acrylic body lets you monitor supply levels and the scratch-resistant base protects your countertop.",
    price: 32.99,
    comparePrice: 44.99,
    stock: 33,
    sku: "KC-ST-006",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1571091718767-18b5b1457add",
      "1585515320310-259814833e62",
    ]),
    tags: ["cereal dispenser", "dry food", "portion control", "stainless steel"],
    featured: false,
    rating: 4.2,
    reviewCount: 16,
  },
  {
    name: "Expandable Kitchen Drawer Organizer",
    slug: "expandable-kitchen-drawer-organizer",
    description:
      "Custom-fit any drawer with this expandable bamboo organizer that adjusts from 17 to 22 inches in length. Multiple compartments of varying sizes hold utensils, gadgets, and cutlery in neat, accessible rows. The naturally antimicrobial bamboo resists moisture and stains for long-lasting beauty and function.",
    price: 19.99,
    comparePrice: 27.99,
    stock: 59,
    sku: "KC-ST-007",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1590794056226-79ef3a8147e1",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["drawer organizer", "bamboo", "expandable", "utensil tray"],
    featured: false,
    rating: 4.4,
    reviewCount: 24,
  },
  {
    name: "Over-Door Pantry Rack (5 Tiers)",
    slug: "over-door-pantry-rack-5-tiers",
    description:
      "Maximize pantry space with this over-the-door wire rack featuring 5 sturdy tiers that hold up to 40 pounds each. The adjustable brackets fit doors from 1.25 to 1.75 inches thick and the chrome finish resists rust. Each basket measures 8.5 inches deep — perfect for spices, canned goods, wraps, and snacks.",
    price: 28.99,
    comparePrice: null,
    stock: 37,
    sku: "KC-ST-008",
    categoryId: "kitchen-storage",
    images: img([
      "1556909172-54557c7e4fb7",
      "1585515320310-259814833e62",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["over-door rack", "pantry organizer", "wire rack", "space-saving"],
    featured: false,
    rating: 4.1,
    reviewCount: 13,
  },

  // ── Aprons & Hats (8 products) ──
  {
    name: "Classic Canvas Chef Apron (Charcoal)",
    slug: "classic-canvas-chef-apron-charcoal",
    description:
      "This heavy-duty canvas chef apron is built to last with reinforced stress points and double-stitched hems for maximum durability. The adjustable neck strap and long waist ties ensure a comfortable fit for any body type. Two deep front pockets provide ample space for tools and recipes, while the charcoal color hides stains beautifully.",
    price: 24.99,
    comparePrice: null,
    stock: 65,
    sku: "KC-AH-001",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1556909114-f6e7ad7d3136",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["chef apron", "canvas", "charcoal", "professional", "cooking"],
    featured: true,
    rating: 4.6,
    reviewCount: 28,
  },
  {
    name: "Cross-Back Leather Apron (Premium)",
    slug: "cross-back-leather-apron-premium",
    description:
      "Handcrafted from full-grain cowhide leather, this premium cross-back apron distributes weight evenly across your shoulders for all-day comfort. The adjustable straps feature antique brass hardware and the natural leather develops a beautiful patina over time. Deep pockets, a pen slot, and a towel loop keep all your essentials within reach.",
    price: 89.99,
    comparePrice: 119.99,
    stock: 18,
    sku: "KC-AH-002",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
    ]),
    tags: ["leather apron", "cross-back", "premium", "handcrafted", "grilling"],
    featured: true,
    rating: 4.9,
    reviewCount: 36,
  },
  {
    name: "Kids Baking Apron Set (Ages 4-10)",
    slug: "kids-baking-apron-set-ages-4-10",
    description:
      "Inspire young chefs with this adorable kids baking apron set featuring a fun cupcake print and matching chef hat. The water-resistant fabric is easy to wipe clean and the adjustable neck strap grows with your child. Includes a matching oven mitt and a wooden spatula for the complete junior chef experience.",
    price: 18.99,
    comparePrice: 24.99,
    stock: 44,
    sku: "KC-AH-003",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1590794056226-79ef3a8147e1",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["kids apron", "baking set", "chef hat", "children", "gift"],
    featured: false,
    rating: 4.7,
    reviewCount: 23,
  },
  {
    name: "Japanese-Style Linen Apron",
    slug: "japanese-style-linen-apron",
    description:
      "Embrace minimalist elegance with this Japanese-style cross-back linen apron in a natural oatmeal color. The pre-washed French linen is soft, breathable, and becomes more beautiful with every wash. Its wide-strap design eliminates neck strain and the deep side pocket is perfect for holding your phone or recipe cards.",
    price: 34.99,
    comparePrice: null,
    stock: 29,
    sku: "KC-AH-004",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
    ]),
    tags: ["linen apron", "Japanese style", "cross-back", "minimalist"],
    featured: false,
    rating: 4.5,
    reviewCount: 19,
  },
  {
    name: "Professional Toque Chef Hat",
    slug: "professional-toque-chef-hat",
    description:
      "Achieve a classic professional look with this 12-inch tall toque chef hat made from breathable cotton-polyester blend. The adjustable Velcro closure fits head sizes from 21 to 25 inches and the built-in sweatband keeps you cool during long shifts. Its traditional pleated design and crisp white color meet industry standards.",
    price: 12.99,
    comparePrice: null,
    stock: 55,
    sku: "KC-AH-005",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1590794056226-79ef3a8147e1",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["chef hat", "toque", "professional", "cotton", "cooking uniform"],
    featured: false,
    rating: 4.2,
    reviewCount: 15,
  },
  {
    name: "Denim Workshop Apron with Tool Pockets",
    slug: "denim-workshop-apron-with-tool-pockets",
    description:
      "Built for serious home cooks and grill masters, this heavyweight denim apron features reinforced leather detailing and 6 utility pockets. The cross-back leather straps prevent neck fatigue during long cooking sessions. The waxed cotton finish is water-resistant and develops a unique worn-in look over time.",
    price: 44.99,
    comparePrice: 59.99,
    stock: 22,
    sku: "KC-AH-006",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
    ]),
    tags: ["denim apron", "workshop", "leather", "grilling", "utility"],
    featured: false,
    rating: 4.7,
    reviewCount: 31,
  },
  {
    name: "Water-Resistant Server Apron",
    slug: "water-resistant-server-apron",
    description:
      "Designed for busy kitchens, this water-resistant server apron features a modern knee-length cut with two deep waist pockets. The quick-dry fabric repels spills and stains while remaining soft and comfortable for all-day wear. Available in a range of professional colors, it's machine washable and wrinkle-resistant for easy care.",
    price: 15.99,
    comparePrice: 21.99,
    stock: 70,
    sku: "KC-AH-007",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1590794056226-79ef3a8147e1",
      "1556909114-f6e7ad7d3136",
    ]),
    tags: ["server apron", "water-resistant", "restaurant", "kitchen uniform"],
    featured: false,
    rating: 4.3,
    reviewCount: 17,
  },
  {
    name: "Embroidered Floral Apron (Gift Set)",
    slug: "embroidered-floral-apron-gift-set",
    description:
      "This beautiful floral-embroidered apron comes in an elegant gift box, making it the perfect present for the home cook who loves style. The premium cotton fabric features delicate botanical embroidery and a coordinating ruffle trim. Matching oven mitts and pot holders are included in this thoughtfully curated gift set.",
    price: 29.99,
    comparePrice: 39.99,
    stock: 40,
    sku: "KC-AH-008",
    categoryId: "aprons-hats",
    images: img([
      "1556910103-1c02745aae4d",
      "1571091718767-18b5b1457add",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["floral apron", "embroidered", "gift set", "cotton", "home cooking"],
    featured: false,
    rating: 4.6,
    reviewCount: 26,
  },

  // ── Cookware & Bakeware (8 products) ──
  {
    name: "Non-Stick Ceramic Cookware Set (10 Pieces)",
    slug: "non-stick-ceramic-cookware-set-10-pieces",
    description:
      "Cook healthier meals with less oil using this 10-piece ceramic non-stick cookware set that's PTFE and PFOA free. The set includes 8-inch and 10-inch skillets, 1.5 and 2.5-quart saucepans, a 5-quart Dutch oven, and lids. The aluminum core provides rapid, even heating and the ergonomic handles stay cool to the touch.",
    price: 129.99,
    comparePrice: 179.99,
    stock: 25,
    sku: "KC-CW-001",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1556909114-44e3e70034e2",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["cookware set", "ceramic", "non-stick", "PFOA-free", "aluminum core"],
    featured: true,
    rating: 4.8,
    reviewCount: 47,
  },
  {
    name: "Enameled Cast Iron Dutch Oven (6Qt)",
    slug: "enameled-cast-iron-dutch-oven-6qt",
    description:
      "This classic enameled cast iron Dutch oven delivers superior heat retention and even cooking for stews, roasts, bread, and more. The interior enamel coating eliminates the need for seasoning and is resistant to chipping. Its self-basting lid traps moisture for tender, flavorful results every time.",
    price: 89.99,
    comparePrice: null,
    stock: 31,
    sku: "KC-CW-002",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1556909114-44e3e70034e2",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["Dutch oven", "cast iron", "enameled", "6-quart", "slow cooking"],
    featured: true,
    rating: 4.9,
    reviewCount: 50,
  },
  {
    name: "Stainless Steel Frying Pan (12 Inch)",
    slug: "stainless-steel-frying-pan-12-inch",
    description:
      "Sear, sauté, and deglaze like a professional with this 12-inch stainless steel frying pan featuring a 3-ply construction of stainless steel and aluminum. The riveted stainless handle stays cool on the stovetop and the pan is oven-safe up to 500°F. Compatible with all cooktops including induction, it delivers restaurant-quality results.",
    price: 49.99,
    comparePrice: 69.99,
    stock: 40,
    sku: "KC-CW-003",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1590794056226-79ef3a8147e1",
      "1585515320310-259814833e62",
    ]),
    tags: ["stainless steel", "frying pan", "12-inch", "induction", "professional"],
    featured: false,
    rating: 4.5,
    reviewCount: 33,
  },
  {
    name: "Carbon Steel Wok (14 Inch)",
    slug: "carbon-steel-wok-14-inch",
    description:
      "Master the art of stir-frying with this traditional 14-inch flat-bottom carbon steel wok that seasons naturally to develop a superior non-stick surface over time. The long wooden handle stays cool and provides a comfortable grip for tossing ingredients. Its lightweight design and responsive heat make it ideal for high-heat cooking.",
    price: 34.99,
    comparePrice: null,
    stock: 47,
    sku: "KC-CW-004",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1556909114-44e3e70034e2",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["carbon steel", "wok", "stir-fry", "14-inch", "seasoned"],
    featured: false,
    rating: 4.6,
    reviewCount: 25,
  },
  {
    name: "Stoneware Baking Sheet Set (3 Pieces)",
    slug: "stoneware-baking-sheet-set-3-pieces",
    description:
      "Bake cookies, roasts, and vegetables to perfection with this 3-piece stoneware baking sheet set in small, medium, and large sizes. The naturally non-stick surface requires no seasoning and distributes heat evenly for consistent results. The raised edges contain juices and the durable stoneware is microwave, oven, and dishwasher safe.",
    price: 44.99,
    comparePrice: 59.99,
    stock: 36,
    sku: "KC-CW-005",
    categoryId: "cookware-bakeware",
    images: img([
      "1486427944544-d2c246c4df8e",
      "1558301211-0d8c8ddee6ec",
      "1509365390695-33aee754301f",
    ]),
    tags: ["baking sheet", "stoneware", "non-stick", "oven-safe", "set"],
    featured: false,
    rating: 4.4,
    reviewCount: 21,
  },
  {
    name: "Copper-Clad Saucepan (3 Quart)",
    slug: "copper-clad-saucepan-3-quart",
    description:
      "Bring elegant performance to your stovetop with this 3-quart copper-clad saucepan featuring a responsive copper exterior bonded to stainless steel interior. The precise heat control is perfect for delicate sauces, custards, and reductions. The flared rim enables drip-free pouring and the riveted handle provides a secure, balanced grip.",
    price: 79.99,
    comparePrice: 109.99,
    stock: 19,
    sku: "KC-CW-006",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1571091718767-18b5b1457add",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["copper", "saucepan", "stainless steel", "premium", "heat control"],
    featured: false,
    rating: 4.7,
    reviewCount: 30,
  },
  {
    name: "Bundt Cake Pan (Non-Stick)",
    slug: "bundt-cake-pan-non-stick",
    description:
      "Create stunning cakes with this classic fluted bundt pan featuring a premium non-stick coating for effortless release. The heavy-duty carbon steel construction ensures even baking and the center tube promotes uniform heat circulation. Its 10-cup capacity is perfect for family-sized cakes and the elegant design needs minimal decoration.",
    price: 16.99,
    comparePrice: 24.99,
    stock: 52,
    sku: "KC-CW-007",
    categoryId: "cookware-bakeware",
    images: img([
      "1486427944544-d2c246c4df8e",
      "1509365390695-33aee754301f",
      "1558301211-0d8c8ddee6ec",
    ]),
    tags: ["bundt pan", "cake pan", "non-stick", "carbon steel", "baking"],
    featured: false,
    rating: 4.3,
    reviewCount: 16,
  },
  {
    name: "Grill Cast Iron Skillet (10 Inch)",
    slug: "grill-cast-iron-skillet-10-inch",
    description:
      "Get perfect grill marks indoors with this pre-seasoned cast iron grill skillet featuring raised ridges for authentic char patterns. The 10-inch size is ideal for steaks, burgers, vegetables, and paninis. Exceptional heat retention ensures restaurant-quality searing and the dual pour spouts make draining excess fat effortless.",
    price: 29.99,
    comparePrice: null,
    stock: 41,
    sku: "KC-CW-008",
    categoryId: "cookware-bakeware",
    images: img([
      "1584568694244-14fbdf83bd30",
      "1556909114-44e3e70034e2",
      "1585515320310-259814833e62",
    ]),
    tags: [
      "cast iron",
      "grill pan",
      "skillet",
      "pre-seasoned",
      "indoor grilling",
    ],
    featured: false,
    rating: 4.6,
    reviewCount: 38,
  },

  // ── Cutlery & Knives (8 products) ──
  {
    name: "Professional 8-Inch Chef's Knife",
    slug: "professional-8-inch-chefs-knife",
    description:
      "This precision-forged 8-inch chef's knife features a high-carbon German stainless steel blade with a 15-degree edge for effortless cutting through any ingredient. The ergonomic pakkawood handle provides superior balance and a comfortable, secure grip. A full tang construction ensures durability and the blade maintains its sharpness through years of daily use.",
    price: 59.99,
    comparePrice: 84.99,
    stock: 34,
    sku: "KC-CK-001",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1556909114-f6e7ad7d3136",
    ]),
    tags: [
      "chef knife",
      "German steel",
      "professional",
      "8-inch",
      "pakkawood handle",
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 50,
  },
  {
    name: "Japanese Damascus Knife Set (5 Pieces)",
    slug: "japanese-damascus-knife-set-5-pieces",
    description:
      "Experience the art of Japanese blade-making with this stunning 5-piece Damascus knife set featuring 67-layer VG-10 steel blades with a beautiful wave pattern. The set includes an 8-inch chef's knife, 7-inch santoku, 8-inch bread knife, 3.5-inch paring knife, and a 6-inch utility knife. Each knife comes with a protective sheath and the included magnetic block displays them beautifully.",
    price: 179.99,
    comparePrice: 249.99,
    stock: 12,
    sku: "KC-CK-002",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1585515320310-259814833e62",
    ]),
    tags: [
      "Damascus",
      "Japanese knives",
      "VG-10",
      "knife set",
      "premium",
      "laminated",
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 46,
  },
  {
    name: "Stainless Steel Santoku Knife (7 Inch)",
    slug: "stainless-steel-santoku-knife-7-inch",
    description:
      "This versatile 7-inch santoku knife excels at slicing, dicing, and mincing with its granton edge that reduces friction and prevents food from sticking. The ice-hardened German steel blade delivers exceptional sharpness and edge retention. The lightweight design and comfortable handle make it a go-to knife for everyday meal prep.",
    price: 39.99,
    comparePrice: 54.99,
    stock: 48,
    sku: "KC-CK-003",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["santoku", "Japanese", "7-inch", "granton edge", "German steel"],
    featured: false,
    rating: 4.6,
    reviewCount: 29,
  },
  {
    name: "Electric Knife Sharpener (3-Stage)",
    slug: "electric-knife-sharpener-3-stage",
    description:
      "Restore any dull knife to razor-sharp perfection with this 3-stage electric sharpener that creates a factory-quality 15-degree edge. The precision angle guides hold the blade at the optimal angle through coarse, fine, and polishing stages. Compatible with straight-edge and serrated knives, it works on both Western and Asian blade styles.",
    price: 44.99,
    comparePrice: null,
    stock: 37,
    sku: "KC-CK-004",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1556909114-f6e7ad7d3136",
    ]),
    tags: ["knife sharpener", "electric", "3-stage", "professional", "blade care"],
    featured: false,
    rating: 4.5,
    reviewCount: 35,
  },
  {
    name: "16-Piece Flatware Set (Service for 4)",
    slug: "16-piece-flatware-set-service-for-4",
    description:
      "Set a beautiful table with this 16-piece stainless steel flatware set featuring a modern tapered design with a mirror-polished finish. The set includes 4 dinner forks, 4 salad forks, 4 dinner knives, and 4 dinner spoons crafted from heavy-gauge 18/10 stainless steel. Dishwasher safe and resistant to rust, staining, and corrosion.",
    price: 49.99,
    comparePrice: 69.99,
    stock: 30,
    sku: "KC-CK-005",
    categoryId: "cutlery-knives",
    images: img([
      "1414235077428-338989a2e8c0",
      "1610701596007-11502861dcfa",
      "1593618998160-e34014e67546",
    ]),
    tags: ["flatware", "cutlery set", "stainless steel", "service for 4"],
    featured: false,
    rating: 4.4,
    reviewCount: 22,
  },
  {
    name: "Kitchen Shears (Multi-Purpose)",
    slug: "kitchen-shears-multi-purpose",
    description:
      "These heavy-duty kitchen shears feature two detachable stainless steel blades that double as a knife and bottle opener. The micro-serrated edge grips slippery materials and the built-in nutcracker between the handles adds extra functionality. Perfect for cutting herbs, trimming poultry, opening packaging, and countless other kitchen tasks.",
    price: 14.99,
    comparePrice: 19.99,
    stock: 64,
    sku: "KC-CK-006",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1585515320310-259814833e62",
    ]),
    tags: ["kitchen shears", "scissors", "multi-purpose", "stainless steel"],
    featured: false,
    rating: 4.7,
    reviewCount: 40,
  },
  {
    name: "Acacia Wood Magnetic Knife Block",
    slug: "acacia-wood-magnetic-knife-block",
    description:
      "Display your finest knives safely with this beautiful acacia wood magnetic knife block featuring two powerful magnetic bars. The natural wood grain and modern design complement any kitchen aesthetic while keeping blades accessible and protected from edge damage. The weighted base prevents tipping and accommodates knives of all sizes.",
    price: 34.99,
    comparePrice: null,
    stock: 25,
    sku: "KC-CK-007",
    categoryId: "cutlery-knives",
    images: img([
      "1610701596007-11502861dcfa",
      "1593618998160-e34014e67546",
      "1556909172-54557c7e4fb7",
    ]),
    tags: ["knife block", "magnetic", "acacia wood", "knife storage", "display"],
    featured: false,
    rating: 4.3,
    reviewCount: 18,
  },
  {
    name: "Bread Knife with Serrated Edge (10 Inch)",
    slug: "bread-knife-serrated-edge-10-inch",
    description:
      "Slice through crusty loaves, delicate cakes, and juicy tomatoes without squishing or tearing with this 10-inch serrated bread knife. The double-beveled serrations maintain their sharpness far longer than standard edges and cut smoothly through both hard crusts and soft interiors. The balanced handle provides excellent control for even, consistent slices.",
    price: 28.99,
    comparePrice: 39.99,
    stock: 42,
    sku: "KC-CK-008",
    categoryId: "cutlery-knives",
    images: img([
      "1593618998160-e34014e67546",
      "1610701596007-11502861dcfa",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["bread knife", "serrated", "10-inch", "slicing", "German steel"],
    featured: false,
    rating: 4.5,
    reviewCount: 27,
  },

  // ── Dining & Serving (8 products) ──
  {
    name: "Porcelain Dinner Set (16 Pieces)",
    slug: "porcelain-dinner-set-16-pieces",
    description:
      "Elevate your dining experience with this elegant 16-piece porcelain dinner set featuring a classic white finish with subtle embossed detailing. The set includes 4 dinner plates, 4 salad plates, 4 soup bowls, and 4 mugs, all microwave and dishwasher safe. The chip-resistant construction ensures years of beautiful everyday use.",
    price: 69.99,
    comparePrice: 99.99,
    stock: 26,
    sku: "KC-DS-001",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1504674900247-0877df9cc836",
      "1551218808-94e220e084d2",
    ]),
    tags: ["dinnerware", "porcelain", "16-piece", "microwave safe", "white"],
    featured: true,
    rating: 4.7,
    reviewCount: 43,
  },
  {
    name: "Acacia Wood Serving Board (Large)",
    slug: "acacia-wood-serving-board-large",
    description:
      "Present charcuterie, cheeses, appetizers, and more on this stunning large acacia wood serving board featuring a rich, natural grain pattern. The built-in handles make it easy to carry from kitchen to table and the deep juice groove catches liquids. Food-safe mineral oil finish protects the wood and enhances its natural beauty.",
    price: 34.99,
    comparePrice: null,
    stock: 39,
    sku: "KC-DS-002",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1556909114-f6e7ad7d3136",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["serving board", "acacia wood", "charcuterie", "cheese board"],
    featured: true,
    rating: 4.6,
    reviewCount: 31,
  },
  {
    name: "Crystal Wine Glass Set (6 Pieces)",
    slug: "crystal-wine-glass-set-6-pieces",
    description:
      "Savor every sip with these hand-crafted lead-free crystal wine glasses designed to enhance the aroma and flavor of your favorite wines. The ultra-thin rim and perfectly shaped bowl deliver an exceptional drinking experience. Each glass holds 22 ounces and the elegant stem provides a comfortable, balanced hold.",
    price: 54.99,
    comparePrice: 74.99,
    stock: 22,
    sku: "KC-DS-003",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1504674900247-0877df9cc836",
      "1551218808-94e220e084d2",
    ]),
    tags: ["wine glasses", "crystal", "lead-free", "set of 6", "elegant"],
    featured: false,
    rating: 4.8,
    reviewCount: 37,
  },
  {
    name: "Marble & Gold Cake Stand",
    slug: "marble-gold-cake-stand",
    description:
      "Showcase your baked creations in style on this luxurious white marble cake stand with a polished gold-finished rim. The genuine marble platform is 12 inches in diameter and features a weighted base for stability. Perfect for cakes, cupcakes, pastries, and tiered appetizer displays at any special occasion.",
    price: 42.99,
    comparePrice: null,
    stock: 17,
    sku: "KC-DS-004",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1556909114-f6e7ad7d3136",
      "1504674900247-0877df9cc836",
    ]),
    tags: ["cake stand", "marble", "gold", "display", "entertaining"],
    featured: false,
    rating: 4.5,
    reviewCount: 20,
  },
  {
    name: "Melamine Salad Bowl Set (5 Pieces)",
    slug: "melamine-salad-bowl-set-5-pieces",
    description:
      "Serve salads, snacks, and dips in style with this 5-piece melamine bowl set featuring a textured speckled exterior and smooth interior. The nesting design saves storage space and the shatterproof construction is perfect for outdoor dining. The set includes one large serving bowl and four individual bowls in coordinating colors.",
    price: 27.99,
    comparePrice: 38.99,
    stock: 53,
    sku: "KC-DS-005",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1551218808-94e220e084d2",
      "1504674900247-0877df9cc836",
    ]),
    tags: ["salad bowls", "melamine", "outdoor dining", "nesting", "set"],
    featured: false,
    rating: 4.3,
    reviewCount: 19,
  },
  {
    name: "Double-Walled Insulated Pitcher (2 Liter)",
    slug: "double-walled-insulated-pitcher-2-liter",
    description:
      "Keep beverages cold for up to 24 hours or hot for up to 12 with this sleek double-walled insulated pitcher in brushed stainless steel. The 2-liter capacity serves 8 glasses and the leak-proof lid with easy-pour spout prevents spills. The silicone handle provides a comfortable, non-slip grip and the wide mouth makes filling and cleaning effortless.",
    price: 32.99,
    comparePrice: 44.99,
    stock: 41,
    sku: "KC-DS-006",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1556909114-f6e7ad7d3136",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: ["pitcher", "insulated", "stainless steel", "2-liter", "beverage"],
    featured: false,
    rating: 4.4,
    reviewCount: 23,
  },
  {
    name: "Bamboo Serving Tray (Oval)",
    slug: "bamboo-serving-tray-oval",
    description:
      "Carry breakfast in bed, serve cocktails, or organize ottoman essentials on this elegant oval bamboo serving tray. The raised edges prevent spills and the integrated handles provide a secure, comfortable grip. The natural bamboo finish is food-safe and resistant to moisture, making it both beautiful and practical for everyday entertaining.",
    price: 19.99,
    comparePrice: null,
    stock: 58,
    sku: "KC-DS-007",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1556909172-54557c7e4fb7",
      "1551218808-94e220e084d2",
    ]),
    tags: ["serving tray", "bamboo", "oval", "breakfast tray", "entertaining"],
    featured: false,
    rating: 4.2,
    reviewCount: 14,
  },
  {
    name: "Soup Tureen with Ladle Set",
    slug: "soup-tureen-with-ladle-set",
    description:
      "Present soups, stews, and chilis at the table with this classic ceramic soup tureen featuring a handsome fluted design and matching lid. The generous 4-quart capacity serves 8-10 portions and the included stainless steel ladle rests neatly on the rim. Microwave and dishwasher safe, it combines traditional elegance with modern convenience.",
    price: 44.99,
    comparePrice: 59.99,
    stock: 20,
    sku: "KC-DS-008",
    categoryId: "dining-serving",
    images: img([
      "1414235077428-338989a2e8c0",
      "1504674900247-0877df9cc836",
      "1551218808-94e220e084d2",
    ]),
    tags: ["soup tureen", "ceramic", "ladle", "serving", "tableware"],
    featured: false,
    rating: 4.5,
    reviewCount: 22,
  },

  // ── Coffee & Tea (8 products) ──
  {
    name: "French Press Coffee Maker (34 oz)",
    slug: "french-press-coffee-maker-34-oz",
    description:
      "Brew rich, full-bodied coffee with this classic 34-ounce French press featuring a 4-level stainless steel filtration system that delivers smooth, sediment-free coffee every time. The borosilicate glass carafe is heat-resistant and dishwasher safe. Its elegant chrome frame and comfortable handle make it a beautiful addition to any countertop.",
    price: 29.99,
    comparePrice: 39.99,
    stock: 55,
    sku: "KC-CT-001",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1442512595331-e89e73853f31",
      "1585515320310-259814833e62",
    ]),
    tags: ["French press", "coffee maker", "borosilicate glass", "stainless steel"],
    featured: true,
    rating: 4.7,
    reviewCount: 44,
  },
  {
    name: "Pour-Over Coffee Dripper Set",
    slug: "pour-over-coffee-dripper-set",
    description:
      "Unlock the nuanced flavors of single-origin coffee with this precision pour-over dripper set featuring a reusable stainless steel mesh filter and heat-resistant ceramic body. The set includes a glass carafe with measurement markings and a silicone grip sleeve. The slow-drip process extracts maximum flavor for a truly artisanal cup.",
    price: 24.99,
    comparePrice: null,
    stock: 43,
    sku: "KC-CT-002",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1442512595331-e89e73853f31",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["pour-over", "coffee dripper", "ceramic", "manual brewing", "artisanal"],
    featured: true,
    rating: 4.6,
    reviewCount: 32,
  },
  {
    name: "Cast Aluminum Moka Express (6 Cup)",
    slug: "cast-aluminum-moka-express-6-cup",
    description:
      "Brew authentic Italian-style espresso on any stovetop with this iconic moka pot made from food-safe cast aluminum. The 6-cup capacity produces six 2-ounce servings of rich, concentrated coffee in under 5 minutes. The safety valve and ergonomic handle ensure safe, comfortable operation and it's compatible with gas, electric, and induction cooktops.",
    price: 34.99,
    comparePrice: 44.99,
    stock: 38,
    sku: "KC-CT-003",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1442512595331-e89e73853f31",
      "1585515320310-259814833e62",
    ]),
    tags: ["moka pot", "espresso", "Italian", "stovetop", "cast aluminum"],
    featured: false,
    rating: 4.5,
    reviewCount: 27,
  },
  {
    name: "Ceramic Japanese Tea Set (5 Pieces)",
    slug: "ceramic-japanese-tea-set-5-pieces",
    description:
      "Experience the tranquility of Japanese tea culture with this handcrafted ceramic tea set featuring a traditional kyusu teapot and four matching yunomi cups. Each piece is finished in a reactive wabi-sabi glaze that makes every set unique. The stainless steel mesh infuser allows loose-leaf tea to steep perfectly without escaping leaves.",
    price: 45.99,
    comparePrice: 64.99,
    stock: 21,
    sku: "KC-CT-004",
    categoryId: "coffee-tea",
    images: img([
      "1442512595331-e89e73853f31",
      "1495474472287-4d71bcdd2085",
      "1571091718767-18b5b1457add",
    ]),
    tags: [
      "tea set",
      "Japanese",
      "ceramic",
      "loose-leaf",
      "kyusu",
      "handcrafted",
    ],
    featured: false,
    rating: 4.8,
    reviewCount: 35,
  },
  {
    name: "Double-Wall Glass Coffee Mugs (Set of 4)",
    slug: "double-wall-glass-coffee-mugs-set-of-4",
    description:
      "Enjoy your favorite beverages in these elegant 12-ounce double-wall borosilicate glass mugs that keep drinks hot while staying cool to the touch. The clear walls create a stunning floating illusion and allow you to appreciate layered drinks like lattes and cappuccinos. Microwave and dishwasher safe, they combine beauty with everyday practicality.",
    price: 22.99,
    comparePrice: 29.99,
    stock: 60,
    sku: "KC-CT-005",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1442512595331-e89e73853f31",
      "1585515320310-259814833e62",
    ]),
    tags: ["glass mugs", "double-wall", "coffee mugs", "borosilicate", "set"],
    featured: false,
    rating: 4.4,
    reviewCount: 25,
  },
  {
    name: "Electric Milk Frother (Handheld)",
    slug: "electric-milk-frother-handheld",
    description:
      "Create café-quality foam at home in seconds with this powerful handheld milk frother featuring a dual-speed whisk for both frothing and stirring. The stainless steel wand is easy to clean and the ergonomic rubber grip provides a comfortable, secure hold. Battery-operated with included batteries, it's perfect for lattes, cappuccinos, and hot chocolate.",
    price: 12.99,
    comparePrice: null,
    stock: 72,
    sku: "KC-CT-006",
    categoryId: "coffee-tea",
    images: img([
      "1442512595331-e89e73853f31",
      "1495474472287-4d71bcdd2085",
      "1571091718767-18b5b1457add",
    ]),
    tags: ["milk frother", "electric", "handheld", "cappuccino", "latte art"],
    featured: false,
    rating: 4.3,
    reviewCount: 20,
  },
  {
    name: "Reusable Stainless Steel Coffee Filter",
    slug: "reusable-stainless-steel-coffee-filter",
    description:
      "Reduce waste and enhance flavor with this reusable double-layer stainless steel coffee filter that lets natural oils pass through for a richer, more aromatic cup. Designed to fit standard 8-12 cup drip coffee makers, it features a fine mesh that prevents grounds from passing while allowing full extraction. Dishwasher safe and built to last for years.",
    price: 14.99,
    comparePrice: 19.99,
    stock: 48,
    sku: "KC-CT-007",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1585515320310-259814833e62",
      "1442512595331-e89e73853f31",
    ]),
    tags: [
      "coffee filter",
      "reusable",
      "stainless steel",
      "eco-friendly",
      "zero waste",
    ],
    featured: false,
    rating: 4.5,
    reviewCount: 30,
  },
  {
    name: "Insulated Travel Coffee Tumbler (16 oz)",
    slug: "insulated-travel-coffee-tumbler-16-oz",
    description:
      "Take your coffee on the go with this sleek vacuum-insulated travel tumbler that keeps beverages hot for 6 hours or cold for 12. The leak-proof lid with one-hand operation and the wide mouth for easy filling make it perfect for commutes and road trips. Made from food-grade 18/8 stainless steel with a powder-coated finish that resists scratches and sweating.",
    price: 19.99,
    comparePrice: 27.99,
    stock: 66,
    sku: "KC-CT-008",
    categoryId: "coffee-tea",
    images: img([
      "1495474472287-4d71bcdd2085",
      "1442512595331-e89e73853f31",
      "1585515320310-259814833e62",
    ]),
    tags: [
      "travel tumbler",
      "insulated",
      "stainless steel",
      "coffee",
      "leak-proof",
    ],
    featured: false,
    rating: 4.6,
    reviewCount: 38,
  },

  // ── Cleaning & Care (8 products) ──
  {
    name: "Natural Wood Cutting Board Conditioner",
    slug: "natural-wood-cutting-board-conditioner",
    description:
      "Extend the life of your wooden cutting boards with this all-natural conditioning oil made from food-grade mineral oil and beeswax. It penetrates deep into wood fibers to prevent drying, cracking, and warping while creating a protective barrier against moisture and bacteria. Simply apply, let absorb, and buff for a renewed, lustrous finish.",
    price: 12.99,
    comparePrice: null,
    stock: 75,
    sku: "KC-CC-001",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909172-54557c7e4fb7",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: [
      "cutting board oil",
      "conditioner",
      "natural",
      "beeswax",
      "wood care",
    ],
    featured: true,
    rating: 4.6,
    reviewCount: 33,
  },
  {
    name: "Microfiber Cleaning Cloth Set (12 Pack)",
    slug: "microfiber-cleaning-cloth-set-12-pack",
    description:
      "Tackle every kitchen cleaning task with this 12-pack of premium microfiber cloths in 6 different colors for color-coded cleaning zones. Each cloth is ultra-absorbent, holding up to 8 times its weight in liquid, and traps dirt and bacteria without chemicals. Machine washable up to 500 times, they're an eco-friendly alternative to paper towels.",
    price: 16.99,
    comparePrice: 22.99,
    stock: 88,
    sku: "KC-CC-002",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
    ]),
    tags: [
      "microfiber",
      "cleaning cloths",
      "kitchen cleaning",
      "eco-friendly",
      "washable",
    ],
    featured: true,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    name: "Stainless Steel Appliance Cleaner Spray",
    slug: "stainless-steel-appliance-cleaner-spray",
    description:
      "Remove fingerprints, smudges, and grease from all your stainless steel appliances with this professional-grade cleaner and polish in one. The plant-based formula leaves a streak-free shine and an invisible protective barrier that resists future marks. Safe for all stainless steel finishes and the pleasant citrus scent leaves your kitchen smelling fresh.",
    price: 11.99,
    comparePrice: null,
    stock: 92,
    sku: "KC-CC-003",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909114-f6e7ad7d3136",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: [
      "stainless steel cleaner",
      "appliance cleaner",
      "streak-free",
      "plant-based",
    ],
    featured: false,
    rating: 4.4,
    reviewCount: 24,
  },
  {
    name: "Expandable Dish Drying Rack",
    slug: "expandable-dish-drying-rack",
    description:
      "This heavy-duty stainless steel dish drying rack expands from 16 to 23 inches to accommodate dishes of all sizes. It features a built-in utensil holder, wine glass rack, cutting board slot, and a removable drainboard with a swivel spout. The rust-resistant construction and sleek design make it a functional and attractive addition to any kitchen.",
    price: 35.99,
    comparePrice: 49.99,
    stock: 33,
    sku: "KC-CC-004",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909172-54557c7e4fb7",
      "1585515320310-259814833e62",
    ]),
    tags: ["dish rack", "drying rack", "stainless steel", "expandable", "drainboard"],
    featured: false,
    rating: 4.3,
    reviewCount: 19,
  },
  {
    name: "Bamboo Dish Brush Set (3 Pieces)",
    slug: "bamboo-dish-brush-set-3-pieces",
    description:
      "Replace disposable sponges with this eco-friendly 3-piece bamboo dish brush set featuring a pot scrubber, dish brush, and vegetable brush. The sisal and palm bristles are naturally antibacterial and tough on grime but gentle on non-stick surfaces. The ergonomic bamboo handles are water-resistant and compostable at end of life.",
    price: 14.99,
    comparePrice: 19.99,
    stock: 57,
    sku: "KC-CC-005",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909114-f6e7ad7d3136",
      "1556909172-54557c7e4fb7",
    ]),
    tags: ["dish brush", "bamboo", "eco-friendly", "sisal", "compostable"],
    featured: false,
    rating: 4.5,
    reviewCount: 28,
  },
  {
    name: "Oven & Grill Cleaning Gel",
    slug: "oven-grill-cleaning-gel",
    description:
      "Tough on grease but gentle on surfaces, this thick clinging gel formula clings to vertical oven walls and grill grates for maximum cleaning power. It dissolves baked-on carbon deposits, grease, and food residue without harsh fumes or toxic chemicals. Simply apply, let it work for 30 minutes, and wipe away for a sparkling clean oven.",
    price: 13.99,
    comparePrice: null,
    stock: 63,
    sku: "KC-CC-006",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1590794056226-79ef3a8147e1",
      "1556909114-f6e7ad7d3136",
    ]),
    tags: [
      "oven cleaner",
      "grill cleaner",
      "gel",
      "grease remover",
      "non-toxic",
    ],
    featured: false,
    rating: 4.2,
    reviewCount: 16,
  },
  {
    name: "Glass & Surface Cleaner Concentrate",
    slug: "glass-surface-cleaner-concentrate",
    description:
      "This plant-based glass and surface cleaner concentrate makes 32 bottles of powerful, streak-free cleaning solution from just one bottle. The biodegradable formula cuts through grease and grime on glass, countertops, and appliances without leaving residues or chemical odors. Dilute with water in the included spray bottle and reduce plastic waste by 97%.",
    price: 9.99,
    comparePrice: null,
    stock: 84,
    sku: "KC-CC-007",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909172-54557c7e4fb7",
      "1590794056226-79ef3a8147e1",
    ]),
    tags: [
      "glass cleaner",
      "concentrate",
      "plant-based",
      "biodegradable",
      "eco-friendly",
    ],
    featured: false,
    rating: 4.4,
    reviewCount: 22,
  },
  {
    name: "Silicone Sink Organizer & Brush Caddy",
    slug: "silicone-sink-organizer-brush-caddy",
    description:
      "Keep your sink area neat and hygienic with this silicone sink organizer that holds sponges, brushes, and dish soap in ventilated compartments for quick drying. The flexible silicone material is heat-resistant, mold-resistant, and can be rinsed clean in seconds. Its weighted base prevents tipping and the integrated drainage spout channels water directly into the sink.",
    price: 17.99,
    comparePrice: 24.99,
    stock: 46,
    sku: "KC-CC-008",
    categoryId: "cleaning-care",
    images: img([
      "1585421514284-efb74c2b69ba",
      "1556909114-f6e7ad7d3136",
      "1585515320310-259814833e62",
    ]),
    tags: [
      "sink organizer",
      "sponge holder",
      "silicone",
      "brush caddy",
      "draining",
    ],
    featured: false,
    rating: 4.3,
    reviewCount: 17,
  },
];

// ──────────────────────────────────────────────
// Main seed function
// ──────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting KitchenCart database seed...\n");

  // 1. Delete existing data (respect FK order)
  console.log("🗑️  Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.productVariant.deleteMany();
  console.log("✅ All existing data cleared.\n");

  // 2. Create categories
  console.log("📁 Creating 10 categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
    console.log(`   ✓ ${cat.name} (${created.id})`);
  }
  console.log("");

  // 3. Create products
  console.log("📦 Creating 80 products...");
  for (const p of products) {
    const categoryId = categoryMap[p.categoryId];
    if (!categoryId) {
      console.error(`   ✗ Category not found: ${p.categoryId}`);
      continue;
    }
    const { categoryId: _cat, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        categoryId,
        images: JSON.stringify(p.images),
        tags: JSON.stringify(p.tags),
      },
    });
    console.log(`   ✓ ${p.name} (${p.sku})`);
  }
  console.log("");

  // 4. Create admin user
  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@kitchencart.com",
      password: hashedPassword,
      role: "admin",
      avatar: null,
    },
  });
  console.log(`   ✓ Admin user created: ${admin.email} (id: ${admin.id})\n`);

  // 5. Create 5 sample orders
  console.log("🛒 Creating 5 sample orders...");

  // Fetch some products for order items
  const allProducts = await prisma.product.findMany();
  const pick = (arr: typeof allProducts, n: number) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  const statuses = ["delivered", "shipped", "delivered", "processing", "delivered"];
  const addresses = [
    "123 Main Street, Apt 4B, New York, NY 10001",
    "456 Oak Avenue, Los Angeles, CA 90001",
    "789 Pine Road, Chicago, IL 60601",
    "321 Elm Street, Houston, TX 77001",
    "654 Maple Drive, Phoenix, AZ 85001",
  ];

  for (let i = 0; i < 5; i++) {
    const selectedProducts = pick(allProducts, 2 + Math.floor(Math.random() * 3));
    const subtotal = selectedProducts.reduce(
      (sum, p) => sum + p.price * (1 + Math.floor(Math.random() * 2)),
      0
    );
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const discount = i === 0 ? 10 : 0;
    const total = subtotal + shipping + tax - discount;

    const order = await prisma.order.create({
      data: {
        userId: admin.id,
        status: statuses[i],
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        discount,
        total: Math.round(total * 100) / 100,
        paymentMethod: i % 2 === 0 ? "cod" : "card",
        shippingAddress: addresses[i],
        notes: i === 0 ? "Please leave at the door" : null,
        orderItems: {
          create: selectedProducts.map((p) => ({
            productId: p.id,
            quantity: 1 + Math.floor(Math.random() * 2),
            price: p.price,
            productName: p.name,
            productImage: JSON.parse(p.images)[0],
          })),
        },
      },
    });
    console.log(
      `   ✓ Order #${i + 1} (${order.status}) — $${order.total.toFixed(2)} with ${selectedProducts.length} items`
    );
  }

  console.log("\n🎉 KitchenCart database seeded successfully!");
  console.log(`   - 10 categories`);
  console.log(`   - 80 products`);
  console.log(`   - 1 admin user (admin@kitchencart.com / admin123)`);
  console.log(`   - 5 sample orders`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
