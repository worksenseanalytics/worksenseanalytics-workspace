/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ActiveSalesProps {
  onSeeDetails: () => void;
}

export default function ActiveSales({ onSeeDetails }: ActiveSalesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const barData = [
    { label: "W1", value: 4500, active: false },
    { label: "W2", value: 6800, active: true },
    { label: "W3", value: 5200, active: false },
    { label: "W4", value: 8564, active: true },
    { label: "W5", value: 2000, active: false },
  ];

  const maxVal = Math.max(...barData.map(d => d.value));

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 h-[220px]" id="widget-active-sales">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-xs font-semibold">Active sales</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Real-time active sales tracking
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats and Small Chart */}
      <div className="flex items-center justify-between gap-2 my-2 flex-1">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">$27,064</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-gray-400 font-medium">vs last month</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-green-600 bg-green-50 rounded-md flex items-center gap-0.5">
              <span>↑</span>
              <span>12%</span>
            </span>
          </div>
        </div>

        {/* Small Interactive Vertical Bar Chart */}
        <div className="flex items-end justify-between gap-2.5 h-20 w-32 relative">
          {barData.map((bar, idx) => {
            const pct = (bar.value / maxVal) * 100;
            return (
              <div 
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Visual Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`w-2.5 rounded-full transition-all duration-200 ${
                    bar.active 
                      ? "bg-[#FF6433] opacity-100 hover:bg-[#E05224]" 
                      : "bg-[#FFEBE4] opacity-80 hover:opacity-100"
                  }`}
                />
                
                {/* Label */}
                <span className="text-[8px] font-semibold text-gray-400 mt-1.5 group-hover:text-gray-900 transition-colors">
                  {bar.label}
                </span>

                {/* Micro Tooltip */}
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 5 }}
                      className="absolute bottom-full mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded shadow-lg whitespace-nowrap pointer-events-none z-20"
                    >
                      ${bar.value.toLocaleString()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <button 
        onClick={onSeeDetails}
        className="text-[11px] font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1 hover:gap-1.5 transition-all self-start pt-2 border-t border-gray-50 w-full text-left"
        id="btn-active-sales-details"
      >
        <span>See Details</span>
        <ArrowUpRight size={13} className="text-gray-400" />
      </button>
    </div>
  );
}
