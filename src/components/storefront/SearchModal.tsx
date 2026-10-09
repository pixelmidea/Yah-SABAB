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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div className="bg-[#14110d] text-[#f7f3eb] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#c9933a]/30">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#c9933a]/20 flex items-center gap-3 bg-[#1a1612]">
          <Search className="w-6 h-6 text-[#c9933a] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Panjabi, Kabli, Cotton, SKU..."
            className="w-full bg-transparent text-[#f7f3eb] placeholder:text-[#8c8071] font-medium text-base sm:text-lg focus:outline-hidden"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-[#c9933a] animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#29221a] text-[#a89b88] hover:text-[#f7f3eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <div className="py-6 text-center">
              <p className="text-xs font-semibold text-[#8c8071] uppercase tracking-widest mb-3">Popular Searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Embroidered Panjabi',
                  'Peshawari Kabli',
                  'Silk Blend',
                  'Festive Combo',
                  'White Jummah Special',
                  'Egyptian Cotton'
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs font-medium text-[#d6cdbf] bg-[#221c16] hover:bg-[#2e261e] hover:text-[#c9933a] px-3.5 py-1.5 rounded-full transition-all border border-[#c9933a]/25"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-[#a89b88]">
              <p className="text-base font-semibold text-[#f7f3eb]">No matching products found</p>
              <p className="text-xs text-[#8c8071] mt-1">Try searching by collection, fabric, or color</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#221c16] border border-transparent hover:border-[#c9933a]/30 transition-all group"
                >
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=200'}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded-xl bg-[#26201a] shrink-0 border border-[#c9933a]/20 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#f7f3eb] group-hover:text-[#c9933a] transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#8c8071] mt-0.5">SKU: {product.sku}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#c9933a]">
                        {formatPrice(product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price)}
                      </span>
                      {product.discountPrice && product.discountPrice < product.price && (
                        <span className="text-xs text-[#6e6356] line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8c8071] group-hover:text-[#c9933a] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
