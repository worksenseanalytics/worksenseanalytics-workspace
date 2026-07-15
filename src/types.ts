/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveView {
  Dashboard = "Dashboard",
  Products = "Products",
  Order = "Order",
  Customers = "Customers",
  Chat = "Chat",
  Email = "Email",
  Analytics = "Analytics",
  Integration = "Integration",
  Performance = "Performance",
  Account = "Account",
  Members = "Members",
  Settings = "Settings",
  Feedback = "Feedback"
}

export interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  status: "In Stock" | "Out of stock";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  salesCount: number;
  totalSpent: number;
  status: "Active" | "Inactive";
  avatar: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  customerName: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Cancelled";
}

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  type: string;
  category: "Overview" | "Charts" | "Tables";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}
