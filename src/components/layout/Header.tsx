"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ChefHat,
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  Shield,
  ClipboardList,
} from "lucide-react";
import CartDrawer from "./CartDrawer";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
}

/* ========== Announcement Bar ========== */
function AnnouncementBar({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="bg-primary text-primary-foreground text-xs py-1.5 text-center relative">
      <span className="font-medium">
        🚚 Free shipping on orders over $50 — Shop now & save!
      </span>
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ========== Search Bar ========== */
function SearchBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setShowResults(false);
    }
  }, [isOpen]);

  // Close results on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data || []);
        setShowResults(true);
      }
    } catch {
      // Silently handle search errors
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300);
    },
    [handleSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setShowResults(false);
        onClose();
        router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, onClose, router]
  );

  const handleResultClick = useCallback(
    (slug: string) => {
      setShowResults(false);
      setQuery("");
      onClose();
      router.push(`/products/${slug}`);
    },
    [onClose, router]
  );

  return (
    <div
      ref={searchRef}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="border-b border-border bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for kitchen products, tools, ingredients..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10 pr-10 h-10 bg-muted/50 border-border focus:bg-white"
            />
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setShowResults(false);
                onClose();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showResults && query.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {isSearching ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No products found for &quot;{query}&quot;
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {result.name}
                        </p>
                        <p className="text-sm text-primary font-semibold">
                          ${result.price.toFixed(2)}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground rotate-[-90deg] flex-shrink-0" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-3 py-2.5 text-center text-sm text-primary font-medium hover:bg-muted/50 border-t border-border transition-colors"
                  >
                    View all results for &quot;{query}&quot;
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ========== Desktop Categories Dropdown ========== */
function CategoriesDropdown({
  categories,
  isScrolled,
}: {
  categories: Category[];
  isScrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${isScrolled
          ? "text-foreground hover:text-primary"
          : "text-slate-600 hover:text-primary"
          }`}
      >
        Categories
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="bg-white rounded-lg border border-border shadow-xl py-2 min-w-[220px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              All Categories
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span>{cat.name}</span>
                {cat._count && (
                  <span className="text-xs text-muted-foreground">
                    {cat._count.products}
                  </span>
                )}
              </Link>
            ))}
            <Separator className="my-1" />
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Mobile Nav Link ========== */
function MobileNavLink({
  href,
  children,
  onClick,
  active,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
        ? "bg-primary/10 text-primary"
        : "text-foreground hover:bg-muted"
        }`}
    >
      {children}
    </Link>
  );
}

/* ========== Main Header Component ========== */
export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  // Wishlist count
  const [wishlistCount, setWishlistCount] = useState(0);

  // Cart
  const { getItemCount, openCart, isOpen: cartOpen } = useCartStore();
  const cartCount = getItemCount();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {
        // Categories will be empty
      }
    }
    fetchCategories();
  }, []);

  // Fetch wishlist count for logged-in users
  useEffect(() => {
    let cancelled = false;
    async function fetchWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setWishlistCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {
        // Wishlist fetch failed
      }
    }
    if (session?.user) {
      fetchWishlist();
    }
    return () => { cancelled = true; };
  }, [session?.user]);

  // Sync mobile menu and search with pathname changes
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Use queueMicrotask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      });
    }
  }, [pathname]);

  // Nav links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userRole = (session?.user as any)?.role;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
            ? "bg-white shadow-md"
            : "bg-[#ffffff]"
          }`}
      >
        {/* Announcement Bar */}
        <AnnouncementBar
          visible={announcementVisible}
          onDismiss={() => setAnnouncementVisible(false)}
        />

        {/* Main Navigation Bar */}
        <nav className="h-16 flex items-center px-4 lg:px-8">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu
                  className={`h-5 w-5 ${isScrolled ? "text-foreground" : "text-slate-600"}`}
                />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
                <Image className="md:w-full w-1/2" src="/logo.png" alt="LaventerPrise Logo" width={180} height={80} />
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.href)
                    ? isScrolled
                      ? "text-primary bg-primary/10"
                      : "text-primary bg-primary/5"
                    : isScrolled
                      ? "text-slate-600 hover:text-primary hover:bg-slate-100"
                      : "text-slate-500 hover:text-primary hover:bg-slate-50"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <CategoriesDropdown
                categories={categories}
                isScrolled={isScrolled}
              />

              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.href)
                    ? isScrolled
                      ? "text-primary bg-primary/10"
                      : "text-primary bg-primary/5"
                    : isScrolled
                      ? "text-slate-600 hover:text-primary hover:bg-slate-100"
                      : "text-slate-500 hover:text-primary hover:bg-slate-50"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`relative flex items-center justify-center h-9 w-9 rounded-md transition-colors ${
                  searchOpen
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 hover:text-primary hover:bg-primary/10"
                }`}
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className={`relative flex items-center justify-center h-9 w-9 rounded-md transition-colors ${
                  isActive("/account/wishlist") || wishlistCount > 0
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 hover:text-primary hover:bg-primary/10"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold px-1">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative flex items-center justify-center h-9 w-9 rounded-md transition-colors ${isScrolled
                  ? "text-foreground hover:text-primary hover:bg-muted/50"
                  : "text-slate-600 hover:text-primary hover:bg-slate-100"
                  }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold px-1">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center justify-center h-9 w-9 rounded-md transition-colors ${isScrolled
                      ? "text-foreground hover:text-primary hover:bg-muted/50"
                      : "text-slate-600 hover:text-primary hover:bg-slate-100"
                      }`}
                    aria-label="User account"
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {session?.user ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            My Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/orders" className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/wishlist" className="cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            Wishlist
                          </Link>
                        </DropdownMenuItem>
                        {userRole === "ADMIN" && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/login" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/register" className="cursor-pointer">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80 p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5"
              >
              <Image src="/logo.png" alt="LaventerPrise Logo" width={180} height={80} />
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>
          </SheetHeader>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-2">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  active={isActive(link.href)}
                >
                  {link.label}
                </MobileNavLink>
              ))}

              {/* Categories Section */}
              {categories.length > 0 && (
                <>
                  <div className="px-4 pt-4 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </span>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <span>{cat.name}</span>
                      {cat._count && (
                        <span className="text-xs text-muted-foreground">
                          {cat._count.products}
                        </span>
                      )}
                    </Link>
                  ))}
                </>
              )}

              <div className="my-2">
                <Separator />
              </div>

              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  active={isActive(link.href)}
                >
                  {link.label}
                </MobileNavLink>
              ))}

              <div className="my-2">
                <Separator />
              </div>

              {/* Account Links */}
              {session?.user ? (
                <div className="space-y-0.5">
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Account
                    </span>
                  </div>
                  <MobileNavLink href="/account" onClick={() => setMobileMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </MobileNavLink>
                  <MobileNavLink
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </MobileNavLink>
                  <MobileNavLink
                    href="/account/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-full bg-primary text-white text-[10px] font-bold px-1.5">
                        {wishlistCount}
                      </span>
                    )}
                  </MobileNavLink>
                  {userRole === "ADMIN" && (
                    <MobileNavLink href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </MobileNavLink>
                  )}
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className="px-4 pt-3 pb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Account
                    </span>
                  </div>
                  <MobileNavLink
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </MobileNavLink>
                  <MobileNavLink
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Create Account
                  </MobileNavLink>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 border-t border-border p-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => setSearchOpen(true), 200);
              }}
            >
              <Search className="h-4 w-4" />
              Search Products
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 relative"
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Shopping Cart
              {cartCount > 0 && (
                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-full bg-primary text-white text-[10px] font-bold px-1.5">
                  {cartCount}
                </span>
              )}
            </Button>
            {session?.user && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
