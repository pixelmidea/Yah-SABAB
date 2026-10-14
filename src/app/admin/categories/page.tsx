'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Loader2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setMsg({ text: '', isError: false });

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image })
      });
      const data = await res.json();

      if (data.success) {
        setName('');
        setDescription('');
        setImage('');
        setMsg({ text: 'Category created successfully!', isError: false });
        fetchCategories();
      } else {
        setMsg({ text: data.error || 'Failed to create category', isError: true });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Error occurred', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-[#100D0A] tracking-tight">
          Store Product Categories
        </h1>
        <p className="text-xs text-[#7A6E5D] mt-1">
          Manage product categories for Panjabi, Kabli Suit, Pajama, Combos, and Accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Category Form */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4 h-fit">
          <h2 className="font-serif font-bold text-[#100D0A] text-lg border-b border-[#E5DFD5] pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#E6AD35]" />
            <span>Add New Category</span>
          </h2>

          {msg.text && (
            <div className={`p-3 rounded-xl text-xs font-bold border ${msg.isError ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#6E6355] uppercase tracking-wider mb-1">Category Name *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Peshawari Kabli" className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] placeholder-[#9C9181] rounded-xl p-3 focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35]" />
            </div>

            <div>
              <label className="block font-bold text-[#6E6355] uppercase tracking-wider mb-1">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short category description..." className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] placeholder-[#9C9181] rounded-xl p-3 focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35]" />
            </div>

            <div>
              <label className="block font-bold text-[#6E6355] uppercase tracking-wider mb-1">Cover Image URL</label>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] placeholder-[#9C9181] rounded-xl p-3 focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35]" />
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl font-bold text-xs bg-[#E6AD35] text-[#100D0A] hover:bg-[#F5C451] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin text-[#100D0A]" /> : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E5DFD5] font-serif font-bold text-base text-[#100D0A] bg-[#F5F1EA]">
            Active Store Categories ({categories.length})
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#7A6E5D]">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#E6AD35] mb-2" />
              <span>Loading categories...</span>
            </div>
          ) : (
            <div className="divide-y divide-[#EBE6DC]">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center gap-4 hover:bg-[#FAF7F2] transition-colors">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400'} alt={cat.name} className="w-14 h-14 object-cover rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#100D0A] text-base">{cat.name}</h4>
                    <p className="text-xs text-[#7A6E5D] line-clamp-1">{cat.description || 'No description'}</p>
                    <span className="text-[10px] text-[#b0782e] font-mono font-bold">Slug: {cat.slug}</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
