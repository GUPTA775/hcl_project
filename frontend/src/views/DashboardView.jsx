import React from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Headphones,
  ShoppingBag,
  Store,
  Globe,
  Smartphone,
  ArrowUpRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function DashboardView({
  stats,
  onOpenCustomer,
  onSeedData,
  onNavigate
}) {
  const kpis = stats?.kpis || {
    total_customers: 6,
    vip_customers: 2,
    total_revenue: 4700.0,
    active_pipeline_value: 22100.0,
    open_tickets: 2,
    total_orders: 4,
  };

  const channelRevenue = stats?.channel_revenue || {
    'In-Store POS': 3700.0,
    'Online Store': 680.0,
    'Mobile App': 320.0,
  };

  const totalChannelRev = Object.values(channelRevenue).reduce((a, b) => a + b, 0) || 1;

  const tierDistribution = stats?.tier_distribution || {
    Platinum: 2,
    Gold: 2,
    Silver: 1,
    Bronze: 1,
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> RetailMax CRM Enterprise
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Streamlining Retail Customer Relationships
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Omnichannel clienteling, VIP loyalty tiers, sales pipeline tracking, and customer service unified with Supabase PostgreSQL & Django.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSeedData}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Seed Retail Demo Data</span>
            </button>
            <button
              onClick={() => onNavigate('customers')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Customer 360°</span>
            </button>
          </div>
        </div>

        {/* Ambient background blur blobs */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {kpis.total_customers}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-emerald-600">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold">
              {kpis.vip_customers} VIPs
            </span>
            <span className="text-slate-500">active profiles</span>
          </div>
        </div>

        {/* Omnichannel Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Sales Volume
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ${Number(kpis.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            <span>Across all omnichannel POS & Web</span>
          </div>
        </div>

        {/* Clienteling Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Deals Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            ${Number(kpis.active_pipeline_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-violet-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>High-value clienteling</span>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Open Support Cases
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {kpis.open_tickets}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-medium">
            <span>Avg resolution: &lt; 2.5 hrs</span>
          </div>
        </div>
      </div>

      {/* Omnichannel Breakdown & Loyalty Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Revenue Split */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Omnichannel Sales Breakdown</h3>
              <p className="text-xs text-slate-500">Distribution by store register, website and mobile</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              This Month
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {/* In-Store POS */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                <span className="flex items-center gap-2 text-slate-700">
                  <Store className="w-4 h-4 text-indigo-600" /> In-Store Boutique Registers
                </span>
                <span className="text-slate-900 font-bold">
                  ${Number(channelRevenue['In-Store POS'] || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({Math.round(((channelRevenue['In-Store POS'] || 0) / totalChannelRev) * 100)}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.round(((channelRevenue['In-Store POS'] || 0) / totalChannelRev) * 100)}%` }}
                />
              </div>
            </div>

            {/* Online Store */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                <span className="flex items-center gap-2 text-slate-700">
                  <Globe className="w-4 h-4 text-emerald-600" /> E-Commerce Online Web
                </span>
                <span className="text-slate-900 font-bold">
                  ${Number(channelRevenue['Online Store'] || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({Math.round(((channelRevenue['Online Store'] || 0) / totalChannelRev) * 100)}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.round(((channelRevenue['Online Store'] || 0) / totalChannelRev) * 100)}%` }}
                />
              </div>
            </div>

            {/* Mobile App */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                <span className="flex items-center gap-2 text-slate-700">
                  <Smartphone className="w-4 h-4 text-violet-600" /> RetailMax iOS & Android App
                </span>
                <span className="text-slate-900 font-bold">
                  ${Number(channelRevenue['Mobile App'] || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} ({Math.round(((channelRevenue['Mobile App'] || 0) / totalChannelRev) * 100)}%)
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${Math.round(((channelRevenue['Mobile App'] || 0) / totalChannelRev) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Program Members */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">VIP Loyalty Program</h3>
              <Award className="w-5 h-5 text-amber-500" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-violet-50/70 border border-violet-100">
                <span className="text-xs font-bold text-violet-900">Platinum Elite (5000+ pts)</span>
                <span className="text-xs font-extrabold text-violet-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  {tierDistribution.Platinum || 0} members
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-xs font-bold text-amber-900">Gold VIP (2500+ pts)</span>
                <span className="text-xs font-extrabold text-amber-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  {tierDistribution.Gold || 0} members
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Silver Member (1000+ pts)</span>
                <span className="text-xs font-extrabold text-slate-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  {tierDistribution.Silver || 0} members
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
                <span className="text-xs font-bold text-orange-900">Bronze Member (Entry)</span>
                <span className="text-xs font-extrabold text-orange-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  {tierDistribution.Bronze || 0} members
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('loyalty')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
          >
            Manage VIP Rewards Club
          </button>
        </div>
      </div>

      {/* Recent Orders & Touchpoint Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-150 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Omnichannel Activity</h3>
            <p className="text-xs text-slate-500">Recent store purchases and customer touchpoints</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            View All Orders &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {(stats?.recent_orders || []).map((ord) => (
            <div key={ord.id || ord.order_number} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {ord.order_number} &bull; {ord.customer_name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ord.channel} &bull; {ord.store_location || 'Flagship Store'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">
                  ${Number(ord.total_amount).toFixed(2)}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600">
                  {ord.status || 'Completed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
