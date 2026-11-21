import React, { useState } from 'react';
import {
  Award,
  Gift,
  Sparkles,
  CheckCircle,
  Crown,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function LoyaltyView({
  customers = [],
  onAdjustLoyalty
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 1);
  const [redeemSuccess, setRedeemSuccess] = useState('');

  const tiers = [
    {
      name: 'Bronze Member',
      threshold: '0 - 999 pts',
      color: 'from-orange-500 to-amber-600',
      badge: 'bg-orange-100 text-orange-800',
      perks: ['Earn 1 pt per $1 spend', 'Birthday gift coupon (15% off)', 'Online order tracking']
    },
    {
      name: 'Silver Member',
      threshold: '1,000 - 2,499 pts',
      color: 'from-slate-400 to-slate-600',
      badge: 'bg-slate-100 text-slate-800',
      perks: ['Earn 1.25 pts per $1 spend', 'Free standard 2-day delivery', 'Early seasonal access']
    },
    {
      name: 'Gold VIP',
      threshold: '2,500 - 4,999 pts',
      color: 'from-amber-400 to-yellow-600',
      badge: 'bg-amber-100 text-amber-800',
      perks: ['Earn 1.5 pts per $1 spend', 'Free express courier delivery', 'Private trunk show previews', 'Complimentary tailoring']
    },
    {
      name: 'Platinum Elite',
      threshold: '5,000+ pts',
      color: 'from-violet-600 to-indigo-800',
      badge: 'bg-violet-100 text-violet-800',
      perks: ['Earn 2.0 pts per $1 spend', 'Dedicated VIP stylist & concierge', 'Champagne in-store private salon', 'Free same-day courier']
    }
  ];

  const rewards = [
    { id: 1, name: '$20 In-Store Shopping Voucher', cost: 400, desc: 'Valid at any retail boutique POS register' },
    { id: 2, name: 'Complimentary Bespoke Garment Monogramming', cost: 300, desc: 'Hand-stitched initials on jackets, shirts, or bags' },
    { id: 3, name: '$50 Luxury Wardrobe Credit', cost: 1000, desc: 'Applied instantly at checkout online or in-store' },
    { id: 4, name: 'Private Suite VIP Styling Experience', cost: 1500, desc: '2-hour champagne appointment with head stylist' },
  ];

  const currentCust = customers.find((c) => c.id === Number(selectedCustomerId));

  const handleRedeem = (reward) => {
    if (!currentCust) return;
    if (currentCust.loyalty_points < reward.cost) {
      alert(`Customer only has ${currentCust.loyalty_points} points. Needs ${reward.cost} points.`);
      return;
    }
    onAdjustLoyalty(currentCust.id, -reward.cost, `Redeemed ${reward.name}`);
    setRedeemSuccess(`Successfully redeemed "${reward.name}" for ${currentCust.full_name}!`);
    setTimeout(() => setRedeemSuccess(''), 4000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          Loyalty & VIP Rewards Club
        </h2>
        <p className="text-xs text-slate-500">
          Tier progression rules, rewards catalog, and points redemption engine.
        </p>
      </div>

      {/* VIP Tiers Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badge}`}>
                  {t.threshold}
                </span>
                <Crown className="w-4 h-4 text-slate-400" />
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{t.name}</h3>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                {t.perks.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Catalog & Quick Redemption Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Points Redemption Simulator</h3>
            <p className="text-xs text-slate-500">Select a customer to redeem perks or perks vouchers</p>
          </div>

          {/* Customer Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Active Customer:</span>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.loyalty_points} pts - {c.loyalty_tier})
                </option>
              ))}
            </select>
          </div>
        </div>

        {redeemSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> {redeemSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-600">
                  <Gift className="w-4 h-4" />
                  <span>{r.cost} Points</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-2">{r.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{r.desc}</p>
              </div>

              <button
                onClick={() => handleRedeem(r)}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all active:scale-95"
              >
                Redeem for Client
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
