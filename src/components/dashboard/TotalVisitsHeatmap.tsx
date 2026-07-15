/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { heatmapData } from "../../mockData";

export default function TotalVisitsHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; visits: number } | null>(null);

  const days = ["MON", "TUE", "WED"];
  const hours = [9, 10, 11, 12, 13, 14, 15];

  // Map values to Tailwind opacity levels
  const getCellBg = (visits: number, isBAM: boolean) => {
    if (isBAM) return "bg-[#FF6433]"; // Bright orange for custom highlighted metric
    if (visits > 4000) return "bg-[#E05224] opacity-90";
    if (visits > 3000) return "bg-[#FF6433] opacity-60";
    if (visits > 2000) return "bg-[#FF6433] opacity-35";
    if (visits > 1500) return "bg-[#FF6433] opacity-15";
    return "bg-[#FF6433] opacity-5";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-[250px]" id="widget-hourly-visits">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-3">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-xs font-semibold text-gray-400">Total visits by hourly</span>
          <div className="group relative cursor-pointer">
            <Info size={13} />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Hour-by-hour user session frequency
            </span>
          </div>
        </div>

        {/* Options */}
        <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Metric Volume */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">288,822</span>
        <span className="px-1.5 py-0.5 text-[9px] font-bold text-green-600 bg-green-50 rounded-md flex items-center gap-0.5">
          <span>↑</span>
          <span>4%</span>
        </span>
      </div>

      {/* Heatmap visualization container */}
      <div className="flex-1 flex flex-col justify-center select-none relative">
        <div className="space-y-1.5">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-2">
              {/* Day Label */}
              <span className="w-8 text-[9px] font-bold text-gray-400">{day}</span>
              
              {/* Hourly Blocks */}
              <div className="flex-1 grid grid-cols-7 gap-1.5 h-6">
                {hours.map((hour) => {
                  const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour) || { visits: 1000 };
                  // Check if this is the highlighted "3,880 (BAM)" block
                  // In the screenshot, MON 11:00 has the BAM block. Let's make MON 11:00 the highlighted block!
                  const isBAM = day === "MON" && hour === 11;

                  return (
                    <div
                      key={hour}
                      className={`h-full rounded-md cursor-pointer transition-all duration-150 relative ${
                        getCellBg(dataPoint.visits, isBAM)
                      } hover:scale-105 hover:shadow-sm`}
                      onMouseEnter={() => setHoveredCell({ day, hour, visits: dataPoint.visits })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {/* BAM active overlay styled exactly as the orange text label in screenshot */}
                      {isBAM && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10">
                          <div className="bg-[#FF6433] text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                            <span>3,880 (BAM)</span>
                          </div>
                          {/* Caret */}
                          <div className="w-1.5 h-1.5 bg-[#FF6433] rotate-45 mx-auto -mt-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Hour Header labels below heatmap */}
        <div className="flex items-center gap-2 mt-1">
          <span className="w-8" /> {/* Blank alignment spacer */}
          <div className="flex-1 grid grid-cols-7 gap-1.5 text-center">
            {hours.map((hour) => (
              <span key={hour} className="text-[8px] font-bold text-gray-400">
                {hour}:00
              </span>
            ))}
          </div>
        </div>

        {/* Hover details tooltip */}
        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 right-0 bg-gray-900 text-white text-[9px] px-2 py-1 rounded-md font-bold shadow-lg pointer-events-none"
            >
              {hoveredCell.day} {hoveredCell.hour}:00 — {hoveredCell.visits.toLocaleString()} visits
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
