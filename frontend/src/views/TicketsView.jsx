import React, { useState } from 'react';
import {
  Headphones,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Search,
  Check
} from 'lucide-react';

export default function TicketsView({
  tickets = [],
  onUpdateStatus,
  onCreateTicket,
  customers = []
}) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customer: customers[0]?.id || 1,
    subject: '',
    description: '',
    category: 'Order Issue',
    priority: 'Medium',
  });

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    return true;
  });

  const priorityColors = {
    Urgent: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    High: 'bg-amber-100 text-amber-800 border-amber-300',
    Medium: 'bg-blue-100 text-blue-800 border-blue-300',
    Low: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === Number(newTicket.customer));
    onCreateTicket({
      ...newTicket,
      customer: Number(newTicket.customer),
      customer_name: cust ? cust.full_name : 'Customer',
    });
    setShowNewModal(false);
    setNewTicket({
      customer: customers[0]?.id || 1,
      subject: '',
      description: '',
      category: 'Order Issue',
      priority: 'Medium',
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Customer Service & Help Desk
          </h2>
          <p className="text-xs text-slate-500">
            Omnichannel retail returns, exchanges, sizing consultations, and loyalty inquiries.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Status filter bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterStatus === st
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((t) => (
          <div
            key={t.id || t.ticket_number}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">{t.ticket_number}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    priorityColors[t.priority] || priorityColors.Medium
                  }`}
                >
                  {t.priority} Priority
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {t.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{t.subject}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                <span>Customer: <strong className="text-slate-700">{t.customer_name}</strong></span>
                <span>&bull;</span>
                <span>Assigned: <strong className="text-slate-700">{t.assigned_to || 'Support'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  t.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : t.status === 'In Progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {t.status}
              </span>

              {t.status !== 'Resolved' && (
                <button
                  onClick={() => onUpdateStatus(t.id, 'Resolved')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
            No support cases in this category.
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Create Support Ticket</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer *</label>
                <select
                  value={newTicket.customer}
                  onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject *</label>
                <input
                  required
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. In-store return verification"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Order Issue">Order Issue</option>
                    <option value="Return & Refund">Return & Refund</option>
                    <option value="Product Defect">Product Defect</option>
                    <option value="Loyalty Points">Loyalty Points</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  placeholder="Detailed inquiry notes..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
