'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Package, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState('5');

  // Variants state
  const [variants, setVariants] = useState([
    { size: 'M', color: '', stock: 10, sku: '' },
    { size: 'L', color: '', stock: 10, sku: '' },
    { size: 'XL', color: '', stock: 5, sku: '' },
    { size: 'XXL', color: '', stock: 3, sku: '' }
  ]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&limit=50`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error('Fetch products error', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        if (data.categories.length > 0) {
          setCategoryId(data.categories[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSku(`PAN-${Math.floor(100 + Math.random() * 900)}`);
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setImages(['https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800']);
    setIsFeatured(false);
    setIsNewArrival(true);
    setLowStockThreshold('5');
    setMsg({ text: '', isError: false });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: any) => {
    setEditingId(prod._id);
    setName(prod.name);
    setSku(prod.sku);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setCategoryId(prod.category?._id || prod.category);
    setImages(prod.images || []);
    setIsFeatured(prod.isFeatured);
    setIsNewArrival(prod.isNewArrival);
    setLowStockThreshold((prod.lowStockThreshold || 5).toString());

    if (prod.variants && prod.variants.length > 0) {
      setVariants(prod.variants.map((v: any) => ({
        size: v.size || '',
        color: v.color || '',
        stock: v.stock || 0,
        sku: v.sku || ''
      })));
    }

    setMsg({ text: '', isError: false });
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ text: '', isError: false });

    try {
      const payload = {
        name,
        sku,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        category: categoryId,
        images,
        variants,
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        isFeatured,
        isNewArrival
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        setMsg({ text: data.error || 'Operation failed', isError: true });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Error saving product', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new garments, update prices, manage images, and track variant stock levels.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-amber-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-amber-950 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name, SKU..."
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-xs font-medium focus:outline-hidden"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-amber-900">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading catalog...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover rounded-lg bg-slate-100 shrink-0" />
                      <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-950">{prod.sku}</td>
                    <td className="p-4 text-slate-600">{prod.category?.name || 'General'}</td>
                    <td className="p-4 font-bold text-amber-950">
                      {formatPrice(prod.discountPrice || prod.price)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        prod.totalStock <= prod.lowStockThreshold
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {prod.totalStock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(prod._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">
                {editingId ? 'Edit Product Details' : 'Create New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {msg.text && (
                <div className={`p-3 rounded-xl text-xs font-bold ${msg.isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
                  {msg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Title *</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Midnight Blue Embroidered Panjabi" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product SKU *</label>
                  <input required type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="PAN-BLU-001" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono uppercase font-bold focus:outline-hidden" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden">
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Regular Price (BDT ৳) *</label>
                  <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3450" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Discount Price (BDT ৳)</label>
                  <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="2950" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description *</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden" />
              </div>

              {/* Image URL Inputs */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Product Image URLs *</label>
                <div className="flex gap-2">
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden" />
                  <button type="button" onClick={handleAddImage} className="bg-slate-800 text-white font-bold text-xs px-4 rounded-xl">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-0 right-0 bg-rose-700 text-white w-4 h-4 flex items-center justify-center text-[10px]">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Stock Tracking */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Variant Stock Allocation</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {variants.map((v, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800 mb-1">Size {v.size}</div>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].stock = parseInt(e.target.value || '0', 10);
                          setVariants(updated);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-1 text-center font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded-md accent-amber-900" />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded-md accent-amber-900" />
                  <span>New Arrival</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-amber-900 text-white hover:bg-amber-950 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
