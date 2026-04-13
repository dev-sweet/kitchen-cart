# KitchenCart Worklog

## Task 1 - Project Setup & Prisma Schema
- Initialized Next.js 16 project with App Router
- Configured Prisma ORM with SQLite
- Defined complete schema: User, Category, Product, ProductVariant, CartItem, Order, OrderItem, Address, Review, Wishlist, Coupon, Newsletter, BlogPost, ContactMessage
- Set up auth with NextAuth.js v4 credentials provider
- Created utility helpers: getCurrentUser, requireAdmin, formatPrice, generateSlug, generateOrderId

## Task 2 - API Routes (All 19 endpoints)

### Product APIs
- `GET/POST /api/products` - List all products with filters (category, search, sort, featured, inStock, pagination) + Admin create product
- `GET /api/products/[slug]` - Get single product by slug with category and variants
- `PUT/DELETE /api/products/[id]` - Admin update/delete product (slug uniqueness check)

### Category APIs
- `GET/POST /api/categories` - List all categories with product count + Admin create category

### Cart APIs
- `GET/POST /api/cart` - Get user's cart items + Add to cart (merges duplicates)
- `PUT/DELETE /api/cart/[id]` - Update quantity + Remove cart item (ownership check)

### Order APIs
- `POST /api/checkout` - Create order from cart (COD, stock validation, coupon support, transaction-based)
- `GET /api/orders` - List user's orders with pagination and status filter
- `GET/PUT /api/orders/[id]` - Get single order with items + Admin update status

### Review APIs
- `GET/POST /api/reviews` - Get product reviews with pagination + Create review (prevents duplicates, updates product rating avg)

### Wishlist APIs
- `GET/POST /api/wishlist` - Get user's wishlist + Add to wishlist (unique constraint)
- `DELETE /api/wishlist/[id]` - Remove from wishlist (ownership check)

### Search API
- `GET /api/search` - Search products by query (name, description, tags, category name)

### Contact & Newsletter APIs
- `POST /api/contact` - Submit contact form with email validation
- `POST /api/newsletter` - Subscribe email (handles duplicates)

### Upload API
- `POST /api/upload` - Upload image (admin only, file type/size validation, saves to /public/images/products)

### Admin APIs
- `GET /api/admin/stats` - Dashboard stats: totalRevenue, ordersToday, totalProducts, totalCustomers, recentOrders, revenueByDay (30 days)
- `GET /api/admin/customers` - All customers paginated with order count

### Coupon API
- `GET /api/coupons` - Admin list all coupons
- `POST /api/coupons` - Validate coupon code (checks expiry, usage limit, min order)

## Task 3 - Header Component & Cart Drawer

### Header (`/src/components/layout/Header.tsx`)
- **Sticky header** with transparent-to-solid scroll behavior (orange gradient → white bg with shadow after 50px scroll)
- **Announcement bar**: Dismissable "Free shipping on orders over $50" banner with X close button
- **Logo**: ChefHat icon + "KitchenCart" text (primary orange), links to `/`
- **Desktop navigation**: Home, Shop, Categories (hover dropdown), About, Contact — horizontal nav with active state highlighting
- **Categories dropdown**: Fetched from `/api/categories`, shows name + product count, hover-to-open with 150ms close delay, "View All Products" link
- **Action buttons** (right side): Search toggle, Wishlist with count badge, Cart with count badge (Zustand), User dropdown
- **User dropdown**: Unauthenticated → Login/Register; Authenticated → My Account, My Orders, Wishlist, Admin Panel (if role=ADMIN), Sign Out
- **Search bar**: Slides down from header, 300ms debounced autocomplete from `/api/search?q=`, keyboard Enter submits to `/shop?search=query`
- **Mobile menu** (Sheet, side=right, w-80): All nav links + categories list + account links + Search/Cart action buttons + Sign Out
- **Session**: Uses `useSession` from `next-auth/react` + `signOut()` for logout
- **Cart**: Opens CartDrawer via `useCartStore.openCart()`

### Cart Drawer (`/src/components/layout/CartDrawer.tsx`)
- **Sheet** component (side=right, max-w-md) controlled by Zustand `isOpen` state
- **Empty cart state**: ShoppingBag icon + "Your cart is empty" message + "Continue Shopping" button
- **Cart item rows**: Product image (80×80, rounded, border), linked product name, variant label, quantity controls (± buttons with min/max), price display, trash remove button
- **Coupon system**: Input + "Apply" button → validates via `POST /api/coupons`; applied coupon shown in green banner with remove option; error message display
- **Order summary**: Subtotal, coupon discount (green), shipping (free over $50 with Truck icon, else $5.99), tax (8%), bold total in primary color
- **Free shipping progress**: Shows "Add $X.XX more for free shipping!" when subtotal < $50
- **Action buttons**: "Checkout — $X.XX" (primary, links to `/checkout`), "View Cart" (outline, links to `/cart`)

## Task 4 - Footer Component (`/src/components/layout/Footer.tsx`)

### Footer Sections
- **Brand Column (left)**: KitchenCart logo (ChefHat icon + text) with tagline "Everything for your kitchen", brand description paragraph, and social media icons row (Facebook, Instagram, Twitter/X, YouTube) with inline SVGs, 20px size, #9E9E9E default → #E65100 hover, circular bg with subtle hover effect
- **Company Info Column**: "COMPANY INFO" heading (uppercase, 14px, 600 weight, 0.08em tracking), 5 links: Privacy Policy, Terms & Conditions, Contact Us, About Us, Blog
- **Purchase Info Column**: "PURCHASE INFO" heading with same styling, 5 links: FAQ, Payment Methods, Shipping & Delivery, Refunds & Returns, Order Tracking
- **Newsletter Column (right)**: "STAY IN THE LOOP" heading, subtext "Get recipes, deals & new arrivals to your inbox", email input with Mail icon + Subscribe button, POST to `/api/newsletter`, states: idle/loading/success/error with green success message (CheckCircle icon) and red error text
- **Bottom Bar**: Left copyright "© 2025 KitchenCart. All rights reserved.", right payment method badges (Visa, Mastercard, PayPal, Stripe, Apple Pay) as styled pill badges

### Design & Styling
- Background: #1A1A1A (dark charcoal)
- Text: #9E9E9E default, #FFFFFF on hover for links
- Headings: 14px, font-weight 600, letter-spacing 0.08em, uppercase, white
- Link hover: smooth underline animation via `.footer-link` CSS class (width 0→100%, #E65100 underline, 0.3s ease)
- Responsive: 4-column grid on lg, 2-column on md, 1-column on mobile
- Newsletter input: dark themed with bg-white/5, border-white/10, #E65100 focus ring

### Technical
- `'use client'` component with useState for newsletter form
- Custom inline SVG components for Facebook, Instagram, Twitter/X, YouTube icons
- Used shadcn/ui Input + Button for newsletter, lucide-react for Mail/CheckCircle/Loader2/ChefHat icons
- next/link for all internal navigation links
- `globals.css` updated with `.footer-link` hover underline animation CSS
- Zero lint errors

## Task 13 - Database Seed Script

### Script: `/home/z/my-project/scripts/seed.ts`
- Created comprehensive seed script using Prisma Client and bcryptjs for password hashing
- Runnable with `bun run scripts/seed.ts`
- Deletes all existing data in correct FK order before seeding (OrderItem → CartItem → Review → Wishlist → Order → Product → Category → Address → User → Coupon → Newsletter → BlogPost → ContactMessage → ProductVariant)

### Seeded Data
- **10 Categories**: Baking Tools, Kitchen Tools & Gadgets, Kitchen Electronics, Kitchen Storage, Aprons & Hats, Cookware & Bakeware, Cutlery & Knives, Dining & Serving, Coffee & Tea, Cleaning & Care
  - Each with: name, slug, description, lucide icon name, Unsplash banner image, featured flag
- **80 Products** (8 per category) with realistic details:
  - Realistic names (e.g., "Professional Silicone Baking Mat Set", "Digital Air Fryer 5.8Qt", "Japanese Damascus Knife Set")
  - 2-3 sentence descriptions with specific features and benefits
  - Realistic pricing: budget ($8-$25), mid-range ($25-$75), premium ($75-$200)
  - Compare prices (~20-30% higher) on ~60% of products
  - SKUs formatted as KC-{category prefix}-{number} (e.g., KC-BT-001, KC-EL-003)
  - Stock levels 10-100 per product
  - 3 Unsplash image URLs per product (real photo IDs for kitchen items)
  - 4-6 relevant tags per product stored as JSON array
  - Featured flag on first 2-3 products per category
  - Ratings 4.1-4.9 and review counts 13-50
- **1 Admin User**: admin@kitchencart.com / admin123 (bcrypt hashed, role: admin)
- **5 Sample Orders** linked to admin user:
  - 2-4 order items each with random products
  - Realistic subtotals, shipping (free over $50), 8% tax, discounts
  - Varied statuses: delivered (3), shipped (1), processing (1)
  - 5 different shipping addresses
  - Payment methods: mix of COD and card

## Task 5 - Homepage (Homepage Component + ProductCard + StarRating)

### Files Created
- `/src/app/page.tsx` — Full homepage with 9 sections (footer excluded, in layout)
- `/src/components/product/ProductCard.tsx` — Reusable product card component
- `/src/components/shared/StarRating.tsx` — Star rating display component

### StarRating Component (`/src/components/shared/StarRating.tsx`)
- Displays star ratings (1–5) with half-star support using clipping technique
- Filled stars: `fill-amber-400 text-amber-400`, empty: `text-gray-300`
- Optional props: `showValue` (displays numeric rating), `reviewCount` (shows in parentheses)
- Configurable `size` prop (default 16px)

### ProductCard Component (`/src/components/product/ProductCard.tsx`)
- Image with hover zoom effect (`scale-110`, 500ms transition)
- Skeleton loader while image loads
- Product name truncated to 2 lines (`line-clamp-2`)
- Price with optional compare price (strikethrough) and discount badge (Percent icon + X% OFF)
- StarRating display with value and review count
- "Add to Cart" button slides up from bottom on card hover, uses `useCartStore.addItem()` + opens cart drawer
- Wishlist heart icon (top right) with toggle state and toast notifications
- Category badge (top left, secondary variant)
- Out of stock overlay with disabled button
- Links to `/product/[slug]`
- Uses `next/image` with responsive `sizes` attribute
- Props: full `Product` object with id, name, slug, price, comparePrice, rating, reviewCount, images, category, featured, stock

### Homepage (`/src/app/page.tsx`) — 9 Sections

**1. Hero Banner Carousel**
- 3 slides with gradient backgrounds (orange/amber/red themes)
- Slides: "Premium Kitchen Essentials", "Master the Art of Baking", "Smart Kitchen Electronics"
- Auto-slide every 5 seconds with `setInterval`, left/right arrow buttons
- Navigation dots at bottom (active dot wider)
- Smooth 700ms opacity transitions, `animate-fade-in-up` on text
- Left-aligned text block with Badge, h1 title, subtitle, CTA button (white bg)
- Decorative large icon on right side (ChefHat, Oven, Zap) at 20% opacity
- Radial gradient overlays for depth

**2. Category Grid**
- Fetched from `/api/categories`, displays first 10 categories
- Responsive grid: 2 cols mobile, 3 tablet, 4 medium, 5 desktop
- Each card: icon (mapped from DB icon name to lucide-react via `iconMap`), name, product count
- Hover: `scale-[1.03]`, shadow-md, orange border accent
- Links to `/shop/[slug]`
- Loading skeleton: pulsing circles + text bars

**3. Featured Products Horizontal Scroll**
- Fetched from `/api/products?featured=true&limit=12`
- Horizontal scrollable row with `scrollbar-hide` and `snap-x snap-mandatory`
- Left/right scroll buttons (visible on container hover, `opacity-0 → opacity-100`)
- Each card: fixed width 220–270px (responsive), snap-start
- "View All →" link to `/shop?featured=true`

**4. Promotional Banner**
- Full-width orange gradient (`from-orange-600 via-orange-500 to-amber-500`)
- "Free Shipping on Orders Over $50" heading with Truck icon
- "Shop Now" CTA button (white bg, orange text)
- Decorative cooking icons (ChefHat, Cookie, Flame) at 10% opacity on right side

**5. Best Sellers**
- Fetched from `/api/products?sort=popular&limit=8`
- 2x2 mobile, 3-col tablet, 4-col desktop grid
- "View All →" link to `/shop?sort=popular`
- Uses ProductCard component

**6. Shop by Collection**
- 3 large collection cards: Baking, Cooking, Storage
- Each: gradient background, centered icon in white circle, collection name, description, item count badge, "Shop Now" button
- Distinct color themes per collection (amber/orange/emerald)
- Links to `/shop?category=[slug]`
- Hover: shadow-xl, icon scales up

**7. Trust Badges**
- 4 badges in 2x2 mobile, 4-col desktop grid
- Icons: Truck (Free Shipping), RotateCcw (Easy Returns), ShieldCheck (Secure Payment), Headphones (24/7 Support)
- Center aligned, orange-light bg circles for icons, muted descriptions

**8. Newsletter Signup**
- Dark charcoal background section
- Mail icon in primary-orange circle
- "Subscribe to Our Newsletter" + "Get 10% off your first order" subtext
- Email input (dark themed: `bg-white/10 border-white/20 text-white`) + Subscribe button
- States: idle → loading (Loader2 spinner) → success (CheckCircle + emerald text) / error (red text)
- POSTs to `/api/newsletter`, toast notifications on success

**9. Recently Viewed Products**
- Reads from `localStorage` key "recentlyViewed" via `useState` lazy initializer (SSR-safe)
- Displays up to 10 products as horizontal scroll
- Each card: small image with hover zoom, "Viewed" badge, product name (2 lines), price
- Only renders if there are recently viewed items

### Data Fetching
- Three parallel `useEffect` fetches on mount: categories, featured products, best sellers
- Loading skeletons shown during fetches
- Error handling with `.catch(console.error)`

### Technical Details
- `'use client'` component
- All icons from `lucide-react`
- shadcn/ui: Button, Input, Card, Badge
- Hooks: useState, useEffect, useRef, useCallback
- Cart integration: `useCartStore` from `@/store/cart-store`
- Toast: `sonner` library
- CSS: `animate-fade-in-up`, `scrollbar-hide`, `hero-slide` transition from globals.css
- Zero lint errors

## Task 3 - Shop Page & Product Detail Page

### File 1: `/src/app/shop/page.tsx` — Full Shop Page

**Architecture:**
- `"use client"` component using `useSearchParams` and `useRouter` for URL-based filter state
- Extracted `FilterPanel` as a standalone component (outside main render) to avoid `react-hooks/static-components` lint error, receiving all filter state + handlers via props

**Filter Sidebar (Collapsible on Mobile via Sheet):**
- **Category filter**: Checkboxes fetched from `/api/categories`, each showing name + product count, with skeleton loading state
- **Price range**: Radio-style selection (Under $25, $25-$50, $50-$100, Over $100) — client-side filtering since API lacks price params
- **Rating filter**: Radio-style selection (4+ stars, 3+ stars, etc.) — client-side filtering
- **In-stock toggle**: Switch component, synced to `?inStock=true` URL param
- **Sort by**: Select dropdown (Newest, Price Low-High, Price High-Low, Popular, Top Rated) synced to `?sort=` URL param
- All filters use `router.push` to update URL params (no server actions), maintaining shareable/copyable URLs
- Active filter tags displayed in toolbar with X to remove individual filters + "Clear all" button
- Filter count badge on mobile filter button

**Product Grid:**
- Responsive columns: 1 (mobile), 2 (sm), 3 (xl), 4 (2xl)
- Uses `ProductCard` component for each product
- Loading state: 12 skeleton cards (aspect-square image + text bars)

**Pagination:**
- 12 items per page
- Custom pagination buttons (prev/next + numbered pages with ellipsis)
- Shows "Showing X to Y of Z products" text
- Smooth scroll to top on page change

**Search:**
- Search bar in page header, reads from / writes to `?search=` URL param
- Clear button (X) to reset search
- Search results heading shows query in primary color
- Products fetched from API with `search` query param

**Breadcrumb:** Home > Shop

**Empty State:** Icon + message (contextual for search vs filter) + Clear Filters / View All buttons

### File 2: `/src/app/product/[slug]/page.tsx` — Product Detail Page

**Data Fetching:**
- Fetches from `/api/products/[slug]` (API handles slug-or-id lookup)
- Response includes: product, category, variants, reviews (first 10), relatedProducts
- Loading skeleton: breadcrumb + image gallery + info panel skeletons
- 404 handling: PackageX icon + "Product Not Found" message + Continue Shopping button

**Image Gallery:**
- Main image with click-to-switch thumbnails (horizontal scrollable)
- Active thumbnail has primary border + ring
- **Zoom on hover**: CSS `transform: scale-[2.5]` with dynamic `transformOrigin` tracking mouse position
- Discount badge overlay on main image
- `next/image` with `fill` + proper `sizes` attribute

**Stock Indicator:**
- Green badge ("In Stock") for stock > 5
- Amber badge ("Only X left in stock") for stock 1-5
- Red badge ("Out of Stock") for stock ≤ 0
- Dot indicator colored to match

**Product Info:**
- Category badge (links to filtered shop page)
- Product name (text-2xl/3xl bold)
- Star rating display (using `StarRating` component with value + review count)
- Price with compare price (strikethrough) — effective price recalculated based on selected variant priceModifiers
- SKU display

**Variant Selector:**
- Variants grouped by name (e.g., "Color", "Size")
- Each variant is a button with border highlighting when selected
- Out-of-stock variants show diagonal line overlay + disabled state
- Price modifier shown next to variant value (e.g., "+$5.00")
- Effective price updates dynamically

**Quantity Selector:**
- Minus / Plus buttons with border styling
- Quantity display between buttons
- Min: 1, Max: effectiveStock
- Disabled states at boundaries

**Add to Cart:**
- Primary button using `useCartStore.addItem()` with full cart item data
- Includes variant label in cart item
- Opens cart drawer via `useCartStore.openCart()`
- Toast notification on success
- Disabled when out of stock

**Add to Wishlist:**
- Heart button with fill state
- Fetches `/api/wishlist` to check initial status (for logged-in users)
- POST/DELETE via wishlist API
- Toast notifications for add/remove/error/already-in-wishlist
- Requires authentication (prompts sign-in toast for guests)

**Tabbed Content:**
- **Description**: Product description with paragraph splitting
- **Specifications**: Table with SKU, Category, Availability, Variants, Rating, Tags
- **Reviews**: 
  - Rating summary with average score, star distribution bar chart (5→1 stars)
  - Review form for logged-in users: interactive star selector with hover effect, title input, body textarea, submit button with loading spinner
  - Sign-in prompt for guests
  - Review list: avatar initial, user name, star rating, verified badge, time-ago date, title, body
- **Shipping Info**: 4 info cards (Free Shipping, Estimated Delivery, Returns & Exchanges, Order Protection) with icon circles

**Related Products:**
- "You May Also Like" section from API `relatedProducts` response
- 4-column grid using `ProductCard` component
- "View All" link to shop

**Recently Viewed:**
- Saves to `localStorage` key `"kitchencart-recently-viewed"` (max 10 items)
- Stored format: `{ id, name, slug, price, image }`
- Deduplicates, most recent first
- SSR-safe (only accesses localStorage in browser context)

**Technical Details:**
- All `useMemo` hooks placed before early returns to satisfy `react-hooks/rules-of-hooks`
- `FilterPanel` extracted as standalone component to satisfy `react-hooks/static-components`
- No synchronous `setState` in effect bodies (states initialized as `true` for loading)
- Zero lint errors

## Task 2 - Homepage Rewrite (Enhanced with Unsplash Images & Framer Motion)

### File: `/src/app/page.tsx` — Complete rewrite with 10 sections

### Changes from Previous Homepage (Task 5)

**1. Hero Banner Carousel**
- **Upgraded from gradient backgrounds to Unsplash images** with dark gradient overlays
- 3 slides using `next/image` with `fill`, `sizes="100vw"`, first slide `loading="eager"` + `priority`, rest `loading="lazy"`
- Unsplash images: kitchen tools (photo-1556909114), organized kitchen (photo-1556909172), coffee/tea (photo-1495474472287)
- Two CTA buttons per slide: "Shop Now" (primary orange) + "View Collection" (outline/ghost with backdrop-blur)
- Badge labels per slide: "New Arrivals", "Best Sellers", "Trending"
- Framer Motion `motion.div` for text animation on slide change (fade + slide up)
- Dark gradient overlays: left-to-right (`from-black/70 via-black/40`) + bottom-up (`from-black/30`)
- Auto-slide every 5 seconds with transition lock to prevent rapid clicking

**2. Category Grid**
- Icon mapping now by **category name** instead of DB icon field for consistency
- New icon map: Baking Tools→Cake, Kitchen Tools & Gadgets→Wrench, Kitchen Electronics→Zap, Kitchen Storage→Archive, Aprons & Hats→Scissors, Cookware & Bakeware→Flame, Cutlery & Knives→UtensilsCrossed, Dining & Serving→Wine, Coffee & Tea→Coffee, Cleaning & Care→Sparkles
- Added framer-motion `staggerContainer` + `fadeInUp` variants for entrance animations with `whileInView`

**3. Featured Products**
- Same horizontal scroll layout with ProductCard components
- Wrapped in framer-motion `fadeInUp` animation triggered on viewport entry

**4. Promotional Banner**
- Updated gradient to use `from-primary via-orange-500 to-amber-500` (uses CSS variable `#E65100`)
- Wrapped in framer-motion `scaleIn` animation

**5. Best Sellers**
- Same 4-column responsive grid
- Added framer-motion staggered `fadeInUp` animations per card

**6. Shop by Collection**
- 3 collections: Baking (Cake icon, amber), Cooking (Flame icon, orange), Storage (Package icon, emerald)
- Updated slug for Cooking collection to `cookware-bakeware` to match DB
- Added hover lift effect (`hover:-translate-y-1`)
- framer-motion staggered `scaleIn` animations

**7. Trust Badges**
- Added framer-motion staggered `fadeInUp` animations

**8. Newsletter Signup**
- Same dark charcoal section (#1A1A1A)
- Added framer-motion `fadeInUp` wrapper + animated success message

**9. Recently Viewed Products**
- **Updated localStorage key** to `"kitchencart-recently-viewed"` (was `"recentlyViewed"`)
- Dedicated `RecentlyViewedProduct` interface: `{ id, name, slug, price, image }`
- Uses `useState` lazy initializer with `typeof window` check (SSR-safe, no hydration mismatch)
- framer-motion staggered entrance animations
- All product images use `loading="lazy"`

**10. Footer**
- Already in `layout.tsx`, no changes needed

### Framer Motion Integration
- Defined 3 animation variants: `fadeInUp` (opacity+translateY), `staggerContainer` (staggerChildren), `scaleIn` (opacity+scale)
- Applied to all major sections via `whileInView` with `viewport={{ once: true, margin: "-50px" }}`
- Hero text uses `initial/animate` for slide transitions
- Newsletter success message uses `initial/animate` for feedback animation

### Loading Skeletons
- `CategoryGridSkeleton` — 10 pulsing circle+text cards in responsive grid
- `ProductGridSkeleton` — configurable count (default 4), pulsing card shapes
- `HorizontalScrollSkeleton` — fixed-width pulsing cards for horizontal scroll sections

### Data Fetching
- Three parallel `useEffect` fetches on mount: `/api/categories`, `/api/products?featured=true&limit=12`, `/api/products?sort=popular&limit=8`
- Loading state skeletons shown while fetching
- Error handling with `.catch(console.error)`

### Technical Details
- `'use client'` component
- Imports: `framer-motion` for animations, `lucide-react` icons (Cake, Archive, Wine, Scissors added)
- shadcn/ui: Button, Input, Card, Badge
- `next/image` for all images with proper loading strategy
- Zero lint errors

## Task 4 - Cart, Checkout & Order Success Pages

### File 1: `/src/app/cart/page.tsx` — Full Cart Page

**Features:**
- **Breadcrumb**: Home > Shopping Cart with Home icon
- **Page Header**: ShoppingCart icon + "Shopping Cart" title + item count + "Clear Cart" button
- **Free Shipping Progress Bar**: Orange progress bar showing how much more to spend for free shipping ($50 threshold), with animated width transition
- **Free Shipping Success Banner**: Green banner with Truck icon when subtotal >= $50
- **Cart Items List**: Each item in a Card component with:
  - Product image (24x24 / 32x32 responsive, hover zoom, linked to product page)
  - Product name (truncated 2 lines, hover orange), variant badge (secondary)
  - Quantity controls: Minus/Plus buttons with border, min=1, max=stock, centered quantity display
  - Per-unit price + line total (bold, primary color)
  - Remove button (Trash2 icon, hover red, separate mobile/desktop visibility)
  - Low stock warning (amber, for stock <= 5)
- **Order Summary Sidebar** (sticky, right column):
  - Subtotal with item count
  - Shipping (FREE in green when >= $50, else $5.99)
  - Tax (8%)
  - Coupon discount display (green, with Tag icon)
  - Coupon input: Input + Apply button, validates via `POST /api/coupons`, uppercase auto-transform, Enter key support
  - Applied coupon banner: Green bg with code + savings amount + X remove button
  - Separator
  - Total (text-2xl, bold, primary color)
  - "Proceed to Checkout" button (primary, with ChevronRight icon)
  - Security shield icon + "Secure checkout powered by KitchenCart"
- **Empty Cart State**: Large ShoppingCart icon in orange circle, "Your cart is empty" heading, descriptive text, "Start Shopping" button
- **Continue Shopping**: ArrowLeft + outline button, links to `/`

**Technical:**
- `'use client'` component
- SSR-safe `mounted` state via `useState(() => typeof window !== 'undefined')`
- `useCartStore` for items, subtotal, shipping, tax, total, coupon operations
- `CartItemRow` extracted as standalone component
- Coupon API integration with loading spinner (Loader2) and toast notifications
- Loading skeletons for items list and summary
- Responsive: 2-col on lg (items + sidebar), 1-col on mobile
- Zero lint errors

### File 2: `/src/app/checkout/page.tsx` — Full Checkout Page

**Features:**
- **Breadcrumb**: Home > Cart > Checkout (Cart links back to /cart)
- **Step Indicator**: 1. Shipping (active/orange) → 2. Payment (inactive) → 3. Review (inactive), hidden on mobile
- **Login Prompt** (unauthenticated): Lock icon card, "Sign in to Checkout" heading, description, "Sign In to Continue" button via `signIn('credentials')`, sign up link
- **Loading Skeleton**: While checking session status
- **Shipping Address Form** (Card with Truck icon header):
  - Full Name, Email (pre-filled from session), Phone Number, Country (default "United States")
  - Street Address (required), Address Line 2 (optional)
  - City, State, ZIP Code
  - All required fields have red asterisk and inline validation errors (AlertCircle icon)
  - Email format validation with regex
  - Error fields get red border, scroll to first error on validation failure
  - Session pre-fill via computed `prefilledAddress` (avoids useEffect setState lint issue)
- **Payment Method Selection** (Card with CreditCard icon header):
  - **Cash on Delivery** (primary): Green Banknote icon, "Recommended" badge, description, ShieldCheck icon, highlighted with primary border + orange bg when selected
  - **Credit/Debit Card** (placeholder): Blue CreditCard icon, "Coming Soon" badge, disabled when selected with amber warning message
  - RadioGroup component for selection
  - Place Order button disabled when card method is selected
- **Order Notes** (Card with Package icon header): Textarea for special instructions, "Optional" label
- **Order Summary Sidebar** (sticky):
  - Cart items preview: Small images (14x14) with quantity badge, product name, variant, line total, max-h-60 scrollable
  - Subtotal, Shipping, Tax, Coupon discount (same as cart)
  - Total (bold, primary)
  - Payment method display (Banknote green for COD, CreditCard blue for card)
  - "Place Order — $X.XX" button with Lock icon, loading state (Loader2 spinner + "Placing Order...")
  - Trust indicators: Secure, Tracked, Best Price
- **Back to Cart**: ArrowLeft ghost button

**Order Submission:**
- Validates address fields, scrolls to errors
- POSTs to `/api/checkout` with `{ shippingAddress, notes, couponCode }`
- On success: saves order data to localStorage (`kitchencart-last-order`), clears Zustand cart, redirects to `/checkout/success?orderId=X&total=Y`
- On error: toast with error message, re-enables submit button
- Redirects to `/cart` if cart is empty on mount

**Technical:**
- `'use client'` component
- SSR-safe via `useState(() => typeof window !== 'undefined')`
- `prefilledAddress` computed from session data + address state (avoids `set-state-in-effect` lint rule)
- `useSession` + `signIn` for authentication
- `useEffect` only for empty-cart redirect (not for setState)
- Zero lint errors

### File 3: `/src/app/checkout/success/page.tsx` — Order Success Page

**Features:**
- **Breadcrumb**: Home > Order Confirmed
- **Confetti Animation**: 6 colored particles (orange, amber, yellow, green, blue, purple) with staggered fall + rotation CSS animation
- **Success Icon**: CheckCircle2 in green circle with bounce animation (`animate-success-bounce`: scale 0.3→1.1→0.9→1)
- **Heading**: "Order Confirmed!" with animated party popper emoji
- **Thank You Message**: Descriptive text about order processing
- **Order ID Card**: Inline card showing order ID (monospace, primary color) + Copy to clipboard button with Check/Copy icon toggle + toast notification
- **Info Cards** (3-col grid):
  - Confirmation Email (Mail icon, blue) — confirmation sent to email
  - Estimated Delivery (Truck icon, green) — calculated date (order date + 5 days)
  - Payment Method (CreditCard icon, orange) — COD or Credit Card
- **Order Details Card**: Order ID, Date, Items count, Payment, Status (green "Processing" with Clock icon), Total (bold primary)
- **What's Next Card** (orange bg): 3 numbered steps — Order Confirmed, Packed & Shipped, Delivered to You (COD payment reminder)
- **Action Buttons**: "Continue Shopping" (primary) + "Track Order" (outline), both linking to `/`
- **Loading Skeleton**: While data loads (SSR guard)

**Data Loading:**
- SSR-safe via `useState` lazy initializer (reads from `window.location.search` params first, then localStorage fallback)
- Order data from URL: `?orderId=X&total=Y` (set by checkout redirect)
- Order data from localStorage: `kitchencart-last-order` key (fallback)

**Technical:**
- `'use client'` component
- No `useEffect` — all data loaded via lazy `useState` initializer (avoids `set-state-in-effect` lint)
- Custom CSS animations added to `globals.css`: `animate-success-bounce`, `animate-confetti-fall`, `animate-success-emoji`
- `ConfettiParticle` sub-component for confetti decoration
- Zero lint errors

### CSS Additions to `globals.css`
- `animate-success-bounce`: Scale bounce animation (0.3→1.1→0.9→1) for success icon
- `animate-confetti-fall`: Fall + rotate animation (translateY 0→120px, rotate 0→720deg, opacity 1→0)
- `animate-success-emoji`: Pop-in animation with rotation for party emoji

## Task 6 - Account Pages (Orders, Wishlist, Addresses, Profile)

### File 1: `/src/app/account/orders/page.tsx` — Order History Page

**Features:**
- **Breadcrumb**: My Account > My Orders
- **Page Header**: "My Orders" title + descriptive subtitle
- **Desktop Table View** (hidden on mobile):
  - Columns: Order ID (truncated), Date, Items count, Total, Status badge, View Details action
  - Status badges with colored backgrounds and icons: pending (yellow, Clock), processing (blue, ShoppingBag), shipped (purple, Truck), delivered (green, CheckCircle), cancelled (red, XCircle)
  - Each row links to order detail page
- **Mobile Card View** (hidden on desktop):
  - Card per order with truncated order ID, date, status badge, items count, total price
  - Entire card links to order detail
  - Hover: shadow + border primary accent
- **Pagination**: Previous/Next buttons + numbered page buttons, smooth scroll to top on page change
- **Empty State**: Package icon in orange circle, "No orders yet" message, "Start Shopping" CTA button
- **Loading Skeleton**: Table rows with pulsing skeletons for each column
- **Auth Guard**: Redirects to `/auth/login` if unauthenticated
- **Back to Account**: ArrowLeft ghost button at bottom

### File 2: `/src/app/account/orders/[id]/page.tsx` — Order Detail Page

**Features:**
- **Breadcrumb**: My Account > My Orders > Order Details
- **Page Header**: "Order Details" title + full order ID + Back to Orders button
- **Order Information Card**:
  - Status badge with icon (large, top-right of card header)
  - Order date (full date format with weekday) with Calendar icon
  - Payment method (COD → "Cash on Delivery") with CreditCard icon
  - Order notes (conditional) with FileText icon
- **Order Items List Card**:
  - Header: "Order Items (N)" with count
  - Each item: 80×80 product image (next/image with fallback Package icon), product name (line-clamp-2), quantity, line total (primary color)
  - Items separated by Separator components
- **Order Summary Card** (right sidebar):
  - Subtotal, Shipping (FREE in green for $0, else amount), Tax, Discount (green, conditional)
  - Separator
  - Total (bold, text-lg, primary color)
- **Shipping Address Card** (right sidebar):
  - MapPin icon in header
  - Full name, line1, line2 (conditional), city/state/zip, country, phone (conditional)
- **Not Found State**: Package icon, "Order Not Found" message, Back to Orders button
- **Loading Skeleton**: Full page skeleton with card placeholders
- **Auth Guard**: Redirects to `/auth/login` if unauthenticated

### File 3: `/src/app/account/wishlist/page.tsx` — Wishlist Page

**Features:**
- **Breadcrumb**: My Account > Wishlist
- **Page Header**: "My Wishlist" title + item count
- **Product Grid**: 1 col mobile, 2 col sm, 3 col lg responsive grid
- **Each Product Card**:
  - Product image with hover zoom effect (scale-105, 500ms transition)
  - Discount badge (top-left) when comparePrice > price
  - Remove button (Trash2 icon, top-right, opacity-0→visible on hover)
  - Out of stock overlay with badge
  - Category name, product name (line-clamp-2, hover primary), star rating + count, price with compare price
  - "Add to Cart" button (primary, full width) — uses `useCartStore.addItem()` + opens cart drawer
  - Loading states for remove (Loader2 spinner) and add-to-cart actions
- **Empty State**: Heart icon in rose-50 circle, "Your wishlist is empty" message, "Explore Products" CTA
- **Toast Notifications**: Success on add-to-cart, error for out of stock or failures, success on remove
- **Loading Skeleton**: 6 skeleton cards with aspect-square image + text bars
- **Auth Guard**: Redirects to `/auth/login` if unauthenticated

### File 4: `/src/app/account/addresses/page.tsx` — Addresses Page

**Features:**
- **Breadcrumb**: My Account > Addresses
- **Page Header**: "My Addresses" title + "Add New Address" button (opens Dialog)
- **Add New Address Card**: Dashed border card with Plus icon, hover orange accent, opens create dialog
- **Address Cards Grid**: 1 col mobile, 2 col sm responsive grid
- **Each Address Card**:
  - Default badge (top-right, primary) for default address, card has ring border
  - MapPin icon circle + full name
  - Full address: line1, line2 (conditional), city/state/zip, country (Globe icon), phone (Phone icon)
  - Action buttons: "Set as Default" (Home icon, conditional), "Edit" (Pencil icon), "Delete" (Trash2 icon, hover red, Loader2 spinner)
- **Address Dialog** (Dialog component):
  - Form fields: Full Name, Street Address, Address Line 2, City + State (2-col grid), ZIP + Country (2-col grid), Phone
  - All required fields marked with red asterisk + inline error validation
  - Default address toggle with Switch component + Home icon
  - Cancel / Save buttons, loading state with spinner
  - Supports both create (POST /api/addresses) and edit (PUT /api/addresses/[id])
- **Empty State**: MapPin icon in emerald-50 circle, "No saved addresses" message, "Add Your First Address" CTA
- **Toast Notifications**: Success/error for add, edit, delete, set default operations
- **Loading Skeleton**: 3 skeleton cards
- **Auth Guard**: Redirects to `/auth/login` if unauthenticated

### File 5: `/src/app/account/profile/page.tsx` — Profile Page

**Features:**
- **Breadcrumb**: My Account > Profile
- **Page Header**: "My Profile" title + descriptive subtitle
- **Profile Overview Card**:
  - Large avatar circle (primary/10 bg) with first letter initial
  - User name, email
  - Role badge (capitalize), joined date (Calendar icon)
- **Edit Profile Form Card**:
  - Header: User icon + "Personal Information" title + description
  - Name input with User icon prefix (pre-filled from session)
  - Email input with Mail icon prefix (pre-filled from session)
  - "Save Changes" button with loading spinner state
  - Validation: required name, email regex validation
  - On save: PUT /api/account/profile + `update()` session + success toast
- **Account Card** (danger zone):
  - Destructive-styled header with Shield icon
  - Sign Out button with destructive colors
  - On sign out: toast + signOut callback to `/`
- **SSR Safety**: `mounted` state prevents hydration mismatch
- **Loading Skeleton**: Page-level skeleton for header + cards
- **Auth Guard**: Redirects to `/auth/login` if unauthenticated

### Technical Details (All 5 Files)
- `'use client'` components
- Authentication: `useSession` from `next-auth/react` + redirect to `/auth/login`
- All API calls via `fetch` to existing endpoints (orders, wishlist, addresses, profile)
- shadcn/ui components: Button, Input, Label, Card, Badge, Separator, Skeleton, Table, Dialog, Switch
- Lucide icons throughout
- Toast notifications via `sonner`
- Cart integration: `useCartStore` for wishlist add-to-cart
- Mobile responsive with hidden/shown breakpoints
- Breadcrumb navigation on all pages
- Back to Account link at bottom of all pages
- Zero lint errors on all 5 new files (pre-existing lint error in account/page.tsx is unrelated)
