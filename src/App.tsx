/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import DashboardView from "./components/views/DashboardView";
import ProductsView from "./components/views/ProductsView";
import OrdersView from "./components/views/OrdersView";
import CustomersView from "./components/views/CustomersView";
import ChatView from "./components/views/ChatView";
import SettingsView from "./components/views/SettingsView";
import FeedbackView from "./components/views/FeedbackView";
import MembersView from "./components/views/MembersView";
import EmailView from "./components/views/EmailView";
import AnalyticsView from "./components/views/AnalyticsView";
import PerformanceView from "./components/views/PerformanceView";
import AccountView from "./components/views/AccountView";
import AddWidgetModal from "./components/modals/AddWidgetModal";
import FiltersModal from "./components/modals/FiltersModal";

import { ActiveView, Product, Customer, OrderItem, WidgetConfig } from "./types";
import { 
  initialProducts, 
  initialCustomers, 
  initialOrders, 
  initialWidgets 
} from "./mockData";

export default function App() {
  // Global View Navigation State
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.Dashboard);

  // Database States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(initialWidgets);
  const [members, setMembers] = useState([
    { name: "Ikhsan Kamal", email: "ikhsan.k@worksense.ai", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80", role: "Owner" },
    { name: "Sarah Connor", email: "sarah.c@terminator.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80", role: "Editor" },
    { name: "David Beckham", email: "david.b@galaxy.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80", role: "Viewer" },
    { name: "Michael Jordan", email: "mj@bulls.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&q=80", role: "Editor" },
  ]);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("cosmetics");
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(22);
  const [dashboardFilters, setDashboardFilters] = useState({
    period: "This month",
    minSales: 0,
    productStatus: ["In Stock", "Out of stock"],
    orderStatus: ["Completed", "Pending", "Cancelled"],
  });
  
  // Custom Settings state
  const [businessName, setBusinessName] = useState("Worksense Analytics");
  const [username, setUsername] = useState("Ikhsan Kamal");
  const [userEmail, setUserEmail] = useState("ikhsan.k@worksense.ai");

  // State modification Handlers
  const handleAddProduct = (newProd: Omit<Product, "id">) => {
    const id = "p" + (products.length + 1);
    setProducts([...products, { id, ...newProd }]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (id: string, status: OrderItem["status"]) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => 
      c.id === id 
        ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } 
        : c
    ));
  };

  const handleToggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const handleInviteMember = (name: string, email: string) => {
    const newMember = {
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop&q=80`, // Elegant mock avatar
      role: "Editor"
    };
    setMembers([...members, newMember]);
  };

  // Real CSV Export mechanism
  const handleExportData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Type,ID,Name/Details,Sales/Amount,Revenue,Stock/Status\n";

    // Products table rows
    products.forEach(p => {
      csvContent += `Product,${p.id},"${p.name}",${p.sales},${p.revenue},${p.stock}\n`;
    });

    // Orders rows
    orders.forEach(o => {
      csvContent += `Order,${o.id},"${o.productName} (by ${o.customerName})",${o.amount},0,${o.status}\n`;
    });

    // Customers rows
    customers.forEach(c => {
      csvContent += `Customer,${c.id},"${c.name}",${c.salesCount},${c.totalSpent},${c.status}\n`;
    });

    // Trigger standard browser download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${businessName.toLowerCase().replace(/\s+/g, "_")}_analytics_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Switch content dynamically based on selected activeView state
  const renderActiveContent = () => {
    switch (activeView) {
      case ActiveView.Dashboard:
        return (
          <DashboardView
            widgets={widgets}
            products={products}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filters={dashboardFilters}
            onFilterClick={() => setIsFiltersOpen(true)}
            onAddWidgetClick={() => setIsAddWidgetOpen(true)}
            onNavigateTo={(view) => setActiveView(view)}
          />
        );
      case ActiveView.Products:
        return (
          <ProductsView
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case ActiveView.Order:
        return (
          <OrdersView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case ActiveView.Customers:
        return (
          <CustomersView
            customers={customers}
            onToggleCustomerStatus={handleToggleCustomerStatus}
          />
        );
      case ActiveView.Chat:
        return (
          <ChatView
            initialUnreadCount={unreadCount}
            onClearUnread={() => setUnreadCount(0)}
          />
        );
      case ActiveView.Email:
        return <EmailView />;
      case ActiveView.Analytics:
        return <AnalyticsView />;
      case ActiveView.Performance:
        return <PerformanceView />;
      case ActiveView.Settings:
        return (
          <SettingsView
            businessName={businessName}
            setBusinessName={setBusinessName}
            username={username}
            setUsername={setUsername}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
          />
        );
      case ActiveView.Feedback:
        return <FeedbackView />;
      case ActiveView.Members:
        return <MembersView />;
      case ActiveView.Account:
        return <AccountView />;
      default:
        return (
          <div className="py-20 text-center font-sans text-gray-500">
            <h2 className="text-lg font-bold text-gray-900">Module Under Construction</h2>
            <p className="text-xs mt-1">This analytical drawer is currently initializing on {businessName}.</p>
          </div>
        );
    }
  };

  return (
    <div className="app" id="app-root-container">
      {/* Collapsible Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={(v) => {
          setActiveView(v);
          setSearchQuery(""); // Clear search filter on view transitions
        }} 
        unreadChatCount={unreadCount}
      />

      {/* Primary Workplace Workspace */}
      <div className="main flex flex-col h-screen overflow-hidden">
        {/* Unified Top Toolbar Actions */}
        <TopBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onExport={handleExportData}
          onInviteMember={handleInviteMember}
          members={members}
        />

        {/* Dynamic Inner Dashboard Page viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative" id="app-viewport-pane" style={{ marginLeft: "10px" }}>
          {renderActiveContent()}
        </div>
      </div>

      {/* Widget customizer slide-over drawer panel */}
      <AddWidgetModal
        isOpen={isAddWidgetOpen}
        onClose={() => setIsAddWidgetOpen(false)}
        widgets={widgets}
        onToggleWidget={handleToggleWidgetVisibility}
      />

      {/* Filters slide-over drawer panel */}
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={dashboardFilters}
        onApplyFilters={setDashboardFilters}
      />
    </div>
  );
}
