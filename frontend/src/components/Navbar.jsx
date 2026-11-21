import React, { useState } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Bell,
  Database,
  UserPlus,
  ShoppingBag,
  Kanban
} from 'lucide-react';

export default function Navbar({
  currentView,
  isLive,
  onRefresh,
  onOpenAddCustomer,
  onOpenAddOrder,
  onOpenAddDeal
}) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const viewTitles = {
    dashboard: 'Retail Executive Overview',
    customers: 'Customer 360° Directory',
    deals: 'Sales Pipeline & Clienteling',
    orders: 'Omnichannel Orders & POS',
    loyalty: 'Loyalty & VIP Rewards Club',
    tickets: 'Customer Service & Help Desk',
    campaigns: 'Retail Marketing & Promotions',
    settings: 'Supabase Database & API Settings',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & View Info */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          {viewTitles[currentView] || 'RetailMax CRM'}
        </h1>

        {/* Backend Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            isLive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}
          title={isLive ? 'Connected to Django Backend' : 'Running in Interactive Demo Mode'}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isLive ? 'bg-emerald-500 animate-ping' : 'bg-indigo-500'
            }`}
          />
          <Database className="w-3 h-3" />
          <span>{isLive ? 'Django API Live' : 'Demo Mode (Ready for API)'}</span>
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Refresh CRM Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Action</span>
          </button>

          {showQuickAdd && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
              onMouseLeave={() => setShowQuickAdd(false)}
            >
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenAddCustomer();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <UserPlus className="w-4 h-4 text-indigo-500" />
                <span>New Customer Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenAddOrder();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <span>New Retail Order</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  onOpenAddDeal();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
              >
                <Kanban className="w-4 h-4 text-violet-500" />
                <span>New Clienteling Deal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
