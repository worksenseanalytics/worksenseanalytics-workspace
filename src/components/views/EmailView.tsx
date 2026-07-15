/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Plus, SlidersHorizontal, ChevronDown, ChevronRight, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Campaign {
  id: string;
  name: string;
  dateInfo: string;
  metric: string;
  status: "Sent" | "Draft";
}

export default function EmailView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Sent" | "Draft">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial campaign data matching veselty-workspace-complete.html exactly
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "c1",
      name: "July product launch",
      dateInfo: "Sent Jul 12, 2026",
      metric: "42.8% open rate",
      status: "Sent",
    },
    {
      id: "c2",
      name: "VIP early access",
      dateInfo: "Sent Jul 09, 2026",
      metric: "56.1% open rate",
      status: "Sent",
    },
    {
      id: "c3",
      name: "Cart recovery sequence",
      dateInfo: "Updated Jul 08, 2026",
      metric: "Draft campaign",
      status: "Draft",
    }
  ]);

  // Modal form states
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignStatus, setNewCampaignStatus] = useState<"Sent" | "Draft">("Draft");
  const [newCampaignMetric, setNewCampaignMetric] = useState("");

  const handleAddCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    const today = new Date();
    const formattedDate = `${newCampaignStatus === "Sent" ? "Sent" : "Updated"} ${today.toLocaleString("en-US", { month: "short" })} ${String(today.getDate()).padStart(2, "0")}, ${today.getFullYear()}`;

    const newCampaign: Campaign = {
      id: `c_${Date.now()}`,
      name: newCampaignName,
      dateInfo: formattedDate,
      metric: newCampaignMetric.trim() || (newCampaignStatus === "Sent" ? "0.0% open rate" : "Draft campaign"),
      status: newCampaignStatus,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setShowAddModal(false);
    setNewCampaignName("");
    setNewCampaignStatus("Draft");
    setNewCampaignMetric("");
  };

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.metric.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats dynamically
  const sentCount = campaigns.filter(c => c.status === "Sent").length;
  const draftCount = campaigns.filter(c => c.status === "Draft").length;

  return (
    <section className="content font-sans">
      {/* Page Heading matching markup */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Email</h1>
          <p className="page-sub">Plan campaigns and monitor message performance</p>
        </div>
        <div className="heading-actions">
          <button className="btn dark" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            New campaign
          </button>
        </div>
      </div>

      {/* Stat Strip matching design */}
      <div className="stat-strip">
        <div className="panel stat">
          <div className="stat-label">Open rate</div>
          <div className="stat-value">
            42.8% <span className="trend up" style={{ color: "var(--green)" }}>+6%</span>
          </div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Click rate</div>
          <div className="stat-value">8.4%</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Subscribers</div>
          <div className="stat-value">24,830</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Unsubscribed</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>0.7%</div>
        </div>
      </div>

      {/* Main Panel with Campaign list */}
      <div className="panel">
        <div className="toolbar">
          <div className="toolbar-left">
            <input 
              className="filter-input text-xs" 
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            
            <div className="relative inline-block">
              <select
                className="select filter-input text-xs appearance-none pr-8"
                style={{ height: "38px", minWidth: "120px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All status</option>
                <option value="Sent">Sent</option>
                <option value="Draft">Draft</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          <div className="toolbar-right">
            <button className="btn text-xs" onClick={() => alert("Filters clicked!")}>
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>
        </div>

        {/* Campaign List */}
        <div className="list">
          {filteredCampaigns.map((camp) => (
            <div key={camp.id} className="list-row flex items-center justify-between p-4 border-b border-[var(--line)] last:border-0 hover:bg-[var(--canvas)] transition-colors duration-150">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="product-thumb shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-soft)] text-[var(--accent-deep)]">
                  <Mail size={16} />
                </div>
                <div className="list-main min-w-0">
                  <div className="list-title font-semibold truncate text-sm">{camp.name}</div>
                  <div className="list-meta text-xs text-gray-400 mt-1">
                    {camp.dateInfo} · {camp.metric}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`status ${camp.status === "Draft" ? "out" : ""}`}>
                  {camp.status}
                </span>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
              </div>
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-xs">
              No email campaigns found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Add New Campaign Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="panel panel-pad relative z-10 w-full max-w-md"
              id="add-campaign-modal"
            >
              <div className="panel-head flex justify-between items-center mb-4">
                <div className="section-title flex items-center gap-2 font-bold text-base">
                  <Mail size={18} className="text-[var(--accent)]" />
                  <span>Create Campaign</span>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="more flex items-center justify-center border border-gray-200 rounded-lg"
                  style={{ width: "28px", height: "28px" }}
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAddCampaign} className="space-y-4">
                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="e.g. VIP Early Summer Access"
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>

                <div className="form-grid grid grid-cols-2 gap-3">
                  <div className="field">
                    <label className="text-xs font-semibold block mb-1">Initial Status</label>
                    <select
                      value={newCampaignStatus}
                      onChange={(e) => setNewCampaignStatus(e.target.value as any)}
                      className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="text-xs font-semibold block mb-1">Metric Description</label>
                    <input
                      type="text"
                      value={newCampaignMetric}
                      onChange={(e) => setNewCampaignMetric(e.target.value)}
                      placeholder={newCampaignStatus === "Sent" ? "e.g. 45.2% open rate" : "e.g. Draft campaign"}
                      className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                    />
                  </div>
                </div>

                <div className="form-footer flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn px-4 py-2 text-xs border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn dark px-4 py-2 text-xs bg-[var(--ink)] text-[var(--surface)] rounded-lg"
                  >
                    Create Campaign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
