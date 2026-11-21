import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Globe,
  Smartphone,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt
} from 'lucide-react';

export default function OrdersView({
  orders = [],
  onOpenAddOrder
}) {
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedChannel !== 'All' && o.channel !== selectedChannel) return false;
    return true;
  });

  const getChannelIcon = (channel) => {
    if (channel === 'In-Store POS') return <Store className="w-4 h-4 text-indigo-600" />;
    if (channel === 'Online Store') return <Globe className="w-4 h-4 text-emerald-600" />;
    return <Smartphone className="w-4 h-4 text-violet-600" />;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Omnichannel Orders & Receipts
          </h2>
          <p className="text-xs text-slate-500">
            Real-time transaction stream across brick-and-mortar boutique POS, web store, and mobile app.
          </p>
        </div>

        <button
          onClick={onOpenAddOrder}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'In-Store POS', 'Online Store', 'Mobile App'].map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedChannel === ch
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((ord) => (
              <tr key={ord.id || ord.order_number} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {ord.order_number}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {ord.customer_name}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(ord.channel)}
                    <span className="font-medium text-slate-700">{ord.channel}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {ord.store_location || 'Flagship Store'}
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {ord.items_count || 1} items
                </td>
                <td className="py-3.5 px-4 font-extrabold text-slate-900">
                  ${Number(ord.total_amount).toFixed(2)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> {ord.status || 'Completed'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Receipt {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div><strong className="text-slate-800">Customer:</strong> {selectedOrder.customer_name}</div>
              <div><strong className="text-slate-800">Channel:</strong> {selectedOrder.channel}</div>
              <div><strong className="text-slate-800">Store:</strong> {selectedOrder.store_location}</div>
              <div><strong className="text-slate-800">Payment:</strong> {selectedOrder.payment_method}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-700 block text-[10px] uppercase">Purchased Items</span>
              {(selectedOrder.items_detail || [
                { name: 'Retail Merchandise Item', qty: 1, price: selectedOrder.total_amount }
              ]).map((it, idx) => (
                <div key={idx} className="flex justify-between border-b border-slate-200/60 pb-1">
                  <span>{it.qty}x {it.name}</span>
                  <span className="font-bold">${Number(it.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-extrabold text-sm pt-1 text-slate-900">
                <span>Total Amount:</span>
                <span>${Number(selectedOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
