'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  Check,
  Loader2,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
  Banknote,
  Eye,
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { formatPrice } from '@/lib/utils';

// Mock views data for sparkline charts matching screenshot
const viewsData = [
  { name: 'Mon', value: 240 },
  { name: 'Tue', value: 270 },
  { name: 'Wed', value: 310 },
  { name: 'Thu', value: 380 },
  { name: 'Fri', value: 420 },
  { name: 'Sat', value: 490 },
  { name: 'Sun', value: 580 }
];

const revenueTrendData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 190 },
  { name: 'Wed', value: 240 },
  { name: 'Thu', value: 310 },
  { name: 'Fri', value: 420 },
  { name: 'Sat', value: 560 },
  { name: 'Sun', value: 690 }
];

const DONUT_COLORS = ['#1a56db', '#06b6d4', '#0f172a', '#38bdf8'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState('5');

  // Multi-variant stock state
  const [variants, setVariants] = useState<any[]>([
    { size: 'M (40)', color: 'Standard', stock: 10, sku: '' },
    { size: 'L (42)', color: 'Standard', stock: 10, sku: '' },
    { size: 'XL (44)', color: 'Standard', stock: 5, sku: '' },
    { size: 'XXL (46)', color: 'Standard', stock: 3, sku: '' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(search)}&limit=100`);
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
      if (data.success && data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !categoryId) {
          setCategoryId(data.categories[0]._id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Convert Google Drive or raw URL to direct web image link
  const convertToDirectImageUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    return trimmed;
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const directUrl = convertToDirectImageUrl(imageUrlInput);
    setImages((prev) => [...prev, directUrl]);
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMsg({ text: '', isError: false });

    try {
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
        setMsg({ text: data.error || 'Failed to upload image file', isError: true });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Error uploading file from device', isError: true });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const generateRandomSku = (catSlug?: string) => {
    const prefix = catSlug ? catSlug.slice(0, 3).toUpperCase() : 'PAN';
    return `${prefix}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setSku(generateRandomSku());
    setDescription('প্রিমিয়াম কোয়ালিটির ডি-টেক্স মাইক্রো স্টিচ ফেব্রিক। অত্যন্ত সফট ও আরামদায়ক। ১০০% কালার ও ফেব্রিক গ্যারান্টি। ফিক্সড প্রাইস পলিসি।');
    setPrice('1450');
    setDiscountPrice('');
    setImages(['/hero-bg.jpg']);
    setIsFeatured(false);
    setIsNewArrival(true);
    setLowStockThreshold('5');
    setVariants([
      { size: 'M (40)', color: 'Standard', stock: 10, sku: '' },
      { size: 'L (42)', color: 'Standard', stock: 10, sku: '' },
      { size: 'XL (44)', color: 'Standard', stock: 5, sku: '' },
      { size: 'XXL (46)', color: 'Standard', stock: 3, sku: '' }
    ]);
    if (categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
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
      setVariants(
        prod.variants.map((v: any) => ({
          size: v.size || '',
          color: v.color || '',
          stock: v.stock || 0,
          sku: v.sku || ''
        }))
      );
    } else {
      setVariants([
        { size: 'M (40)', color: '', stock: prod.totalStock || 10, sku: '' }
      ]);
    }

    setMsg({ text: '', isError: false });
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { size: 'Free Size', color: '', stock: 5, sku: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCalculatedStock = variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ text: '', isError: false });

    if (images.length === 0) {
      setMsg({ text: 'Please upload or provide at least one product photo', isError: true });
      setSubmitting(false);
      return;
    }

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
        totalStock: totalCalculatedStock,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 5,
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

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${prodName}" from your store?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}?permanent=true`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Error deleting product');
    }
  };

  // Metrics Calculation
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter((p) => p.isActive !== false).length;
  const lowStockCount = products.filter((p) => (p.totalStock ?? 0) > 0 && (p.totalStock ?? 0) <= (p.lowStockThreshold ?? 5)).length;
  const outOfStockCount = products.filter((p) => (p.totalStock ?? 0) === 0).length;
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.totalStock || 0), 0);

  // Catalog Mix Pie Data
  const categoryCountMap: Record<string, number> = {};
  products.forEach((p) => {
    const catName = p.category?.name || 'General';
    categoryCountMap[catName] = (categoryCountMap[catName] || 0) + 1;
  });
  const pieData = Object.keys(categoryCountMap).length > 0
    ? Object.entries(categoryCountMap).map(([name, value]) => ({ name, value }))
    : [
        { name: 'D-Tex Micro Stitch', value: 4 },
        { name: 'China Popcorn', value: 3 },
        { name: 'Arabian Thobe', value: 2 },
        { name: 'Pepsi Cotton', value: 2 }
      ];

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    const total = prod.totalStock ?? 0;
    const threshold = prod.lowStockThreshold ?? 5;
    if (stockFilter === 'in_stock' && total <= threshold) return false;
    if (stockFilter === 'low_stock' && (total === 0 || total > threshold)) return false;
    if (stockFilter === 'out_of_stock' && total > 0) return false;

    if (selectedCategory !== 'all' && (prod.category?._id !== selectedCategory && prod.category?.slug !== selectedCategory)) {
      return false;
    }

    if (statusFilter === 'active' && prod.isActive === false) return false;
    if (statusFilter === 'draft' && prod.isActive !== false) return false;

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredProducts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#0f172a]">
      {/* 1. BREADCRUMBS & ACTION HEADER (Matching Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span className="hover:text-[#0f172a] cursor-pointer">Products</span>
          <span>&gt;</span>
          <span className="font-bold text-[#0f172a]">All Products</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openAddModal}
            className="bg-[#1a56db] hover:bg-[#1e429f] text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New product</span>
          </button>

          <button
            type="button"
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Import</span>
          </button>

          <button
            type="button"
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC CARDS ROW (Exact 4 Cards from Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total products */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#64748b] font-medium block">Total products</span>
            <div className="font-bold text-2xl text-[#0f172a]">
              {totalProductsCount > 0 ? totalProductsCount.toLocaleString() : '3,842'}
            </div>
            <span className="text-[11px] text-[#64748b] block">+126 this month</span>
          </div>
          <div className="p-2 rounded-lg text-[#94a3b8]">
            <LayoutGrid className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active products */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#64748b] font-medium block">Active products</span>
            <div className="font-bold text-2xl text-[#0f172a]">
              {activeProductsCount > 0 ? activeProductsCount.toLocaleString() : '3,108'}
            </div>
            <span className="text-[11px] text-[#64748b] block">81% of catalog</span>
          </div>
          <div className="p-2 rounded-lg text-[#94a3b8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Low stock */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#64748b] font-medium block">Low stock</span>
            <div className="font-bold text-2xl text-[#0f172a]">
              {lowStockCount > 0 ? lowStockCount : '92'}
            </div>
            <span className="text-[11px] text-[#64748b] block">
              {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : '18 out of stock'}
            </span>
          </div>
          <div className="p-2 rounded-lg text-[#94a3b8]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#64748b] font-medium block">Revenue</span>
            <div className="font-bold text-2xl text-[#0f172a]">
              {totalCatalogValue > 0 ? `৳${Math.round(totalCatalogValue / 1000)}K` : '$842K'}
            </div>
            <span className="text-[11px] text-[#64748b] block">4.8% conversion rate</span>
          </div>
          <div className="p-2 rounded-lg text-[#94a3b8]">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS ROW (Product Views, Product Revenue, Catalog Mix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Product views */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#0f172a] font-bold text-sm">
              <Eye className="w-4 h-4 text-[#0f172a]" />
              <span>Product views</span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">Catalog traffic by day</p>
          </div>
          <div className="h-28 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#0f172a] font-bold text-sm">
              <Banknote className="w-4 h-4 text-[#0f172a]" />
              <span>Product revenue</span>
            </div>
            <p className="text-xs text-[#64748b] mt-0.5">Revenue from visible catalog items</p>
          </div>
          <div className="h-28 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a56db" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#1a56db" strokeWidth={2.5} fillOpacity={1} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Catalog mix */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#0f172a] font-bold text-sm">
            <PieChartIcon className="w-4 h-4 text-[#0f172a]" />
            <span>Catalog mix</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            {/* Legend on left */}
            <div className="space-y-1.5 text-xs text-[#475569] font-medium">
              {pieData.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span className="truncate max-w-[110px]">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Donut chart on right */}
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={28}
                    outerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FILTER TOOLBAR (Matching Screenshot) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Search input with magnifying glass */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, SKU, slug"
            className="w-full bg-[#edece6] border-none rounded-xl px-3.5 py-2 pl-9 text-xs font-medium text-[#0f172a] placeholder-[#94a3b8] focus:outline-hidden focus:ring-1 focus:ring-slate-400"
          />
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All categories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* All stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">All stock</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>

          {/* All status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft / Archived</option>
          </select>

          {/* Sort */}
          <select
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="revenue">Sort: Revenue</option>
            <option value="price">Sort: Price</option>
            <option value="newest">Sort: Newest</option>
          </select>

          {/* Bulk actions */}
          <button
            type="button"
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Bulk actions</span>
          </button>
        </div>
      </div>

      {/* 5. DATA TABLE (Exact Columns & Styles from Screenshot) */}
      <div className="bg-white rounded-2xl border border-[#e8e7e1] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-[#1a56db]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#64748b]">Loading products from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#edece6] text-[#0f172a] flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0f172a]">No products in view</h3>
              <p className="text-xs text-[#64748b] max-w-sm mx-auto mt-0.5">
                Click &quot;+ New product&quot; to add a Panjabi with photos and custom stock.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-[#1a56db] hover:bg-[#1e429f] text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#ecebe5] text-[#64748b] font-semibold">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded accent-[#1a56db] cursor-pointer"
                    />
                  </th>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">SKU / slug</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Performance</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f0eb] font-medium text-[#1e293b]">
                {filteredProducts.map((prod) => {
                  const total = prod.totalStock ?? 0;
                  const threshold = prod.lowStockThreshold ?? 5;
                  const isOutOfStock = total === 0;
                  const isLowStock = total > 0 && total <= threshold;
                  const isSelected = selectedRows.includes(prod._id);

                  return (
                    <tr
                      key={prod._id}
                      className={`hover:bg-[#fafaf8] transition-colors ${isSelected ? 'bg-[#f4f7fe]' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(prod._id)}
                          className="rounded accent-[#1a56db] cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail + Title + Subtitle */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#edece6] shrink-0 border border-[#e2e0d8] shadow-2xs">
                            {prod.images?.[0] ? (
                              <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#94a3b8]">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#0f172a] text-xs hover:text-[#1a56db] cursor-pointer transition-colors line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-[#64748b] line-clamp-1 mt-0.5">
                              {prod.description || 'Premium Panjabi Craft'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU / Slug */}
                      <td className="p-4">
                        <div className="font-bold text-[#0f172a] text-xs tracking-tight">{prod.sku}</div>
                        <div className="text-[11px] text-[#64748b] mt-0.5 font-mono">{prod.slug || 'product'}</div>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-[#0f172a]">
                        {prod.discountPrice ? (
                          <div>
                            <span>{formatPrice(prod.discountPrice)}</span>
                            <span className="text-[#94a3b8] line-through text-[10px] ml-1 font-normal">
                              {formatPrice(prod.price)}
                            </span>
                          </div>
                        ) : (
                          <span>{formatPrice(prod.price)}</span>
                        )}
                      </td>

                      {/* Stock Pill Badge */}
                      <td className="p-4">
                        {isOutOfStock ? (
                          <span className="inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] bg-[#fee2e2] text-[#991b1b]">
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] bg-[#fef3c7] text-[#92400e]">
                            {total} low
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full font-semibold text-[11px] bg-[#d1fae5] text-[#065f46]">
                            {total} in stock
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-[#475569] font-medium">
                        {prod.category?.name || 'General'}
                      </td>

                      {/* Status Pill Badge */}
                      <td className="p-4">
                        {prod.isActive !== false ? (
                          <span className="inline-block px-2.5 py-1 rounded-full font-medium text-[11px] bg-[#dcfce7] text-[#15803d]">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full font-medium text-[11px] bg-[#f1f5f9] text-[#64748b]">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Performance */}
                      <td className="p-4 text-[#475569] text-[11px]">
                        <span>4.8K views</span>
                        <span className="mx-1 text-[#94a3b8]">·</span>
                        <span className="font-semibold text-[#0f172a]">{formatPrice((prod.price || 1450) * Math.max(1, total))}</span>
                      </td>

                      {/* Action Links */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            className="text-[#0f172a] hover:text-[#1a56db] font-semibold text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-[#cbd5e1]">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="text-rose-500 hover:text-rose-700 font-semibold text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. ADD / EDIT PRODUCT MODAL (Refined Clean Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 my-auto border border-[#e8e7e1]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ecebe5] pb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#0f172a]">
                  {editingId ? 'Edit Product Details' : 'Create New Product'}
                </h2>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Set product title, upload photos from device or Google Drive, and track stock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f0eb] flex items-center justify-center text-[#64748b] hover:bg-[#e4e2da] transition-colors"
              >
                ✕
              </button>
            </div>

            {msg.text && (
              <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${msg.isError ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#d1fae5] text-[#065f46]'}`}>
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Section */}
              <div className="bg-[#fafaf8] p-4 sm:p-5 rounded-2xl border border-[#e8e7e1] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                    Product Photos (Device Upload & Google Drive) *
                  </label>
                  <span className="text-[11px] text-[#64748b] font-medium">{images.length} photo(s) added</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                      id="modal-device-upload"
                    />
                    <label
                      htmlFor="modal-device-upload"
                      className="cursor-pointer w-full bg-white border border-dashed border-[#1a56db]/40 hover:border-[#1a56db] hover:bg-blue-50/40 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#1a56db] transition-all shadow-2xs"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#1a56db]" />
                          <span>Uploading image...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#1a56db]" />
                          <span>Upload From Local Device</span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste Google Drive link or image URL..."
                      className="w-full bg-white border border-[#e2e0d8] rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-xs px-3.5 rounded-xl transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-20 rounded-xl overflow-hidden border border-[#e2e0d8] bg-white shadow-2xs">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#0f172a] text-[8px] font-bold text-white px-1 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Growth Suite (or D-Tex Micro Stitch Panjabi)"
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                      Product SKU *
                    </label>
                    <button
                      type="button"
                      onClick={() => setSku(generateRandomSku())}
                      className="text-[10px] text-[#1a56db] font-bold hover:underline"
                    >
                      Generate New
                    </button>
                  </div>
                  <input
                    required
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="GS-ANNUAL"
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs font-mono uppercase font-bold text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Regular Price (BDT ৳) *
                  </label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1450"
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs font-bold text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Discount Price (BDT ৳)
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="Optional (e.g. 1350)"
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs font-bold text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                  Description & Specifications *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl px-3 py-2.5 text-xs text-[#0f172a] focus:outline-hidden focus:ring-1 focus:ring-[#1a56db]"
                />
              </div>

              {/* Stock Variant Matrix */}
              <div className="bg-[#fafaf8] p-4 sm:p-5 rounded-2xl border border-[#e8e7e1] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                      Stock Allocation Across Sizes
                    </label>
                    <p className="text-[11px] text-[#64748b]">
                      Total Calculated Stock: <strong className="text-[#1a56db]">{totalCalculatedStock} units</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-[#1a56db] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size/Color</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-[#e2e0d8] text-xs">
                      <div className="col-span-4">
                        <label className="text-[10px] text-[#94a3b8] font-bold uppercase block">Size</label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].size = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full font-bold text-[#0f172a] focus:outline-hidden"
                        />
                      </div>

                      <div className="col-span-4">
                        <label className="text-[10px] text-[#94a3b8] font-bold uppercase block">Color</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].color = e.target.value;
                            setVariants(updated);
                          }}
                          className="w-full text-[#475569] focus:outline-hidden"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-[#94a3b8] font-bold uppercase block">Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].stock = parseInt(e.target.value || '0', 10);
                            setVariants(updated);
                          }}
                          className="w-full font-bold text-[#0f172a] focus:outline-hidden"
                        />
                      </div>

                      <div className="col-span-1 text-right">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="text-[#94a3b8] hover:text-rose-600 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-bold text-[#334155]">Low Stock Alert Threshold:</label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    className="w-20 bg-white border border-[#e2e0d8] rounded-lg px-2 py-1 text-xs font-bold text-center"
                  />
                  <span className="text-[11px] text-[#64748b]">units</span>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#ecebe5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl font-semibold text-xs border border-[#e2e0d8] text-[#475569] hover:bg-[#fafaf8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 rounded-xl font-semibold text-xs bg-[#1a56db] hover:bg-[#1e429f] text-white transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Catalog...</span>
                    </>
                  ) : editingId ? (
                    'Update Product'
                  ) : (
                    'Publish Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
