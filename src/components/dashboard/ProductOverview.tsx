/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface ProductOverviewProps {
  onTabChange: (tab: "cosmetics" | "housewest") => void;
  activeTab: "cosmetics" | "housewest";
}

export default function ProductOverview({ onTabChange, activeTab }: ProductOverviewProps) {
  const [timeframe, setTimeframe] = useState("This month");

  const data = {
    cosmetics: {
      totalSales: "$43,630",
      newSales: "453",
    },
    housewest: {
      totalSales: "$32,840",
      newSales: "318",
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 h-[220px]" id="widget-product-overview">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-xs font-semibold text-gray-400">Product overview</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Overview of active products sales
            </span>
          </div>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl pl-3 pr-8 py-1 text-[11px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500/20 cursor-pointer"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Sales Number */}
      <div className="my-2.5">
        <div className="flex items-baseline gap-2">
          <motion.span 
            key={activeTab + timeframe}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 tracking-tight"
          >
            {data[activeTab].totalSales}
          </motion.span>
          <span className="text-[10px] text-gray-400 font-medium">Total sales</span>
        </div>

        {/* New sales section */}
        <div className="flex items-center justify-between mt-2.5 pb-2 border-b border-gray-50">
          <span className="text-[10px] text-gray-400 font-medium">Select by product</span>
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-[10px] text-gray-600 font-semibold group-hover:text-gray-900">
              New sales: <span className="text-gray-900">{data[activeTab].newSales}</span>
            </span>
            <ChevronDown size={11} className="text-gray-400 group-hover:text-gray-700" />
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => onTabChange("cosmetics")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
            activeTab === "cosmetics"
              ? "bg-[#FF6433] text-white shadow-sm shadow-orange-500/10"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100/70"
          }`}
          id="btn-tab-cosmetics"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeTab === "cosmetics" ? "bg-white" : "bg-[#FF6433]"}`} />
          <span>Cosmetics</span>
        </button>

        <button
          onClick={() => onTabChange("housewest")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all relative cursor-pointer ${
            activeTab === "housewest"
              ? "bg-[#FFEBE4] text-[#E05224]"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100/70"
          }`}
          id="btn-tab-housewest"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E05224]" />
          <span>Housewest</span>
        </button>
      </div>
    </div>
  );
}
