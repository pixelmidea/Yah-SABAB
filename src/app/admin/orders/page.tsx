'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Loader2,
  Phone,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentStatusFilter, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentStatusFilter !== 'all') params.append('paymentStatus', paymentStatusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Fetch orders error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setUpdateMsg({ text: '', isError: false });

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_payment' })
      });
      const data = await res.json();

      if (data.success) {
        setSelectedOrder(data.order);
        setUpdateMsg({ text: 'Payment Verified & Order Confirmed!', isError: false });
        fetchOrders();
      } else {
        setUpdateMsg({ text: data.error || 'Failed to verify payment', isError: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setUpdateMsg({ text: '', isError: false });

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_payment',
          rejectionReason: rejectionReason || 'Transaction ID not matching bank records'
        })
      });
      const data = await res.json();

      if (data.success) {
        setSelectedOrder(data.order);
        setUpdateMsg({ text: 'Payment rejected successfully.', isError: true });
        fetchOrders();
      } else {
        setUpdateMsg({ text: data.error || 'Failed to reject payment', isError: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();

      if (data.success) {
        setSelectedOrder(data.order);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">
              Order & Payment Verification Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify bKash / Nagad / Rocket transaction IDs, update shipment workflow, and track orders.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search #ORD, Phone, TrxID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pl-9 text-xs font-medium focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Workflow Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Payment Pending">Payment Pending Verification</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Payment Pending">Payment Pending Verification</option>
            <option value="Payment Verified">Payment Verified</option>
            <option value="Payment Rejected">Payment Rejected</option>
            <option value="Unpaid">Unpaid (COD)</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-amber-900">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-serif font-bold text-slate-800 text-lg">No Orders Found</p>
            <p className="text-xs text-slate-400">No orders match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer & Phone</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {orders.map((order) => {
                  const isPendingVerification = order.paymentInfo?.status === 'Payment Pending';
                  return (
                    <tr key={order._id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-950">
                        {order.orderNumber}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.shippingAddress?.fullName}</div>
                        <div className="text-[11px] text-slate-500">{order.shippingAddress?.phone}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {order.paymentInfo?.method}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {order.paymentInfo?.transactionId || '—'}
                      </td>
                      <td className="p-4 font-bold text-amber-950">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.paymentInfo?.status === 'Payment Verified'
                            ? 'bg-emerald-100 text-emerald-900'
                            : isPendingVerification
                            ? 'bg-amber-100 text-amber-900 animate-pulse'
                            : order.paymentInfo?.status === 'Payment Rejected'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {order.paymentInfo?.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold">
                        {order.orderStatus}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setUpdateMsg({ text: '', isError: false });
                          }}
                          className="bg-amber-900 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-amber-950 transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Verify</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VERIFICATION & DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold">
                  Order Verification #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-BD')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {updateMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  updateMsg.isError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {updateMsg.text}
                </div>
              )}

              {/* PAYMENT VERIFICATION BOX */}
              {selectedOrder.paymentInfo?.method !== 'COD' && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <h4 className="font-serif font-bold text-amber-950 text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-900" />
                    <span>Manual {selectedOrder.paymentInfo?.method} Verification Details</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs text-amber-950">
                    <div>
                      <span className="text-slate-500 block">Submitted Sender Number:</span>
                      <strong className="text-sm font-mono">{selectedOrder.paymentInfo?.senderNumber || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Submitted Trx ID:</span>
                      <strong className="text-sm font-mono uppercase bg-white px-2 py-0.5 rounded-md border border-amber-300 inline-block">
                        {selectedOrder.paymentInfo?.transactionId || 'N/A'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Total Order Payable Amount:</span>
                      <strong className="text-sm font-bold text-amber-950">{formatPrice(selectedOrder.totalAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Payment Verification Status:</span>
                      <strong className="text-sm font-bold">{selectedOrder.paymentInfo?.status}</strong>
                    </div>
                  </div>

                  {selectedOrder.paymentInfo?.status === 'Payment Pending' && (
                    <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleVerifyPayment}
                        disabled={updating}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>Approve & Verify Payment</span>
                      </button>

                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Rejection reason..."
                          className="bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs flex-1"
                        />
                        <button
                          onClick={handleRejectPayment}
                          disabled={updating}
                          className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WORKFLOW STATUS CONTROL */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Workflow Order Status
                </label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-hidden"
                >
                  <option value="Pending">Pending</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled (Restock items)</option>
                </select>
              </div>

              {/* Shipping Address Details */}
              <div className="space-y-1 text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Delivery Address</h4>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.area}, {selectedOrder.shippingAddress?.district}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
