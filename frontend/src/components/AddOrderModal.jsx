import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

export default function AddOrderModal({ isOpen, onClose, onAddOrder, customers = [] }) {
  const [formData, setFormData] = useState({
    customer: customers[0]?.id || 1,
    customer_name: customers[0]?.full_name || 'Eleanor Vance',
    channel: 'In-Store POS',
    store_location: 'Downtown Flagship Store',
    total_amount: 250.00,
    payment_method: 'Credit Card',
    status: 'Completed',
    item_name: 'Cashmere Knit Sweater',
    item_price: 250.00,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCust = customers.find((c) => c.id === Number(formData.customer));
    const orderPayload = {
      customer: Number(formData.customer),
      customer_name: selectedCust ? selectedCust.full_name : formData.customer_name,
      channel: formData.channel,
      store_location: formData.store_location,
      total_amount: Number(formData.total_amount),
      status: formData.status,
      payment_method: formData.payment_method,
      items_count: 1,
      items_detail: [
        {
          name: formData.item_name,
          sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
          qty: 1,
          price: Number(formData.total_amount),
        },
      ],
    };
    onAddOrder(orderPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Record Retail Order</h3>
              <p className="text-[11px] text-slate-500">Omnichannel POS & E-Commerce purchase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Customer *</label>
            <select
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.loyalty_tier} VIP)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sales Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="In-Store POS">In-Store POS</option>
                <option value="Online Store">Online Web Store</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Loyalty Points">Loyalty Points</option>
                <option value="Gift Card">Gift Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Store / Fulfillment Center</label>
            <input
              type="text"
              value={formData.store_location}
              onChange={(e) => setFormData({ ...formData, store_location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Item Purchased</label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-500/25 transition-all"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
