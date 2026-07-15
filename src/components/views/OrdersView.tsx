/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { OrderItem } from "../../types";
import { SlidersHorizontal, ShoppingBag, Eye, Check, Clock, XCircle, ChevronDown, Download } from "lucide-react";

interface OrdersViewProps {
  orders: OrderItem[];
  onUpdateOrderStatus: (id: string, status: "Completed" | "Pending" | "Cancelled") => void;
}

export default function OrdersView({ orders, onUpdateOrderStatus }: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending" | "Cancelled">("All");

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.productName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const totalOrders = orders.length;
  const completedRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Product Name", "Purchase Date", "Amount", "Fulfillment"];
    const rows = orders.map(o => [o.id, o.customerName, o.productName, o.date, o.amount, o.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "worksense_orders_registry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content font-sans">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Fulfillment & Billing</div>
          <h1 className="page-title">Orders</h1>
          <p className="page-sub">Track purchase invoices, fulfillment state, and payouts</p>
        </div>
        <div className="heading-actions">
          <button className="btn dark" onClick={handleExportCSV}>
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="stat-strip">
        <div className="panel stat">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{totalOrders} items</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${completedRevenue.toLocaleString()}</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Pending Orders</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{pendingCount} items</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Cancelled Orders</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>{cancelledCount} items</div>
        </div>
      </div>

      {/* Main Panel with Toolbar and Table */}
      <div className="panel">
        <div className="toolbar">
          <div className="toolbar-left">
            <input 
              className="filter-input text-xs" 
              placeholder="Filter orders or clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            {/* Filter buttons styled like mockup */}
            <div className="flex gap-1" style={{ background: "var(--canvas)", padding: "3px", borderRadius: "8px" }}>
              {(["All", "Completed", "Pending", "Cancelled"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className="btn"
                  style={{
                    height: "30px",
                    padding: "0 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    background: filter === tab ? "var(--surface)" : "transparent",
                    borderColor: filter === tab ? "var(--line)" : "transparent",
                    boxShadow: filter === tab ? "var(--shadow)" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="toolbar-right">
            <button className="btn text-xs" onClick={() => alert("Sorting opened!")}>
              <SlidersHorizontal size={13} />
              Sort
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product Name</th>
                <th>Purchase Date</th>
                <th>Amount</th>
                <th>Fulfillment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td><b>#{ord.id}</b></td>
                  <td>
                    <span className="font-semibold">{ord.customerName}</span>
                  </td>
                  <td>{ord.productName}</td>
                  <td>{ord.date}</td>
                  <td><b>${ord.amount.toLocaleString()}</b></td>
                  <td>
                    <span className={`status ${
                      ord.status === "Pending" ? "out" : 
                      ord.status === "Cancelled" ? "out" : ""
                    }`} style={{ 
                      color: ord.status === "Completed" ? "oklch(43% .12 157)" : 
                             ord.status === "Pending" ? "oklch(60% .15 70)" : 
                             "oklch(46% .14 24)",
                      background: ord.status === "Completed" ? "var(--green-soft)" : 
                                  ord.status === "Pending" ? "oklch(96% .04 70)" : 
                                  "var(--red-soft)"
                    }}>
                      {ord.status}
                    </span>
                  </td>
                  <td>
                    <div className="relative inline-block text-left">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="select text-xs"
                        style={{ height: "30px", paddingRight: "24px" }}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    No orders found under this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
