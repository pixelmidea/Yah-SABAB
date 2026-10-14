'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  Tag,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [isNewArrival, setIsNewArrival] = useState(searchParams.get('isNewArrival') === 'true');
  const [isFeatured, setIsFeatured] = useState(searchParams.get('isFeatured') === 'true');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSize, minPrice, maxPrice, sort, isNewArrival, isFeatured, search, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSize) params.append('size', selectedSize);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      if (isNewArrival) params.append('isNewArrival', 'true');
      if (isFeatured) params.append('isFeatured', 'true');
      params.append('page', pagination.page.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedSize('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setIsNewArrival(false);
    setIsFeatured(false);
  };

  // Helper to get category icons matching the reference image
  const getCategoryIcon = (slug: string) => {
    if (slug.includes('micro') || slug.includes('d-tex')) {
      return <Sparkles className="w-4 h-4 shrink-0" />;
    }
    if (slug.includes('popcorn')) {
      return <Tag className="w-4 h-4 shrink-0" />;
    }
    if (slug.includes('thobe') || slug.includes('kanduri')) {
      return <Layers className="w-4 h-4 shrink-0" />;
    }
    return <Sparkles className="w-4 h-4 shrink-0" />;
  };

  return (
    <div className="min-h-screen text-[#f7f3eb] pb-16">
      {/* 1. CINEMATIC EDITORIAL HERO BANNER (Exact Match to Reference Image) */}
      <section className="relative w-full overflow-hidden bg-[#0a0806] border-b border-[#403221]/40 mb-8">
        <div className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] flex items-center">
          {/* Background Imagery with Studio Fashion Rack & Warm Golden Lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="/shop-hero.jpg"
              alt="Curated Panjabi & Arabian Thobe Collection"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />
            {/* Dark luxury editorial gradient overlay for left readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0806] via-[#0a0806]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0a0806]/50" />
          </div>

          <div className="relative z-10 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Content */}
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[#e6ad35] uppercase tracking-widest">
                <span>ARABIC KANDURI & PANJABI COLLECTION</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f7f3eb] leading-[1.1]">
                Curated Collections
              </h1>
              <p className="text-xs sm:text-sm text-[#d6cdbf] font-light max-w-md pt-1 leading-relaxed">
                Discover exclusive D-Tex Micro Stitch, China Popcorn Panjabis & authentic imported Arabian Thobes.
              </p>
            </div>

            {/* Right Editorial Calligraphy Slogan Matching Reference Image */}
            <div className="hidden lg:block text-right pr-6 -rotate-6 select-none">
              <span className="font-script text-3xl sm:text-4xl text-[#e6ad35] tracking-wide block drop-shadow-lg leading-tight">
                Traditional
              </span>
              <span className="font-script text-2xl text-[#f7f3eb] tracking-wider block -my-1 opacity-90">
                Meets
              </span>
              <span className="font-script text-3xl sm:text-4xl text-[#e6ad35] tracking-wide block drop-shadow-lg leading-tight">
                Modern Style
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN DISCOVERY CONTENT (Sidebar + 4-Col Grid) */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Sort & Mobile Filter Toolbar */}
        <div className="flex items-center justify-between lg:justify-end gap-3 mb-5">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-[#382c1f] bg-[#14100c] text-xs font-bold text-[#f5eedb] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#e6ad35]" />
            <span>Filter Garments</span>
          </button>

          {/* Sort Dropdown Styled to Match Reference Image */}
          <div className="flex items-center gap-2 bg-[#14100c] border border-[#382c1f] rounded-xl px-3.5 py-1.5 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#e6ad35] shrink-0" />
            <span className="text-[#a89b88]">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-bold text-[#f5eedb] focus:outline-hidden text-xs cursor-pointer border-none pr-1"
            >
              <option value="newest" className="bg-[#14100c] text-[#f5eedb]">Newest Arrivals</option>
              <option value="price-asc" className="bg-[#14100c] text-[#f5eedb]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#14100c] text-[#f5eedb]">Price: High to Low</option>
              <option value="popular" className="bg-[#14100c] text-[#f5eedb]">Most Popular</option>
              <option value="best-rated" className="bg-[#14100c] text-[#f5eedb]">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Main 2-Pane Layout (Sidebar ~280px + Full Width Product Area) */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-7 items-start">
          {/* SIDEBAR FILTERS (Left Card ~280px) */}
          <aside
            className={`lg:block ${
              isMobileFiltersOpen ? 'fixed inset-0 z-50 p-6 overflow-y-auto bg-[#0a0806]/95 backdrop-blur-xl' : 'hidden'
            } w-full lg:w-[280px] xl:w-[290px] shrink-0 space-y-5 bg-[#14100c] p-5 rounded-2xl border border-[#2e2318] shadow-xl h-fit lg:sticky lg:top-24`}
          >
            {/* Filter Header with Reset */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#382c1f]/50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#e6ad35]" />
                <h3 className="font-serif font-bold text-[#f7f3eb] text-base">Filter Garments</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#e6ad35] hover:text-[#f5c451] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                {isMobileFiltersOpen && (
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="lg:hidden ml-2 px-3 py-1 bg-[#221b14] rounded-lg text-xs font-bold text-[#f5eedb] border border-[#c9933a]/30 cursor-pointer flex items-center gap-1.5 hover:bg-[#2e2318]"
                  >
                    <X className="w-3.5 h-3.5 text-[#e6ad35]" />
                    <span>Done</span>
                  </button>
                )}
              </div>
            </div>

            {/* Keyword / SKU Filter */}
            <div>
              <label className="block text-[10px] font-bold text-[#a89b88] uppercase tracking-wider mb-2">
                KEYWORD / SKU
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, fabric, SKU..."
                  className="w-full bg-[#1c1611] border border-[#382c1f] rounded-xl py-2 px-3 pl-8 text-xs text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#e6ad35]"
                />
                <Search className="w-3.5 h-3.5 text-[#8c8071] absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter Matching Reference Design */}
            <div>
              <label className="block text-[10px] font-bold text-[#a89b88] uppercase tracking-wider mb-2">
                CATEGORY
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#e6ad35] text-[#0e0c0a] font-bold shadow-xs'
                      : 'text-[#d6cdbf] hover:bg-[#1e1812] hover:text-[#f7f3eb]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>All Collections</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-[#e6ad35] text-[#0e0c0a] font-bold shadow-xs'
                        : 'text-[#d6cdbf] hover:bg-[#1e1812] hover:text-[#f7f3eb]'
                    }`}
                  >
                    {getCategoryIcon(cat.slug)}
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector Grid (4x2 Matrix matching Reference Image) */}
            <div>
              <label className="block text-[10px] font-bold text-[#a89b88] uppercase tracking-wider mb-2">
                SELECT SIZE
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['38', '40', '42', '44', '46', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center ${
                      selectedSize === sz
                        ? 'bg-[#e6ad35] text-[#0e0c0a] border-[#e6ad35] shadow-xs'
                        : 'bg-[#1c1611] text-[#b8ab99] border-[#382f25] hover:border-[#e6ad35]/60'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter with Range Track matching Reference Image */}
            <div>
              <label className="block text-[10px] font-bold text-[#a89b88] uppercase tracking-wider mb-2">
                PRICE RANGE (BDT ৳)
              </label>
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="৳ Min"
                    className="w-full bg-[#1c1611] border border-[#382c1f] rounded-xl px-3 py-1.5 text-xs text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#e6ad35]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="৳ Max"
                    className="w-full bg-[#1c1611] border border-[#382c1f] rounded-xl px-3 py-1.5 text-xs text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#e6ad35]"
                  />
                </div>
                {/* Visual Dual-Slider Track */}
                <div className="relative pt-2 pb-1 px-1">
                  <div className="h-1.5 bg-[#251e17] rounded-full w-full relative">
                    <div className="absolute left-[10%] right-[15%] top-0 bottom-0 bg-[#e6ad35] rounded-full" />
                    <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#e6ad35] border-2 border-[#14100c] shadow-sm cursor-pointer hover:scale-110 transition-transform" />
                    <div className="absolute right-[15%] top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#e6ad35] border-2 border-[#14100c] shadow-sm cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Toggles */}
            <div className="space-y-2 pt-2.5 border-t border-[#382c1f]/40">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#d6cdbf]">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#e6ad35]"
                />
                <span>New Drops Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#d6cdbf]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#e6ad35]"
                />
                <span>Signature / Best Sellers</span>
              </label>
            </div>
          </aside>

          {/* PRODUCT GRID LIST (4 Columns on Desktop matching reference image) */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#14100c] rounded-2xl overflow-hidden border border-[#2e2318] p-3 space-y-3">
                    <div className="aspect-[4/5] w-full rounded-xl animate-shimmer bg-[#221b14]" />
                    <div className="h-4 w-2/3 rounded-md animate-shimmer bg-[#221b14]" />
                    <div className="h-4 w-1/3 rounded-md animate-shimmer bg-[#221b14]" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="min-h-[380px] bg-[#14100c] rounded-2xl border border-[#2e2318] p-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-[#251e16] rounded-full flex items-center justify-center text-[#e6ad35] mb-3 border border-[#403221]/40">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#f7f3eb]">No Matching Garments Found</h3>
                <p className="text-xs text-[#a89b88] max-w-sm mt-1 mb-5">
                  Try adjusting your category, size, or price range filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 4 Cards Per Row on Desktop screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#382c1f]/40">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                      className="px-4 py-2 rounded-xl border border-[#382c1f] text-xs font-bold disabled:opacity-30 hover:bg-[#221a14] text-[#f5eedb] transition-colors cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold text-[#a89b88] px-2">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                      className="px-4 py-2 rounded-xl border border-[#382c1f] text-xs font-bold disabled:opacity-30 hover:bg-[#221a14] text-[#f5eedb] transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-[#c9933a] font-serif">Curating catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
