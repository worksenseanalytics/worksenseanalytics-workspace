# Worksense Analytics

Worksense Analytics is a professional business intelligence and workspace operations platform. Built on modern React, Tailwind CSS, and TypeScript, it offers a single-page SaaS experience optimized for responsiveness, rich data visualization, and modularity.

---

## Project Overview

Worksense Analytics serves as an enterprise-grade dashboard that consolidates diverse workspace streams—ranging from revenue performance, order logs, product tracking, to customer relation channels and member collaboration tools—into a single unified cockpit.

### Business Value and Problems Solved

In modern business environments, organizations suffer from data fragmentation. Operational data is often scattered across distinct CRM, ERP, and communication tools. This creates significant overhead, slows down decision-making, and introduces data discrepancies.

Worksense Analytics solves these challenges through:
1. **Consolidated Operational Intelligence**: Unifies financial reports, customer feedback, inventory metrics, and internal communication (chats and emails) into a centralized, single-view dashboard. This minimizes context-switching and drives faster, data-backed operational decisions.
2. **Actionable Historical Analysis**: The dynamic Comparison Engine contrasts current performance against historical milestones (Year-over-Year progress). This enables executives to immediately isolate seasonal trends, measure growth sustainability, and adjust strategy dynamically.
3. **Optimized Team Collaboration**: By housing active team members, transactional logs, and communication channels (chat, email templates, and system notifications) in one workspace, teams can align quicker, delegate responsibilities, and resolve customer issues in real time.
4. **Data-Driven Inventory Management**: Helps managers optimize inventory turnovers by correlating sales trends directly with customer feedback and active purchase orders.

---

## Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-64748B?style=for-the-badge&logo=vite&logoColor=FFD62B)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-black?style=for-the-badge&logo=framer&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-orange?style=for-the-badge&logo=lucide&logoColor=white)

---

## Feature Highlights

### Interactive Performance Comparison Chart
* **Comparison Engine**: Visually compares current performance (This Year) against historic data (Last Year) using specialized solid and dashed bezier curves and precise gradients.
* **High Interactivity**: Features a state-driven dynamic coordinate system with responsive cursor tracking, interactive vertical guidelines, and custom overlay tooltips displaying absolute values, reference points, and real-time growth percentage calculations.
* **Fluid Timeframe Scale**: Supports instant dropdown switching between `This year`, `This month`, and `Last 30 days` with adaptive X/Y scaling.

### Stateful Notification Center
* **Notification Badge**: Integrated a pulse-animated badge showing current unread counts.
* **Stateful Feed**: Fully responsive dropdown listing dynamic system notifications.
* **Action Center**: Supports marking individual elements as read, bulk action "Mark all as read", dismissing individual items with interactive animations, and "Clear all" options.

### Unified Workspace Identity
* Preconfigured workspace identity mapped across Account Settings, Members Directory, Active Transaction Logs, and User Sidebar Card under **Ikhsan Kamal** (ikhsan.k@worksense.ai).

### Dynamic Vector Avatars
* Replaced external image dependencies in key listings with character-hash calculated deterministic vector avatars to maximize loading speed and maintain visual consistency.

---

## Project Directory Structure

```text
worksense-analytics/
├── src/
│   ├── main.tsx                  # Web application entrypoint
│   ├── App.tsx                   # Main React routing and state engine
│   ├── types.ts                  # Shared TypeScript interfaces & types
│   ├── mockData.ts               # Local preseeded datasets for the dashboard
│   ├── index.css                 # Global styles and Tailwind configuration
│   ├── components/
│   │   ├── Sidebar.tsx           # Collapsible main navigation system
│   │   ├── TopBar.tsx            # Navigation utility bar with Notifications & Invite modal
│   │   ├── dashboard/            # Subcomponents for the dashboard view
│   │   │   ├── ActiveSales.tsx
│   │   │   ├── AnalyticsAreaChart.tsx
│   │   │   ├── ProductOverview.tsx
│   │   │   ├── ProductRevenue.tsx
│   │   │   ├── SalesPerformance.tsx
│   │   │   └── TopProducts.tsx
│   │   ├── modals/               # Overlay screens
│   │   │   ├── AddWidgetModal.tsx
│   │   │   └── FiltersModal.tsx
│   │   └── views/                # Independent workspace views
│   │       ├── AccountView.tsx   # Default profile: Ikhsan Kamal
│   │       ├── AnalyticsView.tsx # Feature-rich Comparison Area Chart
│   │       ├── ChatView.tsx
│   │       ├── CustomersView.tsx # Letter-avatar customized customer index
│   │       ├── DashboardView.tsx
│   │       ├── EmailView.tsx
│   │       ├── FeedbackView.tsx
│   │       ├── MembersView.tsx
│   │       ├── OrdersView.tsx
│   │       ├── PerformanceView.tsx
│   │       ├── ProductsView.tsx
│   │       └── SettingsView.tsx
├── package.json                  # Dependencies and execution script config
├── tsconfig.json                 # TypeScript compiler rules
└── vite.config.ts                # Vite build and server configuration
```

---

## Getting Started

Follow the commands below to run or test the workspace locally:

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Development Server
Launch the local development environment:
```bash
npm run dev
```

### 3. Production Build
Compile static assets under the `dist/` directory:
```bash
npm run build
```

### 4. Verification
Validate types and run the linter:
```bash
npm run lint
```

---

## Core Developers

* **Ikhsan Kamal**
  * LinkedIn: [Ikhsan kamal](https://linkedin.com/in/Ikhsan-kamal)
  * Instagram: [@iamikhsank_](https://instagram.com/iamikhsank_)

* **Worksense Analytics**
  * LinkedIn: [Worksense Analytics](https://linkedin.com/company/worksense-analytics)
  * Instagram: [@worksense.analytics](https://instagram.com/worksense.analytics)
