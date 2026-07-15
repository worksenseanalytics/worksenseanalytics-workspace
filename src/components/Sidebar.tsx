/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Gauge, 
  Box, 
  ShoppingBag, 
  Users, 
  MessageCircle, 
  Mail, 
  PieChart, 
  GitMerge, 
  ChartNoAxesCombined, 
  UserRound, 
  UsersRound, 
  Settings, 
  MessageSquare, 
  LogOut, 
  ChevronsLeft, 
  ChevronsRight
} from "lucide-react";
import { ActiveView } from "../types";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  unreadChatCount?: number;
}

export default function Sidebar({ activeView, setActiveView, unreadChatCount = 22 }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Render sidebar classes
  const sidebarStyles = isCollapsed
    ? "sidebar collapsed" // Custom adjustments can go here, or we can use the same styles
    : "sidebar";

  return (
    <aside 
      className={sidebarStyles} 
      style={{ 
        width: isCollapsed ? "80px" : "240px", 
        transition: "width 0.2s var(--ease)",
        overflowY: "auto",
        scrollbarWidth: "none"
      }}
      id="app-sidebar"
    >
      {/* Brand Header */}
      <div className="brand" style={{ padding: isCollapsed ? "8px 5px" : "8px 10px", width: "211.333px" }}>
        <div 
          className="brand-logo" 
          style={{ 
            width: isCollapsed ? "34px" : "44px", 
            height: isCollapsed ? "34px" : "44px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: logoError ? "var(--ink)" : "transparent"
          }}
        >
          {!logoError ? (
            <img 
              src="/worksense_logo.png" 
              alt="Worksense logo" 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-contain rounded-[10px]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span 
              className="fallback-symbol" 
              style={{ 
                color: "var(--surface)", 
                fontSize: isCollapsed ? "18px" : "22px",
                fontWeight: "bold"
              }}
            >
              ◆
            </span>
          )}
        </div>
        {!isCollapsed && (
          <div className="brand-copy">
            <div className="brand-name" style={{ fontSize: "14px", width: "139.99px", marginLeft: "-3px" }}>Worksense Analytics.</div>
            <div className="brand-plan" style={{ fontSize: "11px", marginLeft: "-3px" }}>Workspace</div>
          </div>
        )}
        <button className="collapse" aria-label="Collapse sidebar" onClick={handleToggleCollapse}>
          {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {/* Main Menu Section */}
      <nav className="nav-section">
        {!isCollapsed && <div className="nav-label">Main menu</div>}
        <button 
          className={`nav-item ${activeView === ActiveView.Dashboard ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Dashboard)}
        >
          <Gauge size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Products ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Products)}
        >
          <Box size={18} />
          {!isCollapsed && <span>Products</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Order ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Order)}
        >
          <ShoppingBag size={18} />
          {!isCollapsed && <span>Order</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Customers ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Customers)}
        >
          <Users size={18} />
          {!isCollapsed && <span>Customers</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Chat ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Chat)}
        >
          <MessageCircle size={18} />
          {!isCollapsed && <span>Chat</span>}
          {unreadChatCount > 0 && <b className="badge">{unreadChatCount}</b>}
        </button>
      </nav>

      <div className="divider"></div>

      {/* Other Section */}
      <nav className="nav-section">
        {!isCollapsed && <div className="nav-label">Other</div>}
        <button 
          className={`nav-item ${activeView === ActiveView.Email ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Email)}
        >
          <Mail size={18} />
          {!isCollapsed && <span>Email</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Analytics ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Analytics)}
        >
          <PieChart size={18} />
          {!isCollapsed && <span>Analytics</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Integration ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Integration)}
        >
          <GitMerge size={18} />
          {!isCollapsed && <span>Integration</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Performance ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Performance)}
        >
          <ChartNoAxesCombined size={18} />
          {!isCollapsed && <span>Performance</span>}
        </button>
      </nav>

      <div className="divider"></div>

      {/* Account Section */}
      <nav className="nav-section">
        {!isCollapsed && <div className="nav-label">Account</div>}
        <button 
          className={`nav-item ${activeView === ActiveView.Account ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Account)}
        >
          <UserRound size={18} />
          {!isCollapsed && <span>Account</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Members ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Members)}
        >
          <UsersRound size={18} />
          {!isCollapsed && <span>Members</span>}
        </button>
      </nav>

      <div className="grow"></div>

      {/* Bottom Section */}
      <nav className="nav-section">
        <button 
          className={`nav-item ${activeView === ActiveView.Settings ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Settings)}
        >
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button 
          className={`nav-item ${activeView === ActiveView.Feedback ? "active" : ""}`} 
          onClick={() => setActiveView(ActiveView.Feedback)}
        >
          <MessageSquare size={18} />
          {!isCollapsed && <span>Feedback</span>}
        </button>
      </nav>

      {/* User Profile Card */}
      <div className="profile" style={{ padding: isCollapsed ? "6px 5px" : "8px" }}>
        <div className="avatar">IK</div>
        {!isCollapsed && (
          <div className="profile-copy">
            <div className="profile-name">Ikhsan Kamal</div>
            <div className="profile-role">Admin</div>
          </div>
        )}
        {!isCollapsed && (
          <LogOut size={17} style={{ color: "oklch(59% .22 43)", cursor: "pointer" }} />
        )}
      </div>
    </aside>
  );
}
