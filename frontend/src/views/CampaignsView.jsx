import React, { useState } from 'react';
import {
  Megaphone,
  Mail,
  Smartphone,
  Send,
  Plus,
  Percent,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function CampaignsView({
  campaigns = [],
  onCreateCampaign
}) {
  const [showModal, setShowModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    channel: 'Email',
    target_tier: 'All',
    discount_code: 'SAVE20',
    status: 'Active',
  });

  const getChannelIcon = (ch) => {
    if (ch === 'Email') return <Mail className="w-4 h-4 text-indigo-500" />;
    if (ch === 'SMS') return <Smartphone className="w-4 h-4 text-emerald-500" />;
    return <Megaphone className="w-4 h-4 text-violet-500" />;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateCampaign(newCampaign);
    setShowModal(false);
    setNewCampaign({
      name: '',
      channel: 'Email',
      target_tier: 'All',
      discount_code: 'SAVE20',
      status: 'Active',
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Targeted Retail Campaigns & Promotions
          </h2>
          <p className="text-xs text-slate-500">
            Drive repeat purchases with segmented email blasts, SMS flashes, and push notifications.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((cmp) => {
          const openRate = cmp.sent_count > 0 ? Math.round((cmp.opened_count / cmp.sent_count) * 100) : 0;
          return (
            <div
              key={cmp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(cmp.channel)}
                    <span className="text-xs font-bold text-slate-700">{cmp.channel}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {cmp.target_tier}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-2">{cmp.name}</h3>

                {cmp.discount_code && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    <Percent className="w-3 h-3" /> {cmp.discount_code}
                  </div>
                )}
              </div>

              {/* Campaign performance numbers */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Sent</span>
                  <span className="font-extrabold text-slate-900">{cmp.sent_count}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Open Rate</span>
                  <span className="font-extrabold text-indigo-600">{openRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Conversions</span>
                  <span className="font-extrabold text-emerald-600">{cmp.conversion_count}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Launch Retail Campaign</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campaign Title *</label>
                <input
                  required
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. VIP Private Suite Invitation"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Channel</label>
                  <select
                    value={newCampaign.channel}
                    onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                  >
                    <option value="Email">Email</option>
                    <option value="SMS">Direct SMS</option>
                    <option value="Push">Mobile App Push</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audience Tier</label>
                  <select
                    value={newCampaign.target_tier}
                    onChange={(e) => setNewCampaign({ ...newCampaign, target_tier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Platinum">Platinum Elite Only</option>
                    <option value="Gold">Gold VIP Only</option>
                    <option value="Silver">Silver Only</option>
                    <option value="Bronze">Bronze (Winback)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Voucher / Promo Code</label>
                <input
                  type="text"
                  value={newCampaign.discount_code}
                  onChange={(e) => setNewCampaign({ ...newCampaign, discount_code: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  placeholder="RETAILMAX20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  Schedule Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
