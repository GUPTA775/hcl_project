import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import CustomersView from './views/CustomersView';
import DealsPipelineView from './views/DealsPipelineView';
import OrdersView from './views/OrdersView';
import LoyaltyView from './views/LoyaltyView';
import TicketsView from './views/TicketsView';
import CampaignsView from './views/CampaignsView';
import SettingsView from './views/SettingsView';
import CustomerDetailDrawer from './components/CustomerDetailDrawer';
import AddCustomerModal from './components/AddCustomerModal';
import AddOrderModal from './components/AddOrderModal';
import AddDealModal from './components/AddDealModal';

import {
  fetchDashboardStats,
  fetchCustomers,
  createCustomer,
  adjustLoyaltyPoints,
  fetchDeals,
  createDeal,
  updateDealStage,
  fetchOrders,
  createOrder,
  fetchTickets,
  createTicket,
  updateTicketStatus,
  fetchCampaigns,
  createCampaign,
  seedBackendDemoData,
  checkBackendHealth
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core CRM Data
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  // Customer Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial Data Load
  const loadData = async () => {
    setIsLoading(true);
    const health = await checkBackendHealth();
    setIsLive(health.isOnline);

    const [statsRes, custRes, dealsRes, ordersRes, ticketsRes, campRes] = await Promise.all([
      fetchDashboardStats(),
      fetchCustomers(searchQuery, tierFilter, statusFilter),
      fetchDeals(),
      fetchOrders(),
      fetchTickets(),
      fetchCampaigns(),
    ]);

    setStats(statsRes.data);
    setCustomers(custRes.data);
    setDeals(dealsRes.data);
    setOrders(ordersRes.data);
    setTickets(ticketsRes.data);
    setCampaigns(campRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter customers effect
  useEffect(() => {
    fetchCustomers(searchQuery, tierFilter, statusFilter).then((res) => {
      setCustomers(res.data);
    });
  }, [searchQuery, tierFilter, statusFilter]);

  // Handlers
  const handleAddCustomer = async (data) => {
    const created = await createCustomer(data);
    setCustomers((prev) => [created, ...prev]);
    showToast(`Added customer profile for ${created.full_name || created.first_name}!`);
    loadData();
  };

  const handleAdjustLoyalty = async (custId, points, reason) => {
    const res = await adjustLoyaltyPoints(custId, points, reason);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === custId
          ? { ...c, loyalty_points: res.loyalty_points, loyalty_tier: res.loyalty_tier }
          : c
      )
    );
    if (selectedCustomer && selectedCustomer.id === custId) {
      setSelectedCustomer((prev) => ({
        ...prev,
        loyalty_points: res.loyalty_points,
        loyalty_tier: res.loyalty_tier,
      }));
    }
    showToast(`Updated loyalty points for customer.`);
  };

  const handleAddDeal = async (data) => {
    const created = await createDeal(data);
    setDeals((prev) => [created, ...prev]);
    showToast(`Added new clienteling deal: ${created.title}`);
    loadData();
  };

  const handleUpdateDealStage = async (dealId, stage) => {
    await updateDealStage(dealId, stage);
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage } : d))
    );
    showToast(`Moved deal stage to ${stage}.`);
    loadData();
  };

  const handleAddOrder = async (data) => {
    const created = await createOrder(data);
    setOrders((prev) => [created, ...prev]);
    showToast(`Recorded retail transaction ${created.order_number}!`);
    loadData();
  };

  const handleCreateTicket = async (data) => {
    const created = await createTicket(data);
    setTickets((prev) => [created, ...prev]);
    showToast(`Opened support ticket ${created.ticket_number}.`);
    loadData();
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    await updateTicketStatus(ticketId, status);
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast(`Marked ticket as ${status}.`);
    loadData();
  };

  const handleCreateCampaign = async (data) => {
    const created = await createCampaign(data);
    setCampaigns((prev) => [created, ...prev]);
    showToast(`Scheduled retail campaign "${created.name}"!`);
  };

  const handleSeedData = async () => {
    const res = await seedBackendDemoData();
    showToast(res.message || 'Seeded retail CRM demo ecosystem!');
    await loadData();
  };

  const openTicketsCount = tickets.filter(
    (t) => !['Resolved', 'Closed'].includes(t.status)
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openTicketsCount={openTicketsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Navbar */}
        <Navbar
          currentView={currentView}
          isLive={isLive}
          onRefresh={loadData}
          onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
          onOpenAddOrder={() => setIsAddOrderOpen(true)}
          onOpenAddDeal={() => setIsAddDealOpen(true)}
        />

        {/* Dynamic Views */}
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              onOpenCustomer={(c) => setSelectedCustomer(c)}
              onSeedData={handleSeedData}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onSelectCustomer={(c) => setSelectedCustomer(c)}
              onOpenAddCustomer={() => setIsAddCustomerOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tierFilter={tierFilter}
              setTierFilter={setTierFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}

          {currentView === 'deals' && (
            <DealsPipelineView
              deals={deals}
              onUpdateStage={handleUpdateDealStage}
              onOpenAddDeal={() => setIsAddDealOpen(true)}
            />
          )}

          {currentView === 'orders' && (
            <OrdersView
              orders={orders}
              onOpenAddOrder={() => setIsAddOrderOpen(true)}
            />
          )}

          {currentView === 'loyalty' && (
            <LoyaltyView
              customers={customers}
              onAdjustLoyalty={handleAdjustLoyalty}
            />
          )}

          {currentView === 'tickets' && (
            <TicketsView
              tickets={tickets}
              onUpdateStatus={handleUpdateTicketStatus}
              onCreateTicket={handleCreateTicket}
              customers={customers}
            />
          )}

          {currentView === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              onCreateCampaign={handleCreateCampaign}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              isLive={isLive}
              stats={stats}
              onSeedData={handleSeedData}
              customers={customers}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        orders={orders}
        onClose={() => setSelectedCustomer(null)}
        onAdjustLoyalty={handleAdjustLoyalty}
      />

      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onAddOrder={handleAddOrder}
        customers={customers}
      />

      <AddDealModal
        isOpen={isAddDealOpen}
        onClose={() => setIsAddDealOpen(false)}
        onAddDeal={handleAddDeal}
        customers={customers}
      />
    </div>
  );
}
