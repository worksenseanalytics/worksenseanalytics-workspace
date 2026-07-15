/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Customer } from "../../types";
import { Search, Mail, Phone, SlidersHorizontal, ToggleLeft, ToggleRight, Users } from "lucide-react";

interface CustomersViewProps {
  customers: Customer[];
  onToggleCustomerStatus: (id: string) => void;
}

export default function CustomersView({ customers, onToggleCustomerStatus }: CustomersViewProps) {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="content font-sans">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Audience & Users</div>
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">Review user acquisition channels, metrics, and profiles</p>
        </div>
      </div>

      {/* Toolbar Panel */}
      <div className="panel" style={{ marginBottom: "16px" }}>
        <div className="toolbar">
          <div className="toolbar-left">
            <input 
              className="filter-input text-xs" 
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <button className="btn text-xs" onClick={() => alert("Filters clicked!")}>
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="panel panel-pad flex flex-col justify-between" style={{ minHeight: "220px" }}>
            
            {/* Top row with avatar and status */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div 
                  className="flex items-center justify-center font-bold text-xs border" 
                  style={{ 
                    width: "42px", 
                    height: "42px", 
                    borderRadius: "10px", 
                    background: cust.id.charCodeAt(0) % 5 === 0 ? "oklch(95% .03 140)" : 
                                cust.id.charCodeAt(0) % 5 === 1 ? "oklch(95% .03 200)" :
                                cust.id.charCodeAt(0) % 5 === 2 ? "oklch(95% .03 260)" :
                                cust.id.charCodeAt(0) % 5 === 3 ? "oklch(95% .03 320)" :
                                                                  "oklch(95% .03 20)",
                    color: cust.id.charCodeAt(0) % 5 === 0 ? "oklch(45% .15 140)" : 
                           cust.id.charCodeAt(0) % 5 === 1 ? "oklch(45% .15 200)" :
                           cust.id.charCodeAt(0) % 5 === 2 ? "oklch(45% .15 260)" :
                           cust.id.charCodeAt(0) % 5 === 3 ? "oklch(45% .15 320)" :
                                                             "oklch(45% .15 20)",
                    borderColor: cust.id.charCodeAt(0) % 5 === 0 ? "oklch(90% .05 140)" : 
                                 cust.id.charCodeAt(0) % 5 === 1 ? "oklch(90% .05 200)" :
                                 cust.id.charCodeAt(0) % 5 === 2 ? "oklch(90% .05 260)" :
                                 cust.id.charCodeAt(0) % 5 === 3 ? "oklch(90% .05 320)" :
                                                                   "oklch(90% .05 20)",
                  }}
                >
                  {cust.name.split(/\s+/).map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="section-title text-sm">{cust.name}</h3>
                  <p className="text-xs text-gray-400">{cust.email}</p>
                </div>
              </div>
              
              <button 
                onClick={() => onToggleCustomerStatus(cust.id)}
                className={`status ${cust.status === "Inactive" ? "out" : ""}`}
                style={{ cursor: "pointer" }}
              >
                {cust.status}
              </button>
            </div>

            {/* Metrics block */}
            <div className="divider" style={{ margin: "12px 0" }}></div>
            
            <div className="grid grid-cols-2 text-center" style={{ gap: "8px" }}>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Orders</div>
                <div className="text-sm font-bold mt-1">{cust.salesCount} purchases</div>
              </div>
              <div style={{ borderLeft: "1px solid var(--line)" }}>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Total Spent</div>
                <div className="text-sm font-bold mt-1">${cust.totalSpent.toLocaleString()}</div>
              </div>
            </div>

            <div className="divider" style={{ margin: "12px 0" }}></div>

            {/* Actions block */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  className="btn" 
                  style={{ width: "32px", height: "32px", padding: 0, borderRadius: "6px" }}
                  onClick={() => alert(`Emailing ${cust.email}...`)}
                >
                  <Mail size={12} />
                </button>
                <button 
                  className="btn" 
                  style={{ width: "32px", height: "32px", padding: 0, borderRadius: "6px" }}
                  onClick={() => alert(`Calling ${cust.name}...`)}
                >
                  <Phone size={12} />
                </button>
              </div>

              {/* Status toggle slider */}
              <button 
                onClick={() => onToggleCustomerStatus(cust.id)}
                style={{ color: cust.status === "Active" ? "var(--accent)" : "oklch(80% .01 258)", cursor: "pointer" }}
              >
                {cust.status === "Active" ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="panel empty" style={{ gridColumn: "1 / -1" }}>
            <Users size={32} className="mx-auto mb-2 text-gray-300" />
            No customers matched your search query.
          </div>
        )}
      </div>
    </section>
  );
}
