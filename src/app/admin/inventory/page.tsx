'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, AlertTriangle, CheckCircle, Clock, Loader2, Edit2 } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Adjustment Modal
  const [selectedProd, setSelectedProd] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [newStock, setNewStock] = useState('');
  const [reason, setReason] = useState('New shipment received');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProd) return;
    setUpdating(true);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProd._id,
          size: selectedSize,
          newStock: parseInt(newStock, 10),
          reason
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProd(null);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs">
        <h1 className="font-serif text-2xl font-bold text-[#100D0A] tracking-tight">
          Inventory Control & Stock Audit Logs
        </h1>
        <p className="text-xs text-[#7A6E5D] mt-1">
          Monitor SKU stock levels, adjust warehouse quantities, and view stock change audit histories.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#E6AD35]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-[#7A6E5D]">Loading inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inventory List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E5DFD5] font-serif font-bold text-base text-[#100D0A] bg-[#F5F1EA]">
              Warehouse SKU Stock Overview
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F1EA] border-b border-[#E5DFD5] text-[#6E6355] font-semibold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">Product & SKU</th>
                    <th className="p-3.5">Total Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DC] font-medium text-[#1E1812]">
                  {products.map((prod) => {
                    const isLow = prod.totalStock <= prod.lowStockThreshold;
                    const isOut = prod.totalStock <= 0;
                    return (
                      <tr key={prod._id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img src={prod.images[0]} alt={prod.name} className="w-9 h-11 object-cover rounded-lg bg-[#FAF7F2] border border-[#E5DFD5] shrink-0" />
                          <div>
                            <div className="font-bold text-[#100D0A] line-clamp-1">{prod.name}</div>
                            <div className="text-[11px] text-[#b0782e] font-mono">SKU: {prod.sku}</div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-sm font-bold text-[#100D0A]">
                          {prod.totalStock}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            isOut
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {isOut ? 'Stock Out' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedProd(prod);
                              setSelectedSize(prod.variants && prod.variants.length > 0 ? prod.variants[0].size : '');
                              setNewStock(prod.totalStock.toString());
                            }}
                            className="bg-[#E6AD35] hover:bg-[#F5C451] text-[#100D0A] font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Adjust</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail Sidebar */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DFD5] shadow-xs space-y-4 h-fit">
            <h3 className="font-serif font-bold text-[#100D0A] text-lg border-b border-[#E5DFD5] pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#E6AD35]" />
              <span>Stock Adjustment History</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-xs text-[#7A6E5D]">No stock change logs recorded yet.</p>
              ) : (
                history.map((h) => (
                  <div key={h._id} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5] text-xs space-y-1">
                    <div className="font-bold text-[#100D0A] line-clamp-1">{h.productName}</div>
                    <div className="flex justify-between text-[#7A6E5D] text-[11px]">
                      <span>Stock: {h.previousStock} → <strong className="text-[#100D0A]">{h.newStock}</strong></span>
                      <span className="font-mono">{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-[10px] text-[#b0782e] italic">Reason: {h.reason}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {selectedProd && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#403221]/40 space-y-4">
            <div className="border-b border-[#E5DFD5] pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#100D0A]">
                  Adjust Stock: {selectedProd.name}
                </h3>
                <p className="text-xs text-[#7A6E5D]">Warehouse inventory adjustment</p>
              </div>
              <button onClick={() => setSelectedProd(null)} className="text-[#A59A88] hover:text-[#100D0A] p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 text-xs">
              {selectedProd.variants && selectedProd.variants.length > 0 && (
                <div>
                  <label className="block font-bold text-[#6E6355] uppercase mb-1">Select Size Variant</label>
                  <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] rounded-xl p-2.5 font-bold focus:outline-hidden focus:border-[#E6AD35]">
                    {selectedProd.variants.map((v: any, idx: number) => (
                      <option key={idx} value={v.size}>Size {v.size} (Current: {v.stock})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#6E6355] uppercase mb-1">New Stock Quantity *</label>
                <input required type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] rounded-xl p-2.5 font-bold text-sm focus:outline-hidden focus:border-[#E6AD35]" />
              </div>

              <div>
                <label className="block font-bold text-[#6E6355] uppercase mb-1">Adjustment Reason *</label>
                <input required type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Received new shipment batch" className="w-full bg-[#FAF7F2] border border-[#DDD6CA] text-[#100D0A] rounded-xl p-2.5 focus:outline-hidden focus:border-[#E6AD35]" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedProd(null)} className="w-1/2 py-2.5 rounded-xl font-bold border border-[#DDD6CA] text-[#6E6355] hover:bg-[#FAF7F2] cursor-pointer">Cancel</button>
                <button type="submit" disabled={updating} className="w-1/2 py-2.5 rounded-xl font-bold bg-[#E6AD35] text-[#100D0A] hover:bg-[#F5C451] cursor-pointer shadow-xs transition-all">
                  {updating ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-[#100D0A]" /> : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
