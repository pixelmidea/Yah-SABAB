'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, X, Loader2, ArrowUpDown } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-amber-950/10 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Store Collection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse premium Panjabis, Kablis, Pajamas, and Accessories. Total {pagination.total} products available.
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-900" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium">
            <ArrowUpDown className="w-4 h-4 text-amber-900 shrink-0" />
            <span className="text-xs text-slate-400 hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden text-xs sm:text-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="best-rated">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS (DESKTOP) */}
        <aside className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit sticky top-28`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-900" />
              <h3 className="font-serif font-bold text-slate-900 text-lg">Filter Products</h3>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
            >
              Reset All
            </button>
          </div>

          {/* Search Input Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Keyword / SKU
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, SKU..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-sm focus:outline-hidden focus:border-amber-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Category
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-amber-900 text-white'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-amber-900 text-white'
                      : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Available Sizes
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedSize === sz
                      ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Price Range (BDT ৳)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ৳"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-amber-700"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ৳"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-amber-700"
              />
            </div>
          </div>

          {/* Badge Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded-md accent-amber-900"
              />
              <span>New Arrivals Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded-md accent-amber-900"
              />
              <span>Featured & Offers Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCT GRID LIST */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-amber-900 py-16">
              <Loader2 className="w-10 h-10 animate-spin mb-3" />
              <p className="text-sm font-semibold">Loading catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[400px] bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-900 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">No products match your criteria</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                Try adjusting your category filter, price range, or search keyword.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-amber-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-amber-950 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-amber-50 text-slate-800"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-slate-600 px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold disabled:opacity-40 hover:bg-amber-50 text-slate-800"
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
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
