'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Edit3 as Edit3Icon,
  Trash2 as Trash2Icon,
  Package as PackageIcon,
  Check as CheckIcon,
  Loader2 as Loader2Icon,
  Image as ImageIconLucide,
  Upload as UploadIcon,
  Link as LinkIconLucide,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2 as CheckCircle2Icon,
  LayoutGrid as LayoutGridIcon,
  Banknote as BanknoteIcon,
  Eye as EyeIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIconLucide,
  ArrowUpRight as ArrowUpRightIcon,
  Download as DownloadIcon,
  Filter as FilterIcon,
  MoreHorizontal as MoreHorizontalIcon,
  ChevronDown as ChevronDownIcon,
  X as XIcon,
  Tag as TagIconLucide,
  Clock as ClockIcon,
  BarChart2 as BarChart2Icon,
  Layers as LayersIcon
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

const DONUT_COLORS = ['#e6ad35', '#b0782e', '#302316', '#dfc78d'];

// Sparkline Borderless Tooltips
const CustomViewsTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg text-[11px] text-[#100D0A] space-y-0.5 border border-[#E5DFD5]"
    >
      <p className="text-[#796E5F] font-medium">{label}</p>
      <p className="font-bold text-[#E6AD35]">{payload[0].value} views</p>
    </div>
  );
};

const CustomRevTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg text-[11px] text-[#100D0A] space-y-0.5 border border-[#E5DFD5]"
    >
      <p className="text-[#796E5F] font-medium">{label}</p>
      <p className="font-bold text-[#E6AD35]">{formatPrice(payload[0].value * 100)}</p>
    </div>
  );
};

const CustomMixTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg text-[11px] text-[#100D0A] space-y-0.5 border border-[#E5DFD5]"
    >
      <p className="font-bold text-[#100D0A]">{payload[0].name}</p>
      <p className="font-semibold text-[#E6AD35]">{payload[0].value} items</p>
    </div>
  );
};

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Details Modal State
  const [detailsProduct, setDetailsProduct] = useState<any | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  // Form fields for edit modal
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDiscountPrice, setEditDiscountPrice] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVariants, setEditVariants] = useState<any[]>([]);
  const [editLowStockThreshold, setEditLowStockThreshold] = useState('5');
  const [editIsActive, setEditIsActive] = useState(true);

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
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Fetch categories error', e);
    }
  };

  // Collect all unique tags from products
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach((p) => {
      (p.tags || []).forEach((t: string) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [products]);

  // Key metrics calculation
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter((p) => p.isActive !== false).length;
  const lowStockCount = products.filter((p) => {
    const total = p.totalStock ?? 0;
    const threshold = p.lowStockThreshold ?? 5;
    return total > 0 && total <= threshold;
  }).length;
  const outOfStockCount = products.filter((p) => (p.totalStock ?? 0) === 0).length;

  const totalCatalogValue = products.reduce((sum, p) => {
    const priceVal = p.discountPrice || p.price || 0;
    const stockVal = p.totalStock || 1;
    return sum + priceVal * stockVal;
  }, 0);

  // Dynamic Catalog Mix from real products
  const categoryCountMap: Record<string, number> = {};
  products.forEach((p) => {
    const catName = p.category?.name || 'General';
    categoryCountMap[catName] = (categoryCountMap[catName] || 0) + 1;
  });
  const pieData = Object.keys(categoryCountMap).length > 0
    ? Object.entries(categoryCountMap).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Panjabi Craft', value: 6 },
        { name: 'Royal Kurta', value: 4 },
        { name: 'Omani Thobe', value: 3 },
        { name: 'Fabrics & Shawls', value: 2 }
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

    if (selectedTag !== 'all' && !(prod.tags || []).includes(selectedTag)) {
      return false;
    }

    if (statusFilter === 'active' && prod.isActive === false) return false;
    if (statusFilter === 'draft' && prod.isActive !== false) return false;

    return true;
  });

  // Sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === 'revenue') {
      const revA = (a.discountPrice || a.price || 0) * (a.totalStock || 1);
      const revB = (b.discountPrice || b.price || 0) * (b.totalStock || 1);
      return revB - revA;
    }
    if (sortBy === 'price') {
      return (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0);
    }
    if (sortBy === 'stock') {
      return (b.totalStock || 0) - (a.totalStock || 0);
    }
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
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

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku);
    setEditDescription(prod.description || '');
    setEditPrice((prod.price || '').toString());
    setEditDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setEditCategoryId(prod.category?._id || (categories[0]?._id || ''));
    setEditImages(prod.images || []);
    setEditVariants(prod.variants?.length ? [...prod.variants] : [
      { size: 'M (40)', color: 'Standard', stock: 10, sku: '' },
      { size: 'L (42)', color: 'Standard', stock: 10, sku: '' }
    ]);
    setEditLowStockThreshold((prod.lowStockThreshold || 5).toString());
    setEditIsActive(prod.isActive !== false);
    setIsEditModalOpen(true);
    setMsg({ text: '', isError: false });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);
    setMsg({ text: '', isError: false });

    try {
      const payload = {
        name: editName.trim(),
        sku: editSku.trim().toUpperCase(),
        description: editDescription.trim(),
        price: parseFloat(editPrice),
        discountPrice: editDiscountPrice ? parseFloat(editDiscountPrice) : undefined,
        category: editCategoryId,
        images: editImages,
        variants: editVariants,
        lowStockThreshold: parseInt(editLowStockThreshold, 10) || 5,
        isActive: editIsActive
      };

      const res = await fetch(`/api/products/${editingProduct.slug || editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setIsEditModalOpen(false);
        fetchProducts();
      } else {
        setMsg({ text: data.error || 'Failed to update product', isError: true });
      }
    } catch (e: any) {
      setMsg({ text: e.message || 'Error updating product', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Product Name', 'SKU', 'Slug', 'Category', 'Price', 'Discount Price', 'Total Stock', 'Status'],
      ...filteredProducts.map((p) => [
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        p.slug,
        p.category?.name || 'General',
        p.price,
        p.discountPrice || '',
        p.totalStock || 0,
        p.isActive !== false ? 'Active' : 'Draft'
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yah_sabab_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // TAB VIEW: TAGS MANAGER
  // -------------------------------------------------------------
  if (currentTab === 'tags') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#0f172a]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
              <Link href="/admin/products" className="hover:text-[#0f172a]">Products</Link>
              <span>&gt;</span>
              <span className="font-bold text-[#0f172a]">Tags</span>
            </div>
            <h1 className="text-xl font-bold text-[#0f172a]">Product Tags & Keywords</h1>
          </div>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#e2e0d8] text-[#0f172a] shadow-2xs"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-4">
          <p className="text-xs text-[#64748b]">
            Manage all search tags and marketing tags attached to your products.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {allTags.length > 0 ? (
              allTags.map((tag, idx) => {
                const count = products.filter((p) => (p.tags || []).includes(tag)).length;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#fafaf8] border border-[#e2e0d8] text-xs font-semibold text-[#0f172a]"
                  >
                    <TagIconLucide className="w-3.5 h-3.5 text-[#e6ad35]" />
                    <span>{tag}</span>
                    <span className="text-[10px] bg-[#edece6] px-1.5 py-0.2 rounded-md text-[#64748b]">
                      {count} items
                    </span>
                  </span>
                );
              })
            ) : (
              <p className="text-xs text-[#94a3b8]">No tags assigned to any products yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB VIEW: PRODUCT LOGS
  // -------------------------------------------------------------
  if (currentTab === 'logs') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#0f172a]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
              <Link href="/admin/products" className="hover:text-[#0f172a]">Products</Link>
              <span>&gt;</span>
              <span className="font-bold text-[#0f172a]">Product Logs</span>
            </div>
            <h1 className="text-xl font-bold text-[#0f172a]">Inventory & Catalog Activity Logs</h1>
          </div>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#e2e0d8] text-[#0f172a] shadow-2xs"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e7e1] shadow-2xs divide-y divide-[#ecebe5]">
          {products.slice(0, 15).map((p, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#fefbf6] text-[#e6ad35] border border-[#f5eedb] rounded-lg">
                  <ClockIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#0f172a]">Catalog verified for &quot;{p.name}&quot;</p>
                  <p className="text-[11px] text-[#64748b]">SKU {p.sku} · Current stock: {p.totalStock || 0} units</p>
                </div>
              </div>
              <span className="text-[11px] text-[#94a3b8]">Active in catalog</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TAB VIEW: PRODUCT STATS
  // -------------------------------------------------------------
  if (currentTab === 'stats') {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#0f172a]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
              <Link href="/admin/products" className="hover:text-[#0f172a]">Products</Link>
              <span>&gt;</span>
              <span className="font-bold text-[#0f172a]">Product Stats</span>
            </div>
            <h1 className="text-xl font-bold text-[#0f172a]">Catalog Conversion & Performance Stats</h1>
          </div>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#e2e0d8] text-[#0f172a] shadow-2xs"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
            <span className="text-xs text-[#64748b]">Total Catalog Value</span>
            <div className="text-2xl font-bold text-[#0f172a]">{formatPrice(totalCatalogValue)}</div>
            <span className="text-[11px] text-[#15803d]">Across {totalProductsCount} garments</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
            <span className="text-xs text-[#64748b]">Average Unit Price</span>
            <div className="text-2xl font-bold text-[#0f172a]">
              {formatPrice(totalProductsCount > 0 ? totalCatalogValue / (products.reduce((s, p) => s + (p.totalStock || 1), 0) || 1) : 0)}
            </div>
            <span className="text-[11px] text-[#64748b]">Based on current retail prices</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e8e7e1] shadow-2xs space-y-1">
            <span className="text-xs text-[#64748b]">Active Catalog Coverage</span>
            <div className="text-2xl font-bold text-[#e6ad35]">
              {totalProductsCount > 0 ? Math.round((activeProductsCount / totalProductsCount) * 100) : 100}%
            </div>
            <span className="text-[11px] text-[#64748b]">{activeProductsCount} of {totalProductsCount} live</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DEFAULT VIEW: ALL PRODUCTS (Matching Exact Screenshot)
  // -------------------------------------------------------------
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
          {/* + New product button linking directly to /admin/products/new */}
          <Link
            href="/admin/products/new"
            className="bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>+ New product</span>
          </Link>

          <button
            type="button"
            onClick={() => alert('Bulk product import wizard via CSV/Excel.')}
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <UploadIcon className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Import</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <DownloadIcon className="w-3.5 h-3.5 text-[#64748b]" />
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
            <LayoutGridIcon className="w-5 h-5" />
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
            <CheckCircle2Icon className="w-5 h-5" />
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
            <AlertTriangleIcon className="w-5 h-5" />
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
            <BanknoteIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS ROW (Product Views, Product Revenue, Catalog Mix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Product views */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#100D0A] font-bold text-sm">
              <EyeIcon className="w-4 h-4 text-[#100D0A]" />
              <span>Product views</span>
            </div>
            <p className="text-xs text-[#796E5F] mt-0.5">Catalog traffic by day</p>
          </div>
          <div className="h-28 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart accessibilityLayer={false} data={viewsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A59A88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A59A88" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<CustomViewsTooltip />}
                  cursor={{ stroke: '#796E5F', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="value" stroke="#796E5F" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Product revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#100D0A] font-bold text-sm">
              <BanknoteIcon className="w-4 h-4 text-[#100D0A]" />
              <span>Product revenue</span>
            </div>
            <p className="text-xs text-[#796E5F] mt-0.5">Revenue from visible catalog items</p>
          </div>
          <div className="h-28 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart accessibilityLayer={false} data={revenueTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E6AD35" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E6AD35" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<CustomRevTooltip />}
                  cursor={{ stroke: '#E6AD35', strokeWidth: 1.5, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="value" stroke="#E6AD35" strokeWidth={2.5} fillOpacity={1} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Catalog mix */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#100D0A] font-bold text-sm">
            <PieChartIconLucide className="w-4 h-4 text-[#100D0A]" />
            <span>Catalog mix</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-3">
            {/* Legend on left */}
            <div className="space-y-1.5 text-xs text-[#302316] font-medium">
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
                <PieChart accessibilityLayer={false}>
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
                  <Tooltip content={<CustomMixTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FILTER TOOLBAR (Matching Screenshot: All categories, All tags, All stock, All status, Sort: Revenue) */}
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
          <SearchIcon className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
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

          {/* All tags (From Screenshot) */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">All tags</option>
            {allTags.map((tag, idx) => (
              <option key={idx} value={tag}>{tag}</option>
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
            <option value="draft">Draft</option>
          </select>

          {/* Sort: Revenue */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#e2e0d8] text-[#334155] font-medium text-xs px-3 py-2 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="revenue">Sort: Revenue</option>
            <option value="price">Sort: Price</option>
            <option value="stock">Sort: Stock</option>
            <option value="newest">Sort: Newest</option>
          </select>

          {/* Bulk actions */}
          <button
            type="button"
            onClick={() => {
              if (selectedRows.length === 0) {
                alert('Please select at least 1 product using the checkboxes.');
                return;
              }
              if (confirm(`Bulk delete ${selectedRows.length} selected products?`)) {
                Promise.all(selectedRows.map((id) => fetch(`/api/products/${id}`, { method: 'DELETE' })))
                  .then(() => {
                    setSelectedRows([]);
                    fetchProducts();
                  });
              }
            }}
            className="bg-white hover:bg-[#fafaf8] border border-[#e2e0d8] text-[#1e293b] font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FilterIcon className="w-3.5 h-3.5 text-[#64748b]" />
            <span>Bulk actions {selectedRows.length > 0 && `(${selectedRows.length})`}</span>
          </button>
        </div>
      </div>

      {/* 5. DATA TABLE (Exact Columns & Styles from Screenshot) */}
      <div className="bg-white rounded-2xl border border-[#e8e7e1] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-[#e6ad35]">
            <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#64748b]">Loading products from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#edece6] text-[#0f172a] flex items-center justify-center mx-auto">
              <PackageIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0f172a]">No products in view</h3>
              <p className="text-xs text-[#64748b] max-w-sm mx-auto mt-0.5">
                Click &quot;+ New product&quot; to publish a Panjabi into the store catalog.
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>+ New product</span>
            </Link>
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
                      className="rounded accent-[#e6ad35] cursor-pointer"
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
                      className={`hover:bg-[#fafaf8] transition-colors ${isSelected ? 'bg-[#faf6ee]' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(prod._id)}
                          className="rounded accent-[#e6ad35] cursor-pointer"
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
                                <ImageIconLucide className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div
                              onClick={() => setDetailsProduct(prod)}
                              className="font-bold text-[#0f172a] text-xs hover:text-[#e6ad35] cursor-pointer transition-colors line-clamp-1"
                            >
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

                      {/* Actions (Details & Edit matching Screenshot) */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDetailsProduct(prod)}
                            className="text-[#b0782e] hover:underline font-semibold text-xs cursor-pointer"
                          >
                            Details
                          </button>
                          <span className="text-[#cbd5e1]">·</span>
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            className="text-[#0f172a] hover:text-[#b0782e] font-semibold text-xs cursor-pointer transition-colors"
                          >
                            Edit
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

      {/* PRODUCT DETAILS DRAWER / MODAL */}
      {detailsProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-[#e8e7e1] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#ecebe5] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#edece6] border border-[#e2e0d8] shrink-0">
                  {detailsProduct.images?.[0] ? (
                    <img src={detailsProduct.images[0]} alt={detailsProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIconLucide className="w-6 h-6 text-[#94a3b8] m-3" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#0f172a]">{detailsProduct.name}</h3>
                  <p className="text-[11px] text-[#64748b]">SKU: {detailsProduct.sku} · Slug: {detailsProduct.slug}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsProduct(null)}
                className="p-1 text-[#94a3b8] hover:text-[#0f172a]"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#fafaf8] rounded-xl border border-[#e8e7e1]">
                <span className="text-[10px] text-[#64748b] font-bold block">PRICE</span>
                <span className="font-bold text-base text-[#0f172a]">
                  {formatPrice(detailsProduct.discountPrice || detailsProduct.price)}
                </span>
                {detailsProduct.discountPrice && (
                  <span className="text-[10px] text-[#94a3b8] line-through block font-normal">
                    Original: {formatPrice(detailsProduct.price)}
                  </span>
                )}
              </div>
              <div className="p-3 bg-[#fafaf8] rounded-xl border border-[#e8e7e1]">
                <span className="text-[10px] text-[#64748b] font-bold block">TOTAL STOCK</span>
                <span className="font-bold text-base text-[#0f172a]">{detailsProduct.totalStock || 0} units</span>
                <span className="text-[10px] text-[#15803d] block">In catalog distribution</span>
              </div>
            </div>

            {/* Variants Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0f172a]">Size & Color Stock Matrix:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(detailsProduct.variants || []).map((v: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-[#fafaf8] rounded-xl border border-[#e8e7e1] text-xs">
                    <span className="font-bold text-[#0f172a] block">{v.size}</span>
                    <span className="text-[10px] text-[#64748b] block">{v.color || 'Standard'}</span>
                    <span className="text-[11px] font-bold text-[#b0782e] mt-1 block">{v.stock || 0} left</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ecebe5]">
              <button
                type="button"
                onClick={() => setDetailsProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#e2e0d8] text-[#475569] hover:bg-[#fafaf8]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = detailsProduct;
                  setDetailsProduct(null);
                  openEditModal(p);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] shadow-sm cursor-pointer"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-[#e8e7e1]">
            <div className="flex items-center justify-between border-b border-[#ecebe5] pb-3">
              <h3 className="font-bold text-base text-[#0f172a]">Edit Product</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#94a3b8] hover:text-[#0f172a]"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs ${msg.isError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#334155] mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl p-2.5 font-bold text-[#0f172a]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#334155] mb-1">SKU</label>
                    <input
                      type="text"
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value.toUpperCase())}
                      className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl p-2.5 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Category</label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl p-2.5 font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Regular Price (৳)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl p-2.5 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Discount Price (৳)</label>
                    <input
                      type="number"
                      value={editDiscountPrice}
                      onChange={(e) => setEditDiscountPrice(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-[#fafaf8] border border-[#e2e0d8] rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {/* Variant Stock Allocations */}
                <div className="space-y-2 pt-2 border-t border-[#ecebe5]">
                  <label className="block font-bold text-[#334155]">Variant Stock Allocations</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {editVariants.map((v, idx) => (
                      <div key={idx} className="p-2.5 bg-[#fafaf8] rounded-xl border border-[#e2e0d8] text-xs">
                        <span className="font-bold text-[#0f172a] block mb-1">{v.size}</span>
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => {
                            const updated = [...editVariants];
                            updated[idx].stock = parseInt(e.target.value || '0', 10);
                            setEditVariants(updated);
                          }}
                          className="w-full bg-white border border-[#e2e0d8] rounded-lg p-1 text-center font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ecebe5]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#e2e0d8] text-[#475569] hover:bg-[#fafaf8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#e6ad35] hover:bg-[#f5c451] text-[#0e0c0a] shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? <Loader2Icon className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-[#e6ad35]">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#64748b]">Loading products dashboard...</p>
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
