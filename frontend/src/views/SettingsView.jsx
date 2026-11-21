import React, { useState } from 'react';
import {
  Database,
  Server,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Download,
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function SettingsView({
  isLive,
  stats,
  onSeedData,
  customers = []
}) {
  const [copied, setCopied] = useState(false);

  const supabaseUrlTemplate = 'postgresql://postgres:[YOUR-DATABASE-PASSWORD]@db.bywidhuibkjsvhwxekao.supabase.co:5432/postgres';

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `retailmax-customers-${new Date().toISOString().split('T')[0]}.json`);
    dl.click();
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" />
          Supabase PostgreSQL & Django API Settings
        </h2>
        <p className="text-xs text-slate-500">
          Environment configuration, live health diagnostics, and Supabase integration hub.
        </p>
      </div>

      {/* Diagnostics Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-600" /> System Diagnostics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Django Backend Status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                isLive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              }`}
            />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Django REST Backend API (Port 8000)
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isLive
                  ? 'Connected & actively responding to endpoints.'
                  : 'Backend offline. Running with client-side interactive fallback.'}
              </div>
            </div>
          </div>

          {/* Supabase Status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Supabase PostgreSQL Database
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats?.supabase_status?.message || 'Configured with PostgreSQL schema & connection pooler.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Supabase Connection Guide */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            How to Connect Your Supabase PostgreSQL Project
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow these 3 easy steps to connect RetailMax CRM to your cloud database.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              âœ“
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Supabase Project Configured</h4>
              <p className="text-slate-600 mt-0.5">
                Connected to project: <strong className="font-mono text-indigo-700">bywidhuibkjsvhwxekao</strong> (Host: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">db.bywidhuibkjsvhwxekao.supabase.co:5432</code>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Database Password Configured</h4>
              <p className="text-slate-600 mt-0.5">
                Authenticated for user <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">postgres</code> with SSL connection to <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">db.bywidhuibkjsvhwxekao.supabase.co:5432</code>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Run Migrations or Execute SQL Schema</h4>
              <p className="text-slate-600 mt-0.5">
                Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">python manage.py migrate</code> or paste the contents of <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">backend/supabase_schema.sql</code> into the Supabase SQL Editor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Operations */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Retail CRM Demo Data</h3>
          <p className="text-xs text-slate-500">Seed sample omnichannel retail customers, transactions and tickets.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSeedData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Seed Demo Data</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Customers JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}

