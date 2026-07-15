/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Customer, OrderItem, WidgetConfig } from "./types";

export const initialProducts: Product[] = [
  { id: "p1", name: "Biled Shorts", sales: 127, revenue: 1890, stock: 120, status: "In Stock" },
  { id: "p2", name: "T Shirts_Mixi", sales: 540, revenue: 2889, stock: 100, status: "Out of stock" },
  { id: "p3", name: "Premium Cosmetics Kit", sales: 310, revenue: 8450, stock: 45, status: "In Stock" },
  { id: "p4", name: "Housewest Classic Pot", sales: 185, revenue: 4200, stock: 80, status: "In Stock" },
  { id: "p5", name: "Aesthetic Room Lamp", sales: 420, revenue: 6300, stock: 15, status: "In Stock" },
  { id: "p6", name: "Nordic Linen Pillow", sales: 95, revenue: 1140, stock: 200, status: "In Stock" },
  { id: "p7", name: "Leather Travel Bag", sales: 62, revenue: 3720, stock: 0, status: "Out of stock" },
];

export const initialCustomers: Customer[] = [
  { id: "c1", name: "Ikhsan Kamal", email: "ikhsan.k@worksense.ai", salesCount: 14, totalSpent: 1250, status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80" },
  { id: "c2", name: "Sarah Connor", email: "sarah.c@terminator.com", salesCount: 22, totalSpent: 4890, status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80" },
  { id: "c3", name: "David Beckham", email: "david.b@galaxy.com", salesCount: 8, totalSpent: 2100, status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80" },
  { id: "c4", name: "Michael Jordan", email: "mj@bulls.com", salesCount: 45, totalSpent: 15800, status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&q=80" },
  { id: "c5", name: "Clara Oswald", email: "clara.o@tardis.org", salesCount: 5, totalSpent: 450, status: "Inactive", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop&q=80" },
];

export const initialOrders: OrderItem[] = [
  { id: "o1", productName: "Biled Shorts", customerName: "Ikhsan Kamal", date: "2026-07-14", amount: 1890, status: "Completed" },
  { id: "o2", productName: "T Shirts_Mixi", customerName: "Sarah Connor", date: "2026-07-13", amount: 2889, status: "Completed" },
  { id: "o3", productName: "Premium Cosmetics Kit", customerName: "David Beckham", date: "2026-07-12", amount: 8450, status: "Completed" },
  { id: "o4", productName: "Housewest Classic Pot", customerName: "Michael Jordan", date: "2026-07-10", amount: 4200, status: "Pending" },
  { id: "o5", productName: "Nordic Linen Pillow", customerName: "Clara Oswald", date: "2026-07-08", amount: 1140, status: "Cancelled" },
];

export const initialWidgets: WidgetConfig[] = [
  { id: "w_prod_overview", title: "Product Overview", visible: true, type: "product_overview", category: "Overview" },
  { id: "w_active_sales", title: "Active Sales", visible: true, type: "active_sales", category: "Overview" },
  { id: "w_prod_revenue", title: "Product Revenue", visible: true, type: "product_revenue", category: "Overview" },
  { id: "w_analytics_chart", title: "Analytics Trend", visible: true, type: "analytics", category: "Charts" },
  { id: "w_sales_perf", title: "Sales Performance Gauge", visible: true, type: "sales_perf", category: "Charts" },
  { id: "w_hourly_visits", title: "Total Hourly Visits", visible: true, type: "hourly_visits", category: "Charts" },
  { id: "w_top_products", title: "Top Products Listing", visible: true, type: "top_products", category: "Tables" }
];

export const monthlySalesData = {
  cosmetics: [
    { label: "JAN", value: 1200 },
    { label: "FEB", value: 1800 },
    { label: "MAR", value: 1400 },
    { label: "APR", value: 2100 },
    { label: "MAY", value: 4543 }, // Matches May -$4,5430 peak in the image
    { label: "JUN", value: 3100 },
    { label: "JUL", value: 2900 },
    { label: "AUG", value: 3800 },
  ],
  housewest: [
    { label: "JAN", value: 2500 },
    { label: "FEB", value: 2100 },
    { label: "MAR", value: 3200 },
    { label: "APR", value: 1900 },
    { label: "MAY", value: 3000 },
    { label: "JUN", value: 4200 },
    { label: "JUL", value: 3500 },
    { label: "AUG", value: 4100 },
  ]
};

export const heatmapData = [
  // TUESDAY
  { day: "MON", hour: 9, visits: 2400 },
  { day: "MON", hour: 10, visits: 3100 },
  { day: "MON", hour: 11, visits: 3880 }, // Highlighted BAM block
  { day: "MON", hour: 12, visits: 1900 },
  { day: "MON", hour: 13, visits: 2200 },
  { day: "MON", hour: 14, visits: 1500 },
  { day: "MON", hour: 15, visits: 1100 },
  // TUE
  { day: "TUE", hour: 9, visits: 1800 },
  { day: "TUE", hour: 10, visits: 2900 },
  { day: "TUE", hour: 11, visits: 3200 },
  { day: "TUE", hour: 12, visits: 3880 }, // Highlighted BAM block
  { day: "TUE", hour: 13, visits: 2100 },
  { day: "TUE", hour: 14, visits: 3100 },
  { day: "TUE", hour: 15, visits: 4100 }, // High orange
  // WED
  { day: "WED", hour: 9, visits: 1100 },
  { day: "WED", hour: 10, visits: 1500 },
  { day: "WED", hour: 11, visits: 2200 },
  { day: "WED", hour: 12, visits: 2900 },
  { day: "WED", hour: 13, visits: 4500 }, // Very high orange
  { day: "WED", hour: 14, visits: 3880 },
  { day: "WED", hour: 15, visits: 2300 },
];
