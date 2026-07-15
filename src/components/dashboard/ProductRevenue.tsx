/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductRevenueProps {
  onSeeDetails: () => void;
}

export default function ProductRevenue({ onSeeDetails }: ProductRevenueProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = 16568;
  const segments = [
    { label: "Cosmetics", value: 11598, color: "#FF6433", percentage: 70 },
    { label: "Housewest", value: 4970, color: "#FFEBE4", percentage: 30 }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 h-[220px]" id="widget-product-revenue">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-xs font-semibold">Product Revenue</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Revenue distribution of categories
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats and Donut Ring */}
      <div className="flex items-center justify-between gap-2 my-2 flex-1">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">$16,568</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-gray-400 font-medium">vs last month</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-green-600 bg-green-50 rounded-md flex items-center gap-0.5">
              <span>↑</span>
              <span>7%</span>
            </span>
          </div>
        </div>

        {/* Ring / Donut Chart */}
        <div className="relative w-20 h-20 flex items-center justify-center mr-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#f3f4f6"
              strokeWidth="2.8"
            />
            {/* Housewest Segment (30%) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#FFEBE4"
              strokeWidth="3.2"
              strokeDasharray="30 70"
              strokeDashoffset="-70"
              className="cursor-pointer transition-all duration-200 hover:stroke-width-4"
              onMouseEnter={() => setHoveredSegment("Housewest")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
            {/* Cosmetics Segment (70%) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#FF6433"
              strokeWidth="3.2"
              strokeDasharray="70 30"
              strokeDashoffset="0"
              className="cursor-pointer transition-all duration-200 hover:stroke-width-4"
              onMouseEnter={() => setHoveredSegment("Cosmetics")}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>
          
          {/* Inner ring text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-bold text-gray-900">
              {hoveredSegment ? (hoveredSegment === "Cosmetics" ? "70%" : "30%") : "70%"}
            </span>
            <span className="text-[7px] text-gray-400 font-medium">
              {hoveredSegment ? hoveredSegment : "Cosmetics"}
            </span>
          </div>

          {/* Mini tooltip for segments */}
          <AnimatePresence>
            {hoveredSegment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded shadow-lg whitespace-nowrap pointer-events-none z-20"
              >
                {hoveredSegment === "Cosmetics" ? "$11,598" : "$4,970"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Link */}
      <button 
        onClick={onSeeDetails}
        className="text-[11px] font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1 hover:gap-1.5 transition-all self-start pt-2 border-t border-gray-50 w-full text-left"
        id="btn-product-revenue-details"
      >
        <span>See Details</span>
        <ArrowUpRight size={13} className="text-gray-400" />
      </button>
    </div>
  );
}
