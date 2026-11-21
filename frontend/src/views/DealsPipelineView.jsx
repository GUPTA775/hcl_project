import React from 'react';
import {
  Kanban,
  Plus,
  ArrowRight,
  DollarSign,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DealsPipelineView({
  deals = [],
  onUpdateStage,
  onOpenAddDeal
}) {
  const stages = [
    { id: 'Lead', label: 'New Lead', color: 'border-blue-400 bg-blue-50/50' },
    { id: 'Contacted', label: 'Contacted', color: 'border-indigo-400 bg-indigo-50/50' },
    { id: 'Qualified', label: 'Qualified Buyer', color: 'border-violet-400 bg-violet-50/50' },
    { id: 'Proposal', label: 'Proposal Sent', color: 'border-amber-400 bg-amber-50/50' },
    { id: 'Won', label: 'Closed Won', color: 'border-emerald-400 bg-emerald-50/50' },
    { id: 'Lost', label: 'Closed Lost', color: 'border-rose-400 bg-rose-50/50' },
  ];

  const totalPipelineValue = deals
    .filter((d) => !['Won', 'Lost'].includes(d.stage))
    .reduce((sum, d) => sum + Number(d.value), 0);

  const wonValue = deals
    .filter((d) => d.stage === 'Won')
    .reduce((sum, d) => sum + Number(d.value), 0);

  const getNextStage = (currentStage) => {
    const stageOrder = ['Lead', 'Contacted', 'Qualified', 'Proposal', 'Won'];
    const idx = stageOrder.indexOf(currentStage);
    if (idx !== -1 && idx < stageOrder.length - 1) {
      return stageOrder[idx + 1];
    }
    return null;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Sales Pipeline & Clienteling Kanban
          </h2>
          <p className="text-xs text-slate-500">
            Track high-ticket retail clienteling, custom orders, and corporate gifting accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Active Pipeline: </span>
            <span className="font-extrabold text-slate-900">
              ${totalPipelineValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={onOpenAddDeal}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-violet-600/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {stages.map((stg) => {
          const stageDeals = deals.filter((d) => d.stage === stg.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + Number(d.value), 0);

          return (
            <div
              key={stg.id}
              className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/60 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-200 mb-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800">{stg.label}</span>
                  <div className="text-[10px] text-slate-500">
                    ${stageTotal.toLocaleString()} ({stageDeals.length})
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {stageDeals.length}
                </span>
              </div>

              {/* Deals Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageDeals.map((deal) => {
                  const nextStage = getNextStage(deal.stage);
                  return (
                    <div
                      key={deal.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {deal.title}
                          </h4>
                        </div>

                        <div className="text-[11px] font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{deal.customer_name}</span>
                        </div>

                        <div className="text-sm font-extrabold text-slate-900 mb-2">
                          ${Number(deal.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>

                        {deal.expected_close_date && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>Target: {deal.expected_close_date}</span>
                          </div>
                        )}
                      </div>

                      {/* Advance Stage button */}
                      {nextStage && (
                        <button
                          onClick={() => onUpdateStage(deal.id, nextStage)}
                          className="mt-2 w-full py-1.5 bg-slate-50 hover:bg-violet-50 text-slate-600 hover:text-violet-700 border border-slate-200 hover:border-violet-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Move to {nextStage}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[11px]">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
