import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Award,
  ShoppingBag,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign
} from 'lucide-react';

export default function CustomerDetailDrawer({
  customer,
  orders = [],
  onClose,
  onAdjustLoyalty
}) {
  const [activeTab, setActiveTab] = useState('orders'); // orders | timeline | notes
  const [pointsDelta, setPointsDelta] = useState(100);
  const [adjustReason, setAdjustReason] = useState('Store Visit Courtesy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  if (!customer) return null;

  const customerOrders = orders.filter(
    (o) => o.customer === customer.id || o.customer_name === customer.full_name
  );

  const tierColors = {
    Platinum: 'bg-violet-100 text-violet-800 border-violet-300',
    Gold: 'bg-amber-100 text-amber-800 border-amber-300',
    Silver: 'bg-slate-100 text-slate-800 border-slate-300',
    Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const handleLoyaltySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAdjustLoyalty(customer.id, pointsDelta, adjustReason);
    setIsSubmitting(false);
    setNotification(`Added ${pointsDelta} points!`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-150 flex items-start justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <div className="flex items-center gap-4">
            <img
              src={
                customer.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  customer.full_name
                )}&background=6366f1&color=fff`
              }
              alt={customer.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{customer.full_name}</h2>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    tierColors[customer.loyalty_tier] || tierColors.Bronze
                  }`}
                >
                  {customer.loyalty_tier} VIP
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {customer.phone}
                  </span>
                )}
              </div>
              {customer.city && (
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {customer.address ? `${customer.address}, ` : ''}{customer.city}, {customer.state}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 360 Overview KPI Strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-white">
          <div className="p-4 text-center">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Total CLV Spend</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              ${Number(customer.total_spend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Loyalty Points</div>
            <div className="text-lg font-bold text-indigo-600 mt-0.5">
              {Number(customer.loyalty_points || 0).toLocaleString()} <span className="text-xs font-normal">pts</span>
            </div>
          </div>
          <div className="p-4 text-center">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Preferred Channel</div>
            <div className="text-sm font-bold text-slate-800 mt-1">
              {customer.preferred_channel || 'In-Store POS'}
            </div>
          </div>
        </div>

        {/* Loyalty Quick Adjust Widget */}
        <div className="p-4 bg-indigo-50/60 border-b border-indigo-100">
          <form onSubmit={handleLoyaltySubmit} className="flex items-center gap-2 text-xs">
            <Award className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold text-indigo-950">Issue Rewards Points:</span>
            <select
              value={pointsDelta}
              onChange={(e) => setPointsDelta(Number(e.target.value))}
              className="bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700"
            >
              <option value={50}>+50 pts</option>
              <option value={100}>+100 pts</option>
              <option value={250}>+250 pts</option>
              <option value={500}>+500 pts</option>
              <option value={1000}>+1000 pts</option>
            </select>
            <input
              type="text"
              placeholder="Reason (e.g. In-store VIP courtesy)"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="flex-1 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs placeholder:text-slate-400 text-slate-700"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-lg text-xs transition-colors shrink-0"
            >
              Apply
            </button>
          </form>
          {notification && (
            <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {notification}
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/80">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Orders & Receipts ({customerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Notes & Tags
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {customerOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No recorded orders yet for this customer.
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id || ord.order_number}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ord.order_number}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {ord.channel}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        ${Number(ord.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mb-2">
                      Store: {ord.store_location || 'Online Store'}
                    </div>

                    {ord.items_detail && Array.isArray(ord.items_detail) && (
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-600">
                        {ord.items_detail.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.qty}x {item.name}</span>
                            <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Omnichannel Retail Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(customer.tags || ['VIP', 'Frequent Shopper']).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium"
                    >
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Stylist & Associate Notes
                </label>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {customer.notes || 'No customer notes added yet.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
