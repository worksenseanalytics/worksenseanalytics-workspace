/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, SlidersHorizontal, Calendar, DollarSign, Package, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    period: string;
    minSales: number;
    productStatus: string[];
    orderStatus: string[];
  };
  onApplyFilters: (filters: {
    period: string;
    minSales: number;
    productStatus: string[];
    orderStatus: string[];
  }) => void;
}

export default function FiltersModal({ isOpen, onClose, filters, onApplyFilters }: FiltersModalProps) {
  const [localPeriod, setLocalPeriod] = useState(filters.period);
  const [localMinSales, setLocalMinSales] = useState(filters.minSales);
  const [localProductStatus, setLocalProductStatus] = useState<string[]>(filters.productStatus);
  const [localOrderStatus, setLocalOrderStatus] = useState<string[]>(filters.orderStatus);

  // Sync state when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setLocalPeriod(filters.period);
      setLocalMinSales(filters.minSales);
      setLocalProductStatus(filters.productStatus);
      setLocalOrderStatus(filters.orderStatus);
    }
  }, [isOpen, filters]);

  const toggleProductStatus = (status: string) => {
    if (localProductStatus.includes(status)) {
      setLocalProductStatus(localProductStatus.filter((s) => s !== status));
    } else {
      setLocalProductStatus([...localProductStatus, status]);
    }
  };

  const toggleOrderStatus = (status: string) => {
    if (localOrderStatus.includes(status)) {
      setLocalOrderStatus(localOrderStatus.filter((s) => s !== status));
    } else {
      setLocalOrderStatus([...localOrderStatus, status]);
    }
  };

  const handleApply = () => {
    onApplyFilters({
      period: localPeriod,
      minSales: localMinSales,
      productStatus: localProductStatus,
      orderStatus: localOrderStatus,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalPeriod("This month");
    setLocalMinSales(0);
    setLocalProductStatus(["In Stock", "Out of stock"]);
    setLocalOrderStatus(["Completed", "Pending", "Cancelled"]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full border-l border-gray-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[var(--accent)] flex items-center justify-center">
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-none">Dashboard Filters</h3>
                    <span className="text-[10px] text-gray-400 mt-1 block">Customize metrics thresholds & scopes</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-7">
                {/* 1. Time Period Selection */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <Calendar size={12} /> TIME PERIOD
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["This month", "Last month", "This quarter", "This year"].map((p) => {
                      const active = localPeriod === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setLocalPeriod(p)}
                          className={`py-2 px-3 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? "bg-indigo-50/20 border-[var(--accent)] text-[var(--accent)] shadow-sm shadow-indigo-500/5"
                              : "bg-white border-gray-100 hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Minimum Revenue / Sales Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                      <DollarSign size={12} /> MIN PRODUCT REVENUE
                    </h4>
                    <span className="text-xs font-bold text-[var(--accent)] bg-indigo-50/40 px-2 py-0.5 rounded-lg">
                      ${localMinSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="500"
                      value={localMinSales}
                      onChange={(e) => setLocalMinSales(Number(e.target.value))}
                      className="w-full accent-[var(--accent)] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                      <span>$0</span>
                      <span>$5,000</span>
                      <span>$10,000</span>
                      <span>$15,000+</span>
                    </div>
                  </div>
                </div>

                {/* 3. Product Status Checkboxes */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <Package size={12} /> PRODUCT STOCK STATUS
                  </h4>
                  <div className="space-y-2">
                    {["In Stock", "Out of stock"].map((status) => {
                      const checked = localProductStatus.includes(status);
                      return (
                        <div
                          key={status}
                          onClick={() => toggleProductStatus(status)}
                          className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                            checked
                              ? "bg-indigo-50/10 border-indigo-200/50"
                              : "bg-white border-gray-100 hover:bg-gray-50/50"
                          }`}
                        >
                          <span className={`text-xs font-semibold ${checked ? "text-gray-900" : "text-gray-500"}`}>
                            {status}
                          </span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              checked ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-gray-200 bg-white"
                            }`}
                          >
                            {checked && <Check size={10} strokeWidth={4} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Order Status Checkboxes */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    ● ORDER TRANSACTION STATUS
                  </h4>
                  <div className="space-y-2">
                    {["Completed", "Pending", "Cancelled"].map((status) => {
                      const checked = localOrderStatus.includes(status);
                      return (
                        <div
                          key={status}
                          onClick={() => toggleOrderStatus(status)}
                          className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                            checked
                              ? "bg-indigo-50/10 border-indigo-200/50"
                              : "bg-white border-gray-100 hover:bg-gray-50/50"
                          }`}
                        >
                          <span className={`text-xs font-semibold ${checked ? "text-gray-900" : "text-gray-500"}`}>
                            {status}
                          </span>
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              checked ? "bg-[var(--accent)] border-[var(--accent)] text-white" : "border-gray-200 bg-white"
                            }`}
                          >
                            {checked && <Check size={10} strokeWidth={4} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-deep)] text-white text-xs font-semibold rounded-xl shadow-sm transition-all shadow-indigo-500/10 cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
