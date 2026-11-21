# MaximizeCRM - RetailMax CRM: Complete Project Documentation
> **Streamlining Customer Relationships for Modern Omnichannel Retail**

---

## 1. Executive Summary

**RetailMax CRM** is a modern, enterprise-grade Customer Relationship Management (CRM) platform engineered specifically for omnichannel retail brands. Retail businesses face unique challenges bridging the gap between in-store boutique purchases (POS), e-commerce web storefronts, and mobile applications. RetailMax CRM addresses this by centralizing customer profiles, tracking Customer Lifetime Value (CLV), orchestrating VIP loyalty rewards, managing high-value clienteling sales pipelines, and resolving customer support inquiries under a single, unified interface.

### Key Value Propositions
- **360-Degree Customer Insight**: Real-time view of customer spend, preferred channels, recent orders, and personal stylist notes.
- **Omnichannel Unification**: Syncs brick-and-mortar boutique POS transactions with web and mobile orders.
- **Gamified VIP Loyalty**: Dynamic tier upgrades (Bronze, Silver, Gold, Platinum Elite) with automated point accrual and redemption simulation.
- **Clienteling Sales Kanban**: Interactive pipeline for bespoke orders, personal shopping sessions, and corporate bulk gifting.
- **Rapid Incident Management**: Retail service desk for returns, sizing exchanges, and loyalty adjustments.

---

## 2. Architecture & Technology Stack

The project follows a decoupled, three-tier architecture ensuring scalability, maintainability, and rapid feature iteration.

```
                      ┌──────────────────────────────────────────────┐
                      │   React 18 + Vite + Tailwind CSS Frontend    │
                      │      (Port 5173 - Live or Standalone)        │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTP / REST & CORS
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │      Django 5 + Django REST Framework        │
                      │           (Port 8000 API Engine)             │
                      └──────────────────────┬───────────────────────┘
                                             │ Connection Pooler / SSL Mode
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Supabase PostgreSQL Database         │
                      │  (db.bywidhuibkjsvhwxekao.supabase.co:5432)  │
                      └──────────────────────────────────────────────┘
```

### Layer Specifications

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 18.2.0 | Reactive component-based UI |
| **Build Tool** | Vite | 5.1.6 | Fast Hot Module Replacement (HMR) & bundling |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first responsive styling with custom theme |
| **Icons** | Lucide React | 0.344.0 | Lightweight, clean retail & UI icons |
| **Backend Framework** | Django | 5.2.x | High-level Python web framework |
| **API Toolkit** | Django REST Framework | 3.18.x | RESTful API serialization, routers, and ViewSets |
| **Database Driver** | Psycopg 3 | 3.3.9 | High-performance asynchronous/synchronous PostgreSQL adapter |
| **Cloud Database** | Supabase (PostgreSQL) | PostgreSQL 15+ | Hosted relational database with Connection Pooling |

---

## 3. Database Schema & Data Models

The database models are implemented in Django ORM (`backend/core/models.py`) and mirrored in raw PostgreSQL with Row-Level Security (`backend/supabase_schema.sql`).

### 3.1 Customer (`core_customer`)
Stores comprehensive profile data for shoppers.
- `id` (BigSerial, Primary Key)
- `first_name` (CharField, 100): Customer first name.
- `last_name` (CharField, 100): Customer last name.
- `email` (EmailField, Unique): Primary contact identifier.
- `phone` (CharField, 30): Optional phone number.
- `avatar_url` (URLField, 500): Profile image link.
- `loyalty_tier` (CharField, 20): `Bronze`, `Silver`, `Gold`, `Platinum`.
- `loyalty_points` (IntegerField): Current reward points balance.
- `total_spend` (DecimalField, 12, 2): Cumulative Customer Lifetime Value (CLV).
- `preferred_channel` (CharField, 30): `In-Store`, `Online`, `Mobile App`, `Phone`.
- `status` (CharField, 20): `Active`, `VIP`, `At-Risk`, `Lead`, `Inactive`.
- `address`, `city`, `state`, `postal_code`, `country`: Physical location fields.
- `tags` (JSONField): Array of tags (e.g., `["VIP", "Frequent Buyer", "Weekend Shopper"]`).
- `notes` (TextField): Stylist observations and preferences.
- `created_at`, `updated_at` (DateTimeField): Timestamps.

### 3.2 Deal / Opportunity (`core_deal`)
Tracks clienteling opportunities, bespoke tailoring, and corporate bulk gifting.
- `id` (BigSerial, Primary Key)
- `title` (CharField, 200): Opportunity summary.
- `customer_id` (ForeignKey &rarr; `core_customer`): Client link.
- `value` (DecimalField, 12, 2): Deal projected revenue.
- `stage` (CharField, 30): `Lead`, `Contacted`, `Qualified`, `Proposal`, `Won`, `Lost`.
- `probability` (IntegerField): Win probability percentage (0-100%).
- `expected_close_date` (DateField): Target completion date.
- `assigned_agent` (CharField, 100): Assigned stylist or account manager.
- `priority` (CharField, 20): `Low`, `Medium`, `High`.
- `notes` (TextField): Deal specific notes.

### 3.3 Order (`core_order`)
Records omnichannel transactions across retail touchpoints.
- `id` (BigSerial, Primary Key)
- `order_number` (CharField, 50, Unique): Invoice reference (e.g., `RMX-9041`).
- `customer_id` (ForeignKey &rarr; `core_customer`): Purchasing customer.
- `channel` (CharField, 30): `In-Store POS`, `Online Store`, `Mobile App`.
- `store_location` (CharField, 100): Origin boutique or fulfillment center.
- `total_amount` (DecimalField, 12, 2): Gross transaction value.
- `tax_amount`, `discount_amount` (DecimalField): Financial breakdown.
- `status` (CharField, 20): `Completed`, `Processing`, `Shipped`, `Returned`, `Cancelled`.
- `payment_method` (CharField, 50): Payment type (e.g., Credit Card, Apple Pay).
- `items_count` (IntegerField): Number of units.
- `items_detail` (JSONField): Array of item objects (`name`, `sku`, `qty`, `price`).

### 3.4 CustomerInteraction (`core_customerinteraction`)
Historical touchpoint log.
- `customer_id` (ForeignKey &rarr; `core_customer`)
- `interaction_type` (CharField, 30): `Store Visit`, `Phone Call`, `Email`, `Live Chat`, `Support Ticket`.
- `summary` (CharField, 200)
- `details` (TextField)
- `agent_name` (CharField, 100)
- `date` (DateTimeField)
- `follow_up_required` (BooleanField)
- `follow_up_date` (DateField, Nullable)

### 3.5 LoyaltyTransaction (`core_loyaltytransaction`)
Ledger of points earned, redeemed, or adjusted.
- `customer_id` (ForeignKey &rarr; `core_customer`)
- `transaction_type` (CharField, 20): `Earned`, `Redeemed`, `Bonus`, `Adjusted`.
- `points` (IntegerField): Delta points (+ or -).
- `reason` (CharField, 255)
- `created_at` (DateTimeField)

### 3.6 SupportTicket (`core_supportticket`)
Customer service complaint and exchange cases.
- `ticket_number` (CharField, 50, Unique): e.g., `TCK-1081`.
- `customer_id` (ForeignKey &rarr; `core_customer`)
- `subject` (CharField, 200)
- `description` (TextField)
- `category` (CharField, 40): `Order Issue`, `Return & Refund`, `Product Defect`, `Loyalty Points`, `General Inquiry`.
- `priority` (CharField, 20): `Low`, `Medium`, `High`, `Urgent`.
- `status` (CharField, 30): `Open`, `In Progress`, `Waiting Customer`, `Resolved`, `Closed`.
- `assigned_to` (CharField, 100)

### 3.7 MarketingCampaign (`core_marketingcampaign`)
Targeted promotional broadcasts.
- `name` (CharField, 200)
- `channel` (CharField, 20): `Email`, `SMS`, `Push`.
- `target_tier` (CharField, 20): `All`, `Bronze`, `Silver`, `Gold`, `Platinum`.
- `status` (CharField, 20): `Draft`, `Scheduled`, `Active`, `Completed`.
- `discount_code` (CharField, 50): Coupon code.
- `sent_count`, `opened_count`, `conversion_count` (IntegerField)

---

## 4. RESTful API Specification

Base URL: `http://localhost:8000/api/`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health/` | Diagnostic health check and Supabase connectivity status. |
| `GET` | `/dashboard/stats/` | Consolidated KPIs, omnichannel revenue split, and pipeline totals. |
| `GET` | `/customers/` | List customers with optional `?search=`, `?tier=`, and `?status=` filters. |
| `POST` | `/customers/` | Create a new customer profile. |
| `GET` | `/customers/{id}/` | 360° detail view with nested orders, touchpoints, and loyalty transactions. |
| `POST` | `/customers/{id}/adjust-loyalty/` | Add or deduct loyalty points with automated tier recalculation. |
| `GET` | `/deals/` | List sales opportunities with optional `?stage=` and `?priority=`. |
| `POST` | `/deals/` | Create a new clienteling deal. |
| `PATCH` | `/deals/{id}/` | Update deal stage or probability. |
| `GET` | `/orders/` | List retail orders with `?channel=` and `?status=` filtering. |
| `POST` | `/orders/` | Record new in-store or online order. |
| `GET` | `/tickets/` | List support cases with `?status=` and `?priority=`. |
| `PATCH` | `/tickets/{id}/` | Update ticket status (e.g., mark as `Resolved`). |
| `POST` | `/tickets/` | Open a new support ticket. |
| `GET` | `/campaigns/` | List marketing campaigns with analytics. |
| `POST` | `/campaigns/` | Launch or schedule a promotion. |
| `POST` | `/seed-data/` | Populate realistic demo dataset into the database. |

---

## 5. Frontend Modules & User Workflows

1. **Executive Dashboard (`DashboardView.jsx`)**:
   - 4 Top KPI cards (Total Customers, Total Sales Volume, Active Deals Pipeline, Open Tickets).
   - Omnichannel sales progress bar (In-Store POS vs Web vs App).
   - VIP Loyalty Club distribution widget.
   - Live activity stream of recent purchases and interactions.
2. **Customer 360° Directory (`CustomersView.jsx` & `CustomerDetailDrawer.jsx`)**:
   - Multi-tier filtering (`Platinum`, `Gold`, `Silver`, `Bronze`) and status badges (`VIP`, `At-Risk`).
   - Slide-out drawer with tabbed order receipts, associate notes, and quick point adjustment actions (+100, +250, +500 pts).
3. **Sales Pipeline & Clienteling Kanban (`DealsPipelineView.jsx`)**:
   - 6 stage columns: *Lead &rarr; Contacted &rarr; Qualified &rarr; Proposal &rarr; Won &rarr; Lost*.
   - One-click deal stage progression.
4. **Omnichannel Orders (`OrdersView.jsx`)**:
   - Channel filter tabs.
   - Modal receipt viewer displaying line items, quantities, subtotal, and tax.
5. **VIP Loyalty & Rewards Engine (`LoyaltyView.jsx`)**:
   - Breakdown of perks for each tier.
   - Interactive points redemption simulator with rewards catalog.
6. **Customer Service Help Desk (`TicketsView.jsx`)**:
   - Priority-based ticketing system with one-click resolution.
7. **Marketing Campaigns (`CampaignsView.jsx`)**:
   - Promotion scheduler for Email, SMS, and App Push broadcasts with open rate and conversion counters.
8. **Settings & Diagnostics (`SettingsView.jsx`)**:
   - Live database health test, Supabase configuration guide, and one-click JSON export.

---

## 6. Execution & Setup Instructions

### Backend (Django + Supabase)
```powershell
cd "C:\Users\PANKAJ GUPTA\Desktop\retailmax-crm\backend"
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py makemigrations core
python manage.py migrate
python manage.py seed_retail_data
python manage.py runserver 8000
```

### Frontend (React + Vite)
```powershell
cd "C:\Users\PANKAJ GUPTA\Desktop\retailmax-crm\frontend"
npm install
npm run dev
```

---

## 7. Deployment Guide

### Frontend Deployment (Vercel)
1. Push project to GitHub.
2. Link repository to [Vercel](https://vercel.com).
3. Set root directory to `frontend`.
4. Build command: `npm run build`, Output directory: `dist`.

### Backend Deployment (Render / Railway)
1. Link repository to [Render](https://render.com).
2. Set root directory to `backend`.
3. Set environment variables from `backend/.env` (`DATABASE_URL`, `SECRET_KEY`, `ALLOWED_HOSTS`).
4. Start command: `gunicorn retailmax.wsgi:application`.

---
*Documentation prepared for RetailMax CRM Enterprise.*
