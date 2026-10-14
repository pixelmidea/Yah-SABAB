'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Package,
  Layers,
  Banknote,
  Tag,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Variant {
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

export default function AdminAddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [status, setStatus] = useState<'active' | 'draft' | 'paused'>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [tagsInput, setTagsInput] = useState('Eid Collection, Luxury, Panjabi');

  // Variants Matrix
  const [variants, setVariants] = useState<Variant[]>([
    { size: 'M (38)', color: 'Midnight Blue', stock: 15, sku: '' },
    { size: 'L (40)', color: 'Midnight Blue', stock: 25, sku: '' },
    { size: 'XL (42)', color: 'Midnight Blue', stock: 20, sku: '' },
    { size: 'XXL (44)', color: 'Midnight Blue', stock: 10, sku: '' }
  ]);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate SKU when name changes if SKU is empty or default
  useEffect(() => {
    if (name.trim() && (!sku || sku.startsWith('YS-'))) {
      const generated = 'YS-' + name.trim().slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X') + '-' + Math.floor(100 + Math.random() * 900);
      setSku(generated);
    }
  }, [name]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !category) {
          setCategory(data.categories[0]._id);
        }
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFeedback(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          setFeedback({ text: data.error || 'Failed to upload photo', isError: true });
        }
      }
    } catch (err) {
      setFeedback({ text: 'Error uploading photo', isError: true });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'L (42)', color: 'White', stock: 10, sku: '' }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalVariantStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim()) {
      setFeedback({ text: 'Product title is required', isError: true });
      return;
    }
    if (!sku.trim()) {
      setFeedback({ text: 'Product SKU is required', isError: true });
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setFeedback({ text: 'Please specify a valid base price', isError: true });
      return;
    }
    if (!category) {
      setFeedback({ text: 'Please select a product category', isError: true });
      return;
    }
    if (images.length === 0) {
      setFeedback({ text: 'Please upload or specify at least 1 product image', isError: true });
      return;
    }

    setSubmitting(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim() || 'Premium panjabi crafted from imported Egyptian fabrics with precision embroidery.',
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        category,
        images,
        variants: variants.map((v) => ({
          size: v.size.trim(),
          color: v.color.trim(),
          stock: parseInt(String(v.stock || 0), 10),
          sku: v.sku?.trim() || `${sku.toUpperCase()}-${v.size.replace(/[^a-zA-Z0-9]/g, '')}`
        })),
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
        isActive: status === 'active',
        isFeatured,
        isNewArrival,
        tags
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({ text: 'Product published to catalog successfully! Redirecting...', isError: false });
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      } else {
        setFeedback({ text: data.error || 'Failed to create product', isError: true });
      }
    } catch (err: any) {
      setFeedback({ text: err.message || 'An unexpected error occurred', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans text-[#100D0A]">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#796E5F] mb-1">
            <Link href="/admin/products" className="hover:text-[#100D0A] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>
            <span>&gt;</span>
            <span className="font-semibold text-[#100D0A]">Add Product</span>
          </div>
          <h1 className="text-xl font-bold text-[#100D0A] tracking-tight">
            Create & Publish New Product
          </h1>
          <p className="text-xs text-[#796E5F] mt-0.5">
            Add a new luxury garment with variants, photos, custom SKU, and stock allocation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#DDD7CD] text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing to Catalog...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs ${
            feedback.isError
              ? 'bg-[#FDF2F2] text-[#991B1B] border border-[#F8D7DA]'
              : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
          }`}
        >
          {feedback.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Grid: Form Sections */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Essentials & Media (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. General Information Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5DFD5] pb-3">
              <Package className="w-4 h-4 text-[#E6AD35]" />
              <h2 className="font-bold text-sm text-[#100D0A]">General Information</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#302316] mb-1">
                  Product Title <span className="text-[#D9383A]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Omani Imperial Panjabi - Silk Finish"
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#302316] mb-1">
                    SKU Code <span className="text-[#D9383A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. YS-OMAN-01"
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] uppercase transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#302316] mb-1">
                    Product Category <span className="text-[#D9383A]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] cursor-pointer transition-colors"
                    required
                  >
                    {loadingCategories ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#302316] mb-1">
                  Full Description & Fabric Details <span className="text-[#D9383A]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fabric weave (e.g. 100% Egyptian Giza Cotton), collar embroidery craftsmanship, drape, and styling pairing..."
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl p-3 text-xs text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Media / Image Gallery Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#E6AD35]" />
                <h2 className="font-bold text-sm text-[#100D0A]">Product Imagery ({images.length})</h2>
              </div>
              <span className="text-[11px] text-[#796E5F]">Upload high-res photography</span>
            </div>

            {/* Upload Toolbar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Upload from Computer */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#100D0A] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E6AD35]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[#E6AD35]" />
                  )}
                  <span>{uploadingImage ? 'Uploading Photos...' : 'Upload Photos from PC'}</span>
                </button>

                {/* Or add via URL */}
                <div className="flex-1 w-full flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste external image URL (https://...)"
                    className="flex-1 bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-[#DDD7CD] text-[#100D0A] hover:bg-[#FAF7F2] shadow-2xs shrink-0 cursor-pointer transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Gallery Preview Grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-[#E5DFD5] bg-[#FAF7F2] aspect-3/4 shadow-2xs"
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-[#E6AD35] text-[#100D0A] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          Primary Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-[#D9383A] text-white rounded-lg transition-colors opacity-90 group-hover:opacity-100"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-[#DDD7CD] rounded-2xl text-center space-y-2 bg-[#FAF7F2]">
                  <ImageIcon className="w-8 h-8 text-[#A59A88] mx-auto" />
                  <p className="text-xs font-semibold text-[#796E5F]">No photos added yet</p>
                  <p className="text-[11px] text-[#A59A88]">Upload Panjabi flat lay or model showcase photos to display in the customer shop</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sizes & Color Variants Matrix Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#E6AD35]" />
                <h2 className="font-bold text-sm text-[#100D0A]">
                  Sizes & Color Stock Matrix
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-semibold text-[#7A5310] hover:text-[#100D0A] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-3 items-center bg-[#FAF7F2] p-3 rounded-xl border border-[#DDD7CD] text-xs"
                >
                  <div className="col-span-4">
                    <label className="text-[10px] text-[#796E5F] font-bold uppercase block mb-0.5">
                      Size
                    </label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                      placeholder="e.g. 38, 40, 42, 44"
                      className="w-full bg-white border border-[#DDD7CD] rounded-lg px-2.5 py-1.5 font-bold text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="text-[10px] text-[#796E5F] font-bold uppercase block mb-0.5">
                      Color
                    </label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                      placeholder="e.g. Midnight Blue"
                      className="w-full bg-white border border-[#DDD7CD] rounded-lg px-2.5 py-1.5 text-[#302316] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="text-[10px] text-[#796E5F] font-bold uppercase block mb-0.5">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(idx, 'stock', parseInt(e.target.value || '0', 10))}
                      className="w-full bg-white border border-[#DDD7CD] rounded-lg px-2.5 py-1.5 font-bold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                    />
                  </div>

                  <div className="col-span-1 text-right pt-3">
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-[#A59A88] hover:text-[#D9383A] transition-colors p-1"
                        title="Remove variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-2 text-[#796E5F]">
              <span>Total calculated inventory: <strong className="text-[#100D0A] font-semibold">{totalVariantStock} units</strong></span>
              <span className="text-[11px]">Individual stock tracks dynamically per order</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Organization Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Pricing Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5DFD5] pb-3">
              <Banknote className="w-4 h-4 text-[#E6AD35]" />
              <h2 className="font-bold text-sm text-[#100D0A]">Pricing & Margins</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#302316] mb-1">
                  Regular Price (৳) <span className="text-[#D9383A]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#A59A88] font-bold">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3450"
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl pl-8 pr-3 py-2 font-bold text-base text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#302316] mb-1">
                  Discount / Sale Price (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#A59A88] font-bold">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Optional promotional price"
                    className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl pl-8 pr-3 py-2 font-bold text-sm text-[#2E7D32] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] focus:ring-1 focus:ring-[#E6AD35] transition-colors"
                  />
                </div>
                {discountPrice && price && parseFloat(discountPrice) < parseFloat(price) && (
                  <p className="text-[11px] text-[#2E7D32] font-semibold mt-1">
                    Save ৳{(parseFloat(price) - parseFloat(discountPrice)).toLocaleString()} (
                    {Math.round(((parseFloat(price) - parseFloat(discountPrice)) / parseFloat(price)) * 100)}% off)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Inventory & Stock Settings Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5DFD5] pb-3">
              <ShieldCheck className="w-4 h-4 text-[#E6AD35]" />
              <h2 className="font-bold text-sm text-[#100D0A]">Inventory Controls</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#302316] mb-1">
                  Low Stock Alert Threshold
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-24 bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-center font-bold text-[#100D0A] focus:outline-hidden focus:border-[#E6AD35]"
                  />
                  <span className="text-[#796E5F] text-[11px]">triggers dashboard low stock badge</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Catalog Status & Badges Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5DFD5] pb-3">
              <Sparkles className="w-4 h-4 text-[#E6AD35]" />
              <h2 className="font-bold text-sm text-[#100D0A]">Publishing & Visibility</h2>
            </div>

            <div className="space-y-3 text-xs">
              {/* Visibility Status */}
              <div>
                <label className="block font-bold text-[#302316] mb-1">Catalog Status</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      status === 'active'
                        ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                        : 'bg-[#FAF7F2] text-[#796E5F] border border-[#DDD7CD]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      status === 'draft'
                        ? 'bg-[#FAF7F2] text-[#100D0A] border border-[#DDD7CD] font-bold'
                        : 'bg-[#FAF7F2] text-[#796E5F] border border-[#DDD7CD]'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('paused')}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      status === 'paused'
                        ? 'bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]'
                        : 'bg-[#FAF7F2] text-[#796E5F] border border-[#DDD7CD]'
                    }`}
                  >
                    Paused
                  </button>
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="space-y-2 pt-2 border-t border-[#E5DFD5]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-[#E6AD35] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#100D0A] block">Featured Product</span>
                    <span className="text-[10px] text-[#796E5F]">Display in hero & featured collections</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded accent-[#E6AD35] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#100D0A] block">New Arrival</span>
                    <span className="text-[10px] text-[#796E5F]">Show new arrival ribbon badge in storefront</span>
                  </div>
                </label>
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-[#E5DFD5]">
                <label className="block font-bold text-[#302316] mb-1">
                  Product Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Panjabi, Eid, Cotton, Luxury"
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl px-3 py-2 text-xs text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-xs bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish to Yah SABAB</span>
                </>
              )}
            </button>
            <Link
              href="/admin/products"
              className="w-full block py-2.5 rounded-xl text-center font-semibold text-xs border border-[#DDD7CD] text-[#796E5F] hover:text-[#100D0A] hover:bg-[#FAF7F2] transition-colors"
            >
              Back to All Products
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
