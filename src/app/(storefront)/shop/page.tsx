'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, ArrowUpDown, Sparkles, RotateCcw } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#f7f3eb]">
      {/* Header Banner */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-[#c9933a]/25 pb-7 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#c9933a] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HAUTE MENSWEAR CATALOG</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#f7f3eb]">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#a89b88] mt-1.5">
            Discover {pagination.total} handcrafted Panjabis, Peshawari Kablis, and festive sets.
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c9933a]/30 bg-[#17130f] text-xs font-bold text-[#f5eedb]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#c9933a]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-[#17130f] border border-[#c9933a]/30 rounded-xl px-3.5 py-2 text-xs font-medium">
            <ArrowUpDown className="w-4 h-4 text-[#c9933a] shrink-0" />
            <span className="text-[#8c8071] hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-semibold text-[#f5eedb] focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="newest" className="bg-[#17130f] text-[#f5eedb]">Newest Arrivals</option>
              <option value="price-asc" className="bg-[#17130f] text-[#f5eedb]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#17130f] text-[#f5eedb]">Price: High to Low</option>
              <option value="popular" className="bg-[#17130f] text-[#f5eedb]">Most Popular</option>
              <option value="best-rated" className="bg-[#17130f] text-[#f5eedb]">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (DESKTOP + MOBILE SLIDE-IN) */}
        <aside
          className={`lg:block ${
            isMobileFiltersOpen ? 'fixed inset-0 z-50 p-6 overflow-y-auto bg-[#0e0c0a]/95 backdrop-blur-xl' : 'hidden'
          } space-y-6 bg-[#14100c] p-6 rounded-2xl border border-[#c9933a]/25 shadow-xl h-fit lg:sticky lg:top-28`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#c9933a]/20">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#c9933a]" />
              <h3 className="font-serif font-bold text-[#f7f3eb] text-lg">Filter Garments</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#c9933a] hover:text-[#e2cb97] underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              {isMobileFiltersOpen && (
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="lg:hidden ml-2 px-3 py-1 bg-[#221b14] rounded-lg text-xs font-bold text-[#f5eedb] border border-[#c9933a]/30"
                >
                  Apply
                </button>
              )}
            </div>
          </div>

          {/* Search Input Filter */}
          <div>
            <label className="block text-xs font-bold text-[#a89b88] uppercase tracking-wider mb-2">
              Keyword / SKU
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, fabric, SKU..."
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl py-2 px-3 pl-9 text-xs sm:text-sm text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <Search className="w-4 h-4 text-[#8c8071] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-[#a89b88] uppercase tracking-wider mb-2.5">
              Category
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold shadow-md'
                    : 'text-[#d6cdbf] hover:bg-[#221a14] hover:text-[#f7f3eb]'
                }`}
              >
                <span>All Collections</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] font-bold shadow-md'
                      : 'text-[#d6cdbf] hover:bg-[#221a14] hover:text-[#f7f3eb]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-bold text-[#a89b88] uppercase tracking-wider mb-2.5">
              Select Size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['38', '40', '42', '44', '46', 'M', 'L', 'XL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedSize === sz
                      ? 'bg-[#c9933a] text-[#0e0c0a] border-[#c9933a] shadow-md'
                      : 'bg-[#1c1611] text-[#b8ab99] border-[#34291f] hover:border-[#c9933a]/60'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold text-[#a89b88] uppercase tracking-wider mb-2.5">
              Price Range (BDT ৳)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ৳"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-3 py-2 text-xs font-medium text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ৳"
                className="w-full bg-[#1c1611] border border-[#c9933a]/30 rounded-xl px-3 py-2 text-xs font-medium text-[#f7f3eb] placeholder:text-[#6e6153] focus:outline-hidden focus:border-[#c9933a]"
              />
            </div>
          </div>

          {/* Badge Toggles */}
          <div className="space-y-2 pt-3 border-t border-[#c9933a]/20">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#d6cdbf]">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded-md accent-[#c9933a]"
              />
              <span>New Arrivals Only</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#d6cdbf]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded-md accent-[#c9933a]"
              />
              <span>Featured & Offers Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCT GRID LIST */}
        <main className="lg:col-span-3">
          {loading ? (
            /* Shimmer Skeleton Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#15120e] rounded-2xl overflow-hidden border border-[#c9933a]/15 p-4 space-y-4">
                  <div className="aspect-3/4 w-full rounded-xl animate-shimmer bg-[#221b14]" />
                  <div className="h-4 w-2/3 rounded-md animate-shimmer bg-[#221b14]" />
                  <div className="h-4 w-1/3 rounded-md animate-shimmer bg-[#221b14]" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[420px] bg-[#14100c] rounded-3xl border border-[#c9933a]/25 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#251e16] rounded-full flex items-center justify-center text-[#c9933a] mb-4 border border-[#c9933a]/30">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#f7f3eb]">No Matching Garments Found</h3>
              <p className="text-xs sm:text-sm text-[#a89b88] max-w-sm mt-1.5 mb-6">
                Try loosening your filters, adjusting your price range, or clearing the search terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-gradient-to-r from-[#c9933a] to-[#ab752b] text-[#0e0c0a] text-xs font-bold px-7 py-3 rounded-xl hover:opacity-95 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-10 border-t border-[#c9933a]/20">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    className="px-5 py-2.5 rounded-xl border border-[#c9933a]/30 text-xs font-bold disabled:opacity-30 hover:bg-[#221a14] text-[#f5eedb] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-[#a89b88] px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    className="px-5 py-2.5 rounded-xl border border-[#c9933a]/30 text-xs font-bold disabled:opacity-30 hover:bg-[#221a14] text-[#f5eedb] transition-colors"
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
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-[#c9933a] font-serif">Curating catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
