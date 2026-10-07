'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-amber-950/10">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/80">
          <Search className="w-6 h-6 text-amber-900 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Panjabi, Kabli, SKU (e.g. PAN-BLU-001)..."
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-base focus:outline-hidden"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-amber-700 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-4">
          {!query.trim() ? (
            <div className="py-6 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Embroidered Panjabi', 'Peshawari Kabli', 'White Aligarh Pajama', 'Eid Collection', 'Festive Combo'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs font-medium text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors border border-amber-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-base font-semibold text-slate-800">No matching products found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by category, fabric, or color</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 transition-all group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400">SKU: {product.sku}</p>
                    <div className="text-xs font-bold text-amber-900 mt-0.5">
                      {formatPrice(product.discountPrice || product.price)}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-900 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* View All Search Results Footer */}
        {query.trim() && results.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 inline-flex items-center gap-1"
            >
              See all results for "{query}" →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
