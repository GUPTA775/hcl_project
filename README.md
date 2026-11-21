# MaximizeCRM - RetailMax CRM
> **Streamlining Customer Relationships for Modern Omnichannel Retail**

RetailMax CRM is an end-to-end, enterprise-ready Customer Relationship Management platform engineered specifically for retail businesses operating across physical boutique registers (In-Store POS), e-commerce web storefronts, and mobile applications.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite + Tailwind CSS** | Sleek, responsive, high-performance UI with Lucide icons, Customer 360° drawer, Sales Kanban, and real-time API client. |
| **Backend** | **Python & Django 5 + Django REST Framework** | Robust RESTful API engine with ORM models, filters, aggregations, management commands, and CORS integration. |
| **Database** | **Supabase (PostgreSQL)** | Cloud PostgreSQL database with connection pooling, Row Level Security (RLS), and automated migrations. |

---

## 🌟 Key Features

1. **Customer 360° Profile & Directory**:
   - Omnichannel customer profiles with complete Customer Lifetime Value (CLV).
   - Loyalty tier tracking (Bronze, Silver, Gold VIP, Platinum Elite) and points balance.
   - Slide-out Customer 360° drawer with tabbed order receipts, associate notes, and interaction history.
   - Direct points issue / redemption actions with automatic tier upgrading.

2. **Sales Pipeline & Clienteling Kanban**:
   - Visual stage-by-stage Kanban board (Lead &rarr; Contacted &rarr; Qualified &rarr; Proposal &rarr; Won &rarr; Lost).
   - Total pipeline valuation, probability forecasting, and stylist assignment.
   - One-click deal stage progression.

3. **Omnichannel Retail Orders & POS**:
   - Real-time transaction feed unified across In-Store POS, Web, and Mobile App.
   - Order receipt breakdown with SKU itemization, tax, discounts, and payment methods.

4. **Loyalty & VIP Rewards Club**:
   - Configurable tier thresholds and perks.
   - Rewards catalog with points redemption simulator.

5. **Customer Service & Help Desk**:
   - Support tickets with priority flags (Urgent, High, Medium, Low) and categories (Returns, Order Issues, Loyalty balance).
   - Instant resolution status updater.

6. **Targeted Campaigns & Promotions**:
   - Promotional broadcast launcher across Email, SMS, and Mobile Push.
   - Tier targeting and coupon code generator with open rate & conversion analytics.

7. **Supabase & Django Diagnostic Hub**:
   - Real-time backend API connection status pill.
   - Built-in demo data seeder command.
   - One-click customer JSON export.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python**: 3.10+ (Python 3.14 supported)
- **Node.js**: v18+ (Node v20.20+ supported) and `npm`

---

### 2. Backend Setup (Django + Supabase)

1. Open a terminal in the `backend` directory:
   ```bash
   cd "C:\Users\PANKAJ GUPTA\.gemini\antigravity\scratch\retailmax-crm\backend"
   ```

2. Activate virtual environment (already initialized):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Supabase in `.env`:
   Open `backend/.env` and paste your Supabase PostgreSQL connection string:
   ```env
   DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   ```
   *(Note: If `DATABASE_URL` is omitted, Django automatically uses local SQLite for instant offline testing!)*

5. Run migrations & seed demo retail ecosystem:
   ```bash
   python manage.py makemigrations core
   python manage.py migrate
   python manage.py seed_retail_data
   ```

6. Start Django API server:
   ```bash
   python manage.py runserver 8000
   ```
   *The API will be live at `http://localhost:8000/api/`*

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd "C:\Users\PANKAJ GUPTA\.gemini\antigravity\scratch\retailmax-crm\frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 📂 Project Directory Structure

```
retailmax-crm/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── .env
│   ├── supabase_schema.sql        # Full Supabase PostgreSQL schema with RLS & indexes
│   ├── retailmax/
│   │   ├── __init__.py
│   │   ├── settings.py           # Supabase connection & DRF / CORS config
│   │   ├── urls.py               # Root API endpoints
│   │   ├── wsgi.py
│   │   ├── asgi.py
│   │   └── supabase_client.py    # Supabase Python SDK helper
│   └── core/
│       ├── models.py             # Customer, Deal, Order, Loyalty, Ticket, Campaign
│       ├── serializers.py        # 360 Customer serializer & nested relations
│       ├── views.py              # ViewSets, KPIs, and demo seeder
│       ├── urls.py               # Router and dashboard endpoints
│       ├── admin.py              # Customized Django admin interface
│       └── management/
│           └── commands/
│               └── seed_retail_data.py # Realistic retail demo dataset
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── index.css
│       ├── main.jsx
│       ├── App.jsx               # Main state orchestrator
│       ├── mockData.js           # Interactive fallback dataset
│       ├── services/
│       │   └── api.js            # Unified Django API client
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── CustomerDetailDrawer.jsx
│       │   ├── AddCustomerModal.jsx
│       │   ├── AddOrderModal.jsx
│       │   └── AddDealModal.jsx
│       └── views/
│           ├── DashboardView.jsx
│           ├── CustomersView.jsx
│           ├── DealsPipelineView.jsx
│           ├── OrdersView.jsx
│           ├── LoyaltyView.jsx
│           ├── TicketsView.jsx
│           ├── CampaignsView.jsx
│           └── SettingsView.jsx
└── README.md
```
