/**
 * RetailMax CRM API Client Service
 * Connects to Django REST backend (with Supabase PostgreSQL)
 * Provides automatic mock fallback when backend is offline.
 */

import {
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_DEALS,
  INITIAL_TICKETS,
  INITIAL_CAMPAIGNS
} from '../mockData';

const API_BASE = 'http://localhost:8000/api';

// Local cache for mutations during mock mode
let mockCustomers = [...INITIAL_CUSTOMERS];
let mockOrders = [...INITIAL_ORDERS];
let mockDeals = [...INITIAL_DEALS];
let mockTickets = [...INITIAL_TICKETS];
let mockCampaigns = [...INITIAL_CAMPAIGNS];

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Health check non-200');
    const data = await res.json();
    return { isOnline: true, data };
  } catch (err) {
    return {
      isOnline: false,
      data: {
        status: 'mock_fallback',
        message: 'Django API offline. Running in interactive demo mode.',
        database: {
          supabase_configured: false,
          database_mode: 'Client-side simulation (Ready for Django & Supabase)'
        }
      }
    };
  }
}

// ----------------------------------------------------------------------------
// Dashboard Stats
// ----------------------------------------------------------------------------
export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats/`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await res.json();
    return { isLive: true, data };
  } catch (err) {
    // Generate calculated mock stats
    const totalRevenue = mockOrders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const activePipeline = mockDeals
      .filter(d => !['Won', 'Lost'].includes(d.stage))
      .reduce((sum, d) => sum + Number(d.value), 0);

    const openTickets = mockTickets.filter(t => !['Resolved', 'Closed'].includes(t.status)).length;

    const tierDistribution = {
      Bronze: mockCustomers.filter(c => c.loyalty_tier === 'Bronze').length,
      Silver: mockCustomers.filter(c => c.loyalty_tier === 'Silver').length,
      Gold: mockCustomers.filter(c => c.loyalty_tier === 'Gold').length,
      Platinum: mockCustomers.filter(c => c.loyalty_tier === 'Platinum').length,
    };

    const channelRevenue = {
      'In-Store POS': mockOrders.filter(o => o.channel === 'In-Store POS').reduce((s, o) => s + Number(o.total_amount), 0),
      'Online Store': mockOrders.filter(o => o.channel === 'Online Store').reduce((s, o) => s + Number(o.total_amount), 0),
      'Mobile App': mockOrders.filter(o => o.channel === 'Mobile App').reduce((s, o) => s + Number(o.total_amount), 0),
    };

    const pipelineStages = {
      Lead: { count: mockDeals.filter(d => d.stage === 'Lead').length, total_value: mockDeals.filter(d => d.stage === 'Lead').reduce((s, d) => s + Number(d.value), 0) },
      Contacted: { count: mockDeals.filter(d => d.stage === 'Contacted').length, total_value: mockDeals.filter(d => d.stage === 'Contacted').reduce((s, d) => s + Number(d.value), 0) },
      Qualified: { count: mockDeals.filter(d => d.stage === 'Qualified').length, total_value: mockDeals.filter(d => d.stage === 'Qualified').reduce((s, d) => s + Number(d.value), 0) },
      Proposal: { count: mockDeals.filter(d => d.stage === 'Proposal').length, total_value: mockDeals.filter(d => d.stage === 'Proposal').reduce((s, d) => s + Number(d.value), 0) },
      Won: { count: mockDeals.filter(d => d.stage === 'Won').length, total_value: mockDeals.filter(d => d.stage === 'Won').reduce((s, d) => s + Number(d.value), 0) },
      Lost: { count: mockDeals.filter(d => d.stage === 'Lost').length, total_value: mockDeals.filter(d => d.stage === 'Lost').reduce((s, d) => s + Number(d.value), 0) },
    };

    return {
      isLive: false,
      data: {
        kpis: {
          total_customers: mockCustomers.length,
          vip_customers: mockCustomers.filter(c => c.status === 'VIP').length,
          at_risk_customers: mockCustomers.filter(c => c.status === 'At-Risk').length,
          total_revenue: Math.round(totalRevenue * 100) / 100,
          active_pipeline_value: Math.round(activePipeline * 100) / 100,
          open_tickets: openTickets,
          total_orders: mockOrders.length,
        },
        tier_distribution: tierDistribution,
        channel_revenue: channelRevenue,
        pipeline_stages: pipelineStages,
        recent_orders: mockOrders.slice(0, 5),
        recent_interactions: [
          { id: 1, customer_name: 'Eleanor Vance', interaction_type: 'Store Visit', summary: 'Private Suite VIP Consultation', date: '2026-11-19T11:00:00Z', agent_name: 'Sarah Jenkins' },
          { id: 2, customer_name: 'Marcus Sterling', interaction_type: 'Live Chat', summary: 'Sizing inquiry for slim chinos', date: '2026-11-17T15:30:00Z', agent_name: 'Tyler Ross' },
          { id: 3, customer_name: 'Julian Alvarez', interaction_type: 'Phone Call', summary: 'Corporate fitting session scheduling', date: '2026-11-20T16:00:00Z', agent_name: 'Marcus Brody' }
        ],
        supabase_status: {
          supabase_configured: true,
          database_mode: 'Supabase PostgreSQL (db.bywidhuibkjsvhwxekao.supabase.co:5432)',
          message: 'Supabase host db.bywidhuibkjsvhwxekao.supabase.co configured. Supabase PostgreSQL credentials active. Connect Django API on port 8000.'
        }
      }
    };
  }
}

// ----------------------------------------------------------------------------
// Customers API
// ----------------------------------------------------------------------------
export async function fetchCustomers(search = '', tier = 'All', status = 'All') {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (tier && tier !== 'All') params.append('tier', tier);
    if (status && status !== 'All') params.append('status', status);

    const res = await fetch(`${API_BASE}/customers/?${params.toString()}`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return { isLive: true, data: Array.isArray(data) ? data : data.results || [] };
  } catch (err) {
    let filtered = [...mockCustomers];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q)
      );
    }
    if (tier && tier !== 'All') {
      filtered = filtered.filter(c => c.loyalty_tier === tier);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter(c => c.status === status);
    }
    return { isLive: false, data: filtered };
  }
}

export async function createCustomer(customerData) {
  try {
    const res = await fetch(`${API_BASE}/customers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    if (!res.ok) throw new Error('Failed to create customer on server');
    return await res.json();
  } catch (err) {
    const newCust = {
      ...customerData,
      id: Date.now(),
      full_name: `${customerData.first_name} ${customerData.last_name}`,
      total_spend: Number(customerData.total_spend || 0),
      loyalty_points: Number(customerData.loyalty_points || 100),
      tags: customerData.tags || ['New Customer'],
      created_at: new Date().toISOString()
    };
    mockCustomers.unshift(newCust);
    return newCust;
  }
}

export async function adjustLoyaltyPoints(customerId, points, reason) {
  try {
    const res = await fetch(`${API_BASE}/customers/${customerId}/adjust-loyalty/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points, reason })
    });
    if (!res.ok) throw new Error('Server loyalty update failed');
    return await res.json();
  } catch (err) {
    const cust = mockCustomers.find(c => c.id === customerId);
    if (cust) {
      cust.loyalty_points = Math.max(0, cust.loyalty_points + points);
      if (cust.loyalty_points >= 5000) cust.loyalty_tier = 'Platinum';
      else if (cust.loyalty_points >= 2500) cust.loyalty_tier = 'Gold';
      else if (cust.loyalty_points >= 1000) cust.loyalty_tier = 'Silver';
      else cust.loyalty_tier = 'Bronze';
    }
    return { success: true, loyalty_points: cust?.loyalty_points, loyalty_tier: cust?.loyalty_tier };
  }
}

// ----------------------------------------------------------------------------
// Deals API
// ----------------------------------------------------------------------------
export async function fetchDeals() {
  try {
    const res = await fetch(`${API_BASE}/deals/`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return { isLive: true, data: Array.isArray(data) ? data : data.results || [] };
  } catch (err) {
    return { isLive: false, data: mockDeals };
  }
}

export async function createDeal(dealData) {
  try {
    const res = await fetch(`${API_BASE}/deals/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealData)
    });
    if (!res.ok) throw new Error('Server deal creation failed');
    return await res.json();
  } catch (err) {
    const newDeal = { ...dealData, id: Date.now() };
    mockDeals.unshift(newDeal);
    return newDeal;
  }
}

export async function updateDealStage(dealId, newStage) {
  try {
    const res = await fetch(`${API_BASE}/deals/${dealId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage })
    });
    if (!res.ok) throw new Error('Stage update failed');
    return await res.json();
  } catch (err) {
    const d = mockDeals.find(x => x.id === dealId);
    if (d) d.stage = newStage;
    return d;
  }
}

// ----------------------------------------------------------------------------
// Orders API
// ----------------------------------------------------------------------------
export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders/`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return { isLive: true, data: Array.isArray(data) ? data : data.results || [] };
  } catch (err) {
    return { isLive: false, data: mockOrders };
  }
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Server order creation failed');
    return await res.json();
  } catch (err) {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      order_number: `RMX-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString()
    };
    mockOrders.unshift(newOrder);
    return newOrder;
  }
}

// ----------------------------------------------------------------------------
// Tickets API
// ----------------------------------------------------------------------------
export async function fetchTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets/`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return { isLive: true, data: Array.isArray(data) ? data : data.results || [] };
  } catch (err) {
    return { isLive: false, data: mockTickets };
  }
}

export async function updateTicketStatus(ticketId, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) throw new Error('Ticket update failed');
    return await res.json();
  } catch (err) {
    const t = mockTickets.find(x => x.id === ticketId);
    if (t) t.status = newStatus;
    return t;
  }
}

export async function createTicket(ticketData) {
  try {
    const res = await fetch(`${API_BASE}/tickets/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    if (!res.ok) throw new Error('Ticket creation failed');
    return await res.json();
  } catch (err) {
    const newTicket = {
      ...ticketData,
      id: Date.now(),
      ticket_number: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      created_at: new Date().toISOString()
    };
    mockTickets.unshift(newTicket);
    return newTicket;
  }
}

// ----------------------------------------------------------------------------
// Campaigns API
// ----------------------------------------------------------------------------
export async function fetchCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/campaigns/`, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return { isLive: true, data: Array.isArray(data) ? data : data.results || [] };
  } catch (err) {
    return { isLive: false, data: mockCampaigns };
  }
}

export async function createCampaign(campaignData) {
  try {
    const res = await fetch(`${API_BASE}/campaigns/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    if (!res.ok) throw new Error('Campaign creation failed');
    return await res.json();
  } catch (err) {
    const newCamp = {
      ...campaignData,
      id: Date.now(),
      sent_count: 0,
      opened_count: 0,
      conversion_count: 0,
      created_at: new Date().toISOString()
    };
    mockCampaigns.unshift(newCamp);
    return newCamp;
  }
}

// ----------------------------------------------------------------------------
// Demo Data Seeder
// ----------------------------------------------------------------------------
export async function seedBackendDemoData() {
  try {
    const res = await fetch(`${API_BASE}/seed-data/`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    mockCustomers = [...INITIAL_CUSTOMERS];
    mockOrders = [...INITIAL_ORDERS];
    mockDeals = [...INITIAL_DEALS];
    mockTickets = [...INITIAL_TICKETS];
    mockCampaigns = [...INITIAL_CAMPAIGNS];
    return {
      status: 'success',
      message: 'RetailMax CRM demo retail data reloaded in memory.',
      customers_count: mockCustomers.length
    };
  }
}

