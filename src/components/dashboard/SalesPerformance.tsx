/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, ArrowUpRight, ArrowUp } from "lucide-react";
import { motion } from "motion/react";

interface SalesPerformanceProps {
  onSeeDetails: () => void;
}

export default function SalesPerformance({ onSeeDetails }: SalesPerformanceProps) {
  const [isHovered, setIsHovered] = useState(false);

  // SVG Gauge Calculations
  // Semi circle has circumference: Math.PI * R
  // Radius R = 40, circum = 125.66. We draw an arc using path or circle.
  const radius = 40;
  const strokeWidth = 8;
  const sqSize = 100;
  
  // Clean custom SVG path for half-circle arch
  // Center is (50, 55). Radius is 40. Arc starts from left (10, 55) to right (90, 55)
  // Path description: M 14 55 A 36 36 0 0 1 86 55
  // Arc length = PI * 36 = 113.1
  const arcLength = 113.1;
  const progressPct = 17.9 / 100; // 17.9%
  const strokeDashoffset = arcLength - progressPct * arcLength;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 w-full" id="widget-sales-performance">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-sm font-semibold text-gray-900">Sales Performance</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Analysis of today's sales velocity
            </span>
          </div>
        </div>
      </div>

      {/* Radial Gauge Visualizer */}
      <div 
        className="flex flex-col items-center justify-center my-4 relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg 
          className="w-48 h-28 transform"
          viewBox="0 0 100 65"
        >
          {/* Base Light Arc background */}
          <path
            d="M 14 55 A 36 36 0 0 1 86 55"
            fill="none"
            stroke="#FFEBE4"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Animated Highlighted Progress Arc (17.9%) */}
          <motion.path
            d="M 14 55 A 36 36 0 0 1 86 55"
            fill="none"
            stroke="#FF6433"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>

        {/* Floating Percentage in the center of arch */}
        <div className="absolute top-[48px] flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">17.9%</span>
            <div className="w-4 h-4 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <ArrowUp size={10} strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">Since yesterday</span>
        </div>
      </div>

      {/* Legend Information Rows */}
      <div className="space-y-2 border-t border-gray-50 pt-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-1.5 rounded-full bg-[#FF6433]" />
            <span className="text-gray-500 font-medium">Total Sales per day</span>
          </div>
          <span className="text-gray-900 font-semibold">For week</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-1.5 rounded-full bg-[#FFEBE4]" />
            <span className="text-gray-500 font-medium">Average Sales</span>
          </div>
          <span className="text-gray-900 font-semibold">For today</span>
        </div>
      </div>

      {/* Footer Link */}
      <button 
        onClick={onSeeDetails}
        className="text-[11px] font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1 hover:gap-1.5 transition-all self-start pt-3 border-t border-gray-50 w-full text-left mt-3"
        id="btn-sales-perf-details"
      >
        <span>See Details</span>
        <ArrowUpRight size={13} className="text-gray-400" />
      </button>
    </div>
  );
}
