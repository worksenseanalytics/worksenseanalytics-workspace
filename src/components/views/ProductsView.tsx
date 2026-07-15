/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SlidersHorizontal, Plus, Download, Edit3, Trash2, X, Check, Package } from "lucide-react";
import { Product } from "../../types";
import { AnimatePresence, motion } from "motion/react";

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductsView({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}: ProductsViewProps) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Modal states
  const [newProdName, setNewProdName] = useState("");
  const [newProdSales, setNewProdSales] = useState(0);
  const [newProdRevenue, setNewProdRevenue] = useState(0);
  const [newProdStock, setNewProdStock] = useState(100);
  const [newProdStatus, setNewProdStatus] = useState<"In Stock" | "Out of stock">("In Stock");

  // Filtering products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic calculations
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.revenue, 0);
  const inStockCount = products.filter(p => p.status === "In Stock").length;
  const outOfStockCount = products.filter(p => p.status === "Out of stock").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProdName.trim()) {
      onAddProduct({
        name: newProdName,
        sales: newProdSales,
        revenue: newProdRevenue,
        stock: newProdStock,
        status: newProdStatus,
      });
      setShowAddModal(false);
      setNewProdName("");
      setNewProdSales(0);
      setNewProdRevenue(0);
      setNewProdStock(100);
      setNewProdStatus("In Stock");
    }
  };

  const handleExportCSV = () => {
    // Generate simple CSV content
    const headers = ["Product Name", "Sales Count", "Total Revenue", "Stock Level", "Status"];
    const rows = products.map(p => [p.name, p.sales, p.revenue, p.stock, p.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "worksense_products_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content font-sans">
      {/* Page Heading matching markup */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Inventory & Catalog</div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">Manage your products inventory, pricing, and catalog list</p>
        </div>
        <div className="heading-actions">
          <button className="btn dark" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="stat-strip">
        <div className="panel stat">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{totalProducts} items</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Total Value</div>
          <div className="stat-value">${totalValue.toLocaleString()}</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">In Stock</div>
          <div className="stat-value">{inStockCount} items</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>{outOfStockCount} items</div>
        </div>
      </div>

      {/* Main Panel with Toolbar and Table */}
      <div className="panel">
        <div className="toolbar">
          <div className="toolbar-left">
            <input 
              className="filter-input text-xs" 
              placeholder="Filter products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn text-xs">
              <SlidersHorizontal size={13} />
              Status: All
              <ChevronDown />
            </button>
          </div>
          <div className="toolbar-right">
            <button className="btn text-xs" onClick={handleExportCSV}>
              CSV Export 
              <Download size={13} />
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Sales Count</th>
                <th>Total Revenue</th>
                <th>Stock level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb"><Package size={15} /></div>
                      <div>
                        <b>{prod.name}</b>
                        <div className="text-[10px] text-gray-400 font-mono">#{prod.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{prod.sales} pcs</td>
                  <td><b>${prod.revenue.toLocaleString()}</b></td>
                  <td>{prod.stock} items</td>
                  <td>
                    <span className={`status ${prod.status === "Out of stock" ? "out" : ""}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const newStock = prompt("Enter new stock count:", String(prod.stock));
                          if (newStock !== null) {
                            const val = parseInt(newStock, 10);
                            if (!isNaN(val)) {
                              onUpdateProduct({
                                ...prod,
                                stock: val,
                                status: val > 0 ? "In Stock" : "Out of stock"
                              });
                            }
                          }
                        }}
                        className="btn"
                        style={{ height: "28px", padding: "0 8px", borderRadius: "6px" }}
                        title="Update Stock"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                            onDeleteProduct(prod.id);
                          }
                        }}
                        className="btn"
                        style={{ height: "28px", padding: "0 8px", borderRadius: "6px" }}
                        title="Delete Product"
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="panel panel-pad relative z-10 w-full max-w-md"
              id="add-product-modal"
            >
              <div className="panel-head">
                <div className="section-title flex items-center gap-2">
                  <Package size={18} className="text-[var(--accent)]" />
                  <span>Add New Product</span>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="more"
                  style={{ width: "28px", height: "28px" }}
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="field">
                  <label>Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Vintage Leather Jacket"
                  />
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Initial Sales Count</label>
                    <input
                      type="number"
                      min="0"
                      value={newProdSales}
                      onChange={(e) => setNewProdSales(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="field">
                    <label>Initial Revenue ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={newProdRevenue}
                      onChange={(e) => setNewProdRevenue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Stock Count</label>
                    <input
                      type="number"
                      min="0"
                      value={newProdStock}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setNewProdStock(val);
                        setNewProdStatus(val > 0 ? "In Stock" : "Out of stock");
                      }}
                    />
                  </div>

                  <div className="field">
                    <label>Stock Status</label>
                    <select
                      value={newProdStatus}
                      onChange={(e) => setNewProdStatus(e.target.value as any)}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of stock">Out of stock</option>
                    </select>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn dark"
                  >
                    Create Product
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

// Simple internal helper icon
function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
