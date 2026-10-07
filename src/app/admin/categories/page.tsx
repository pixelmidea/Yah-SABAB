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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Store Product Categories
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage product categories for Panjabi, Kabli Suit, Pajama, Combos, and Accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Category Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 h-fit">
          <h2 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-900" />
            <span>Add New Category</span>
          </h2>

          {msg.text && (
            <div className={`p-3 rounded-xl text-xs font-bold ${msg.isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Category Name *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Peshawari Kabli" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short category description..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden" />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Cover Image URL</label>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-hidden" />
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl font-bold text-xs bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-serif font-bold text-base text-slate-900">
            Active Store Categories ({categories.length})
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading categories...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center gap-4 hover:bg-amber-50/40 transition-colors">
                  <img src={cat.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400'} alt={cat.name} className="w-14 h-14 object-cover rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-slate-900 text-base">{cat.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{cat.description || 'No description'}</p>
                    <span className="text-[10px] text-amber-900 font-mono font-bold">Slug: {cat.slug}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
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
