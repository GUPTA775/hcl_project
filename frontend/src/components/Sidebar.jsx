import React from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  ShoppingBag,
  Award,
  Headphones,
  Megaphone,
  Settings,
  Sparkles,
  ShoppingBasket
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, openTicketsCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer 360°', icon: Users, badge: 'VIP' },
    { id: 'deals', label: 'Deals & Pipeline', icon: Kanban },
    { id: 'orders', label: 'Omnichannel Orders', icon: ShoppingBag },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: Award },
    { id: 'tickets', label: 'Customer Service', icon: Headphones, badgeCount: openTicketsCount },
    { id: 'campaigns', label: 'Campaigns & SMS', icon: Megaphone },
    { id: 'settings', label: 'Supabase & API', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <ShoppingBasket className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
              RetailMax <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">CRM</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
              MaximizeCRM Engine
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Retail Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}

              {item.badgeCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-500 text-white">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Supabase Status Pill */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700/60">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[11px] font-bold text-slate-200">Supabase Connected</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          PostgreSQL database with real-time sync & Django REST API.
        </p>
      </div>

      {/* User profile bottom footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/40">
            RM
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Retail Admin</div>
            <div className="text-[10px] text-slate-500">Downtown Flagship</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
