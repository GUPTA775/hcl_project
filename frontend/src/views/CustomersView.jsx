import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Award,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Tag
} from 'lucide-react';

export default function CustomersView({
  customers = [],
  onSelectCustomer,
  onOpenAddCustomer,
  searchQuery,
  setSearchQuery,
  tierFilter,
  setTierFilter,
  statusFilter,
  setStatusFilter
}) {
  const tierBadges = {
    Platinum: 'bg-violet-100 text-violet-800 border-violet-300',
    Gold: 'bg-amber-100 text-amber-800 border-amber-300',
    Silver: 'bg-slate-100 text-slate-800 border-slate-300',
    Bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const statusBadges = {
    VIP: 'bg-purple-100 text-purple-700',
    Active: 'bg-emerald-100 text-emerald-700',
    'At-Risk': 'bg-rose-100 text-rose-700 font-bold',
    Lead: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Customer 360° Directory
          </h2>
          <p className="text-xs text-slate-500">
            Total {customers.length} retail client profiles with omnichannel purchasing data & loyalty points.
          </p>
        </div>

        <button
          onClick={onOpenAddCustomer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-medium">Tier:</span>
            {['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  tierFilter === tier
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="VIP">VIP</option>
            <option value="Active">Active</option>
            <option value="At-Risk">At-Risk</option>
            <option value="Lead">Lead</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCustomer(c)}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      c.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        c.full_name || `${c.first_name} ${c.last_name}`
                      )}&background=6366f1&color=fff`
                    }
                    alt={c.full_name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-500 transition-all"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {c.full_name || `${c.first_name} ${c.last_name}`}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {c.email}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    tierBadges[c.loyalty_tier] || tierBadges.Bronze
                  }`}
                >
                  {c.loyalty_tier}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {(c.tags || ['Customer']).slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card footer metrics */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Lifetime Value
                </span>
                <span className="font-extrabold text-slate-900">
                  ${Number(c.total_spend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Loyalty Points
                </span>
                <span className="font-bold text-indigo-600">
                  {Number(c.loyalty_points || 0).toLocaleString()} pts
                </span>
              </div>

              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Customers Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or add a new customer.</p>
          </div>
        )}
      </div>
    </div>
  );
}
