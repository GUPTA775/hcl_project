-- =========================================================================
-- RetailMax CRM - Supabase PostgreSQL Database Schema
-- Streamlining Customer Relationships for Omnichannel Retail
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. Customers Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_customer (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    phone VARCHAR(30) DEFAULT '',
    avatar_url VARCHAR(500) DEFAULT '',
    loyalty_tier VARCHAR(20) DEFAULT 'Bronze',
    loyalty_points INTEGER DEFAULT 100,
    total_spend NUMERIC(12, 2) DEFAULT 0.00,
    preferred_channel VARCHAR(30) DEFAULT 'In-Store',
    status VARCHAR(20) DEFAULT 'Active',
    address VARCHAR(255) DEFAULT '',
    city VARCHAR(100) DEFAULT '',
    state VARCHAR(100) DEFAULT '',
    postal_code VARCHAR(20) DEFAULT '',
    country VARCHAR(100) DEFAULT 'United States',
    tags JSONB DEFAULT '[]'::jsonb,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_email ON public.core_customer (email);
CREATE INDEX IF NOT EXISTS idx_customer_tier ON public.core_customer (loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_customer_status ON public.core_customer (status);

-- -------------------------------------------------------------------------
-- 2. Sales Pipeline / Deals Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_deal (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    customer_id BIGINT REFERENCES public.core_customer(id) ON DELETE CASCADE,
    value NUMERIC(12, 2) DEFAULT 0.00,
    stage VARCHAR(30) DEFAULT 'Lead',
    probability INTEGER DEFAULT 50,
    expected_close_date DATE,
    assigned_agent VARCHAR(100) DEFAULT 'Sarah Jenkins',
    priority VARCHAR(20) DEFAULT 'Medium',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_stage ON public.core_deal (stage);
CREATE INDEX IF NOT EXISTS idx_deal_customer ON public.core_deal (customer_id);

-- -------------------------------------------------------------------------
-- 3. Omnichannel Orders / Purchases Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_order (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT REFERENCES public.core_customer(id) ON DELETE CASCADE,
    channel VARCHAR(30) DEFAULT 'In-Store POS',
    store_location VARCHAR(100) DEFAULT 'Downtown Flagship Store',
    total_amount NUMERIC(12, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Completed',
    payment_method VARCHAR(50) DEFAULT 'Credit Card',
    items_count INTEGER DEFAULT 1,
    items_detail JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_number ON public.core_order (order_number);
CREATE INDEX IF NOT EXISTS idx_order_customer ON public.core_order (customer_id);
CREATE INDEX IF NOT EXISTS idx_order_channel ON public.core_order (channel);

-- -------------------------------------------------------------------------
-- 4. Customer Touchpoints & Interaction History
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_customerinteraction (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES public.core_customer(id) ON DELETE CASCADE,
    interaction_type VARCHAR(30) DEFAULT 'Store Visit',
    summary VARCHAR(200) NOT NULL,
    details TEXT DEFAULT '',
    agent_name VARCHAR(100) DEFAULT 'Retail Associate',
    date TIMESTAMPTZ DEFAULT NOW(),
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE
);

CREATE INDEX IF NOT EXISTS idx_interaction_cust ON public.core_customerinteraction (customer_id);

-- -------------------------------------------------------------------------
-- 5. Loyalty Points Ledger
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_loyaltytransaction (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES public.core_customer(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) DEFAULT 'Earned',
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. Support Tickets & Service Desk
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_supportticket (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id BIGINT REFERENCES public.core_customer(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(40) DEFAULT 'General Inquiry',
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(30) DEFAULT 'Open',
    assigned_to VARCHAR(100) DEFAULT 'Retail Support Team',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. Marketing Campaigns
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.core_marketingcampaign (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    channel VARCHAR(20) DEFAULT 'Email',
    target_tier VARCHAR(20) DEFAULT 'All',
    status VARCHAR(20) DEFAULT 'Draft',
    discount_code VARCHAR(50) DEFAULT '',
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- Row-Level Security (RLS) - Optional for direct Supabase anon access
-- -------------------------------------------------------------------------
ALTER TABLE public.core_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_deal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_customerinteraction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_loyaltytransaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_supportticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_marketingcampaign ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and service role full access
CREATE POLICY "Allow service role full access on customers" ON public.core_customer
    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow read access for authenticated users on customers" ON public.core_customer
    FOR SELECT TO authenticated USING (true);
