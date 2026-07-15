/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, Filter, ChevronDown, Percent } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { monthlySalesData } from "../../mockData";

interface AnalyticsAreaChartProps {
  onFilterClick: () => void;
  activeTab: "cosmetics" | "housewest";
}

export default function AnalyticsAreaChart({ onFilterClick, activeTab }: AnalyticsAreaChartProps) {
  const [timeframe, setTimeframe] = useState("This year");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const data = monthlySalesData[activeTab];

  // SVG dimensions for rendering
  const width = 600;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for scaling
  const maxVal = 5000; // Fixed max of $5K as shown in image

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  // Construct path for the line
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Construct path for the area
  const areaPath = `
    ${linePath} 
    L ${points[points.length - 1].x} ${paddingTop + chartHeight} 
    L ${points[0].x} ${paddingTop + chartHeight} 
    Z
  `;

  // Specific highlighted index (MAY is index 4)
  const highlightedIndex = 4; // MAY
  const highlightedPoint = points[highlightedIndex];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col justify-between font-sans shadow-sm hover:shadow-md transition-shadow duration-300 w-full" id="widget-analytics-chart">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-sm font-semibold text-gray-900">Analytics</span>
          <div className="group relative cursor-pointer">
            <Info size={13} className="text-gray-400" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
              Overview of annual sales trend
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Timeframe Dropdown */}
          <div className="relative">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl pl-3 pr-8 py-1.5 text-[11px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500/20 cursor-pointer"
            >
              <option>This year</option>
              <option>Last year</option>
              <option>Custom</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filters Button */}
          <button 
            onClick={onFilterClick}
            className="px-3 py-1.5 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Filter size={11} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Subtitles (KPI Summary) */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">-$4.5430</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-red-600 bg-red-50 rounded-md flex items-center gap-0.5">
              <span>↓</span>
              <span>0.4%</span>
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Sales volume</span>
        </div>

        <div className="h-8 w-px bg-gray-100" />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">0.73%</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold text-green-600 bg-green-50 rounded-md flex items-center gap-0.5">
              <span>↑</span>
              <span>13%</span>
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Conv. rate</span>
        </div>
      </div>

      {/* Responsive Chart Area */}
      <div className="w-full overflow-x-auto no-scrollbar pt-2">
        <div className="min-w-[540px] relative">
          <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              {/* Pattern for Hatch/Diagonal stripes */}
              <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#FFEBE4" strokeWidth="2.5" />
              </pattern>
              
              {/* Linear gradient for smooth line */}
              <linearGradient id="chartLineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6433" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF6433" stopOpacity="0.2" />
              </linearGradient>

              {/* Mask to apply pattern to the area under line */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6433" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#FF6433" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines (Horizontal) */}
            {[0, 1000, 2000, 3000, 4000, 5000].map((val) => {
              const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
              return (
                <g key={val} className="opacity-40">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke="#F3F4F6" 
                    strokeWidth="1" 
                    strokeDasharray={val === 0 ? "0" : "4 4"}
                  />
                  {/* Y Axis Label */}
                  <text 
                    x={paddingLeft - 10} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[9px] font-medium text-gray-400 fill-current"
                  >
                    ${val / 1000}K
                  </text>
                </g>
              );
            })}

            {/* Hatch Area Fill */}
            <path d={areaPath} fill="url(#diagonalHatch)" />

            {/* Solid area gradient layer above hatch for warmth */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Chart Line */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="#FF6433" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Custom MAY highlighted vertical pillar and tag */}
            {highlightedPoint && (
              <g>
                {/* Translucent highlighted column background */}
                <rect
                  x={highlightedPoint.x - 12}
                  y={paddingTop}
                  width="24"
                  height={chartHeight + 2}
                  rx="12"
                  fill="#FF6433"
                  fillOpacity="0.1"
                  stroke="#FF6433"
                  strokeWidth="1.5"
                />

                {/* Vertical column highlight line inside */}
                <line
                  x1={highlightedPoint.x}
                  y1={paddingTop + 10}
                  x2={highlightedPoint.x}
                  y2={paddingTop + chartHeight}
                  stroke="#FF6433"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* Circle point on the line */}
                <circle 
                  cx={highlightedPoint.x} 
                  cy={highlightedPoint.y} 
                  r="5" 
                  fill="#FF6433" 
                  stroke="white" 
                  strokeWidth="2" 
                  className="shadow-lg"
                />

                {/* +19% pill indicator */}
                <foreignObject
                  x={highlightedPoint.x - 24}
                  y={highlightedPoint.y - 32}
                  width="48"
                  height="22"
                >
                  <div className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg text-center shadow-lg leading-tight select-none">
                    +19%
                  </div>
                </foreignObject>
              </g>
            )}

            {/* Interactive Circles / Hover triggers */}
            {points.map((p, idx) => {
              if (idx === highlightedIndex) return null; // Already handled custom May highlight
              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {(hoveredPoint === idx) && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="#FF6433"
                      stroke="white"
                      strokeWidth="1.5"
                      className="pointer-events-none"
                    />
                  )}
                </g>
              );
            })}

            {/* X Axis Labels */}
            {points.map((p, idx) => (
              <text
                key={idx}
                x={p.x}
                y={paddingTop + chartHeight + 18}
                textAnchor="middle"
                className={`text-[9px] font-bold ${
                  idx === highlightedIndex ? "text-gray-900 font-extrabold fill-gray-900" : "text-gray-400 fill-gray-400"
                }`}
              >
                {p.label}
              </text>
            ))}
          </svg>

          {/* Point Tooltip on Hover */}
          <AnimatePresence>
            {hoveredPoint !== null && hoveredPoint !== highlightedIndex && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                className="absolute bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-xl pointer-events-none z-20"
                style={{
                  left: points[hoveredPoint].x - 30,
                  top: points[hoveredPoint].y - 35,
                }}
              >
                ${points[hoveredPoint].value.toLocaleString()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
