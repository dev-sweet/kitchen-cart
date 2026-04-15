"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product/ProductCard";
import { StarRating } from "@/components/shared/StarRating";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
  category: { name: string; slug: string };
  featured: boolean;
  stock: number;
}

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "Over $100", min: 100, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
];

const ITEMS_PER_PAGE = 12;

interface FilterPanelProps {
  isLoadingCategories: boolean;
  categories: Category[];
  selectedCategories: string[];
  selectedPriceRange: string;
  selectedMinRating: string;
  inStockOnly: boolean;
  onCategoryToggle: (id: string) => void;
  onPriceRangeChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onInStockToggle: (checked: boolean) => void;
}

function FilterPanel({
  isLoadingCategories,
  categories,
  selectedCategories,
  selectedPriceRange,
  selectedMinRating,
  inStockOnly,
  onCategoryToggle,
  onPriceRangeChange,
  onRatingChange,
  onInStockToggle,
}: FilterPanelProps) {
  return (
    <div className="space-y-1">
      <AccordionItem value="categories">
        <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
          Categories
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {isLoadingCategories
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))
              : categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => onCategoryToggle(cat.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
                      {cat.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({cat._count?.products || 0})
                    </span>
                  </label>
                ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
          Price Range
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <label
                key={range.label}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPriceRange === range.label
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedPriceRange === range.label && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rating">
        <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
          Rating
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2.5">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedMinRating === String(rating)
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedMinRating === String(rating) && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <StarRating rating={rating} size={14} />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  & Up
                </span>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stock">
        <AccordionTrigger className="text-sm font-semibold text-foreground py-3">
          Availability
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="in-stock-toggle"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              In Stock Only
            </Label>
            <Switch
              id="in-stock-toggle"
              checked={inStockOnly}
              onCheckedChange={onInStockToggle}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  console.log(' Search Params:', Object.fromEntries(searchParams.entries())); // Debug log
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const pageParam = parseInt(searchParams.get("page") || "1");
  const categoryIdParam = searchParams.get("categoryId") || "";
  const minRatingParam = searchParams.get("minRating") || "";
  const priceRangeParam = searchParams.get("priceRange") || "";
  const inStockParam = searchParams.get("inStock") || "";

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Filter state (local, synced to URL)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryIdParam ? categoryIdParam.split(",") : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRangeParam);
  const [selectedMinRating, setSelectedMinRating] = useState(minRatingParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam === "true");
  const [sortBy, setSortBy] = useState(sortParam);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Mobile filter sheet
  const [filterOpen, setFilterOpen] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedPriceRange) count++;
    if (selectedMinRating) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategories, selectedPriceRange, selectedMinRating, inStockOnly]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsLoadingCategories(false);
      })
      .catch(() => {
        setIsLoadingCategories(false);
      });
  }, []);

  // Update URL params
  const updateURL = useCallback(
    (params: {
      categories?: string[];
      priceRange?: string;
      minRating?: string;
      inStock?: boolean;
      sort?: string;
      page?: number;
      search?: string;
    }) => {
      const newParams = new URLSearchParams();

      if (params.search) newParams.set("search", params.search);
      if (params.categories && params.categories.length > 0)
        newParams.set("categoryId", params.categories.join(","));
      if (params.priceRange) newParams.set("priceRange", params.priceRange);
      if (params.minRating) newParams.set("minRating", params.minRating);
      if (params.inStock) newParams.set("inStock", "true");
      if (params.sort && params.sort !== "newest")
        newParams.set("sort", params.sort);
      if (params.page && params.page > 1) newParams.set("page", String(params.page));

      const queryString = newParams.toString();
      router.push(`/shop${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router]
  );

  // Fetch products
  useEffect(() => {
    const apiParams = new URLSearchParams();
    apiParams.set("page", String(currentPage));
    apiParams.set("limit", String(ITEMS_PER_PAGE));
    apiParams.set("sort", sortBy);

    if (selectedCategories.length > 0) {
      apiParams.set("categoryId", selectedCategories.join(","));
    }
    if (searchQuery) {
      apiParams.set("search", searchQuery);
    }
    if (inStockOnly) {
      apiParams.set("inStock", "true");
    }

    fetch(`/api/products?${apiParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        let filtered = data.data || [];

        // Client-side price filtering
        if (selectedPriceRange) {
          const range = PRICE_RANGES.find(
            (r) => r.label === selectedPriceRange
          );
          if (range) {
            filtered = filtered.filter(
              (p: Product) => p.price >= range.min && p.price <= range.max
            );
          }
        }

        // Client-side rating filtering
        if (selectedMinRating) {
          const minRating = parseInt(selectedMinRating);
          filtered = filtered.filter(
            (p: Product) => p.rating >= minRating
          );
        }

        setProducts(filtered);
        setTotalProducts(data.total);
        setTotalPages(data.totalPages);
        setIsLoadingProducts(false);
      })
      .catch(() => {
        setProducts([]);
        setIsLoadingProducts(false);
      });
  }, [
    currentPage,
    sortBy,
    selectedCategories,
    searchQuery,
    inStockOnly,
    selectedPriceRange,
    selectedMinRating,
  ]);

  // Handlers
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
    setCurrentPage(1);
    updateURL({
      categories: newCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchQuery,
      page: 1,
    });
  };

  const handlePriceRangeChange = (value: string) => {
    const newRange = selectedPriceRange === value ? "" : value;
    setSelectedPriceRange(newRange);
    setCurrentPage(1);
    updateURL({
      categories: selectedCategories,
      priceRange: newRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchQuery,
      page: 1,
    });
  };

  const handleRatingChange = (value: string) => {
    const newRating = selectedMinRating === value ? "" : value;
    setSelectedMinRating(newRating);
    setCurrentPage(1);
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: newRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchQuery,
      page: 1,
    });
  };

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked);
    setCurrentPage(1);
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: checked,
      sort: sortBy,
      search: searchQuery,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: value,
      search: searchQuery,
      page: 1,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchInput,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchQuery,
      page: newPage,
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange("");
    setSelectedMinRating("");
    setInStockOnly(false);
    setSortBy("newest");
    setSearchInput("");
    setCurrentPage(1);
    router.push("/shop", { scroll: false });
  };

  // Mobile filter apply
  const applyMobileFilters = () => {
    updateURL({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      minRating: selectedMinRating,
      inStock: inStockOnly,
      sort: sortBy,
      search: searchQuery,
      page: 1,
    });
    setFilterOpen(false);
  };

  // Pagination range
  const getPaginationRange = () => {
    const range: (number | "...")[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) range.push(i);

      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  // Filter panel props
  const filterPanelProps = {
    isLoadingCategories,
    categories,
    selectedCategories,
    selectedPriceRange,
    selectedMinRating,
    inStockOnly,
    onCategoryToggle: handleCategoryToggle,
    onPriceRangeChange: handlePriceRangeChange,
    onRatingChange: handleRatingChange,
    onInStockToggle: handleInStockToggle,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/5 via-orange-50 to-amber-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {searchQuery ? (
                  <>
                    Search Results for &ldquo;
                    <span className="text-primary">{searchQuery}</span>&rdquo;
                  </>
                ) : (
                  "All Products"
                )}
              </h1>
              {!isLoadingProducts && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {products.length} product{products.length !== 1 ? "s" : ""} found
                  {totalProducts > products.length &&
                    ` (filtered from ${totalProducts})`}
                </p>
              )}
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative w-full sm:w-80"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9 bg-white border-border/80"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setCurrentPage(1);
                    updateURL({
                      categories: selectedCategories,
                      priceRange: selectedPriceRange,
                      minRating: selectedMinRating,
                      inStock: inStockOnly,
                      sort: sortBy,
                      search: "",
                      page: 1,
                    });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Toolbar: Sort + Filter button + Active filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile filter button */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 sm:w-96 p-0 overflow-y-auto">
                <SheetHeader className="p-4 pb-0 border-b">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-semibold">
                      Filters
                    </SheetTitle>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </SheetHeader>
                <div className="p-4">
                  <Accordion
                    type="multiple"
                    defaultValue={["categories", "price", "rating", "stock"]}
                  >
                    <FilterPanel {...filterPanelProps} />
                  </Accordion>
                </div>
                <div className="p-4 border-t sticky bottom-0 bg-background">
                  <Button
                    onClick={applyMobileFilters}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Apply Filters
                    {products.length > 0 && (
                      <span className="ml-2 text-sm opacity-80">
                        ({products.length} results)
                      </span>
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return cat ? (
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="gap-1 text-xs cursor-pointer hover:bg-primary/10"
                      onClick={() => handleCategoryToggle(catId)}
                    >
                      {cat.name}
                      <X className="w-3 h-3" />
                    </Badge>
                  ) : null;
                })}
                {selectedPriceRange && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handlePriceRangeChange(selectedPriceRange)}
                  >
                    {selectedPriceRange}
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                {selectedMinRating && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleRatingChange(selectedMinRating)}
                  >
                    {selectedMinRating}+ Stars
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleInStockToggle(false)}
                  >
                    In Stock
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <Accordion
                type="multiple"
                defaultValue={["categories", "price", "rating", "stock"]}
                className="w-full"
              >
                <FilterPanel {...filterPanelProps} />
              </Accordion>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoadingProducts ? (
              /* Loading Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-3 space-y-2.5">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <PackageSearch className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  {searchQuery
                    ? `We couldn't find any products matching "${searchQuery}". Try a different search term or adjust your filters.`
                    : "No products match your current filters. Try removing some filters to see more results."}
                </p>
                <div className="flex gap-3">
                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </Button>
                  )}
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/shop">View All Products</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          totalProducts
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {totalProducts}
                      </span>{" "}
                      products
                    </p>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>

                      {getPaginationRange().map((item, idx) =>
                        item === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        ) : (
                          <Button
                            key={item}
                            variant={
                              currentPage === item ? "default" : "outline"
                            }
                            size="icon"
                            className={`h-9 w-9 ${
                              currentPage === item
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                : ""
                            }`}
                            onClick={() => handlePageChange(item as number)}
                          >
                            {item}
                          </Button>
                        )
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
