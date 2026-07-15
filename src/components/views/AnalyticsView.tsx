/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, ChevronDown, SlidersHorizontal, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("This year");
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { name: "Cosmetics", percentage: "48%", colorStyle: {} },
    { name: "Housewest", percentage: "32%", colorStyle: { background: "oklch(58% .16 195)" } },
    { name: "Other", percentage: "20%", colorStyle: { background: "oklch(85% .04 258)" } },
  ];

  const allCategories = [
    { name: "Cosmetics", percentage: "48%", colorStyle: {} },
    { name: "Housewest", percentage: "32%", colorStyle: { background: "oklch(58% .16 195)" } },
    { name: "Accessories", percentage: "10%", colorStyle: { background: "var(--green)" } },
    { name: "Electronics", percentage: "6%", colorStyle: { background: "var(--red)" } },
    { name: "Office Supplies", percentage: "3%", colorStyle: { background: "oklch(75% .1 310)" } },
    { name: "Other", percentage: "1%", colorStyle: { background: "oklch(85% .04 258)" } },
  ];

  // Interactive, state-driven dataset representing this year, this month, and last 30 days
  const datasets: Record<string, { label: string; value: number; prevValue: number }[]> = {
    "This year": [
      { label: "JAN", value: 1400, prevValue: 1200 },
      { label: "FEB", value: 1800, prevValue: 1400 },
      { label: "MAR", value: 2400, prevValue: 1900 },
      { label: "APR", value: 2100, prevValue: 1800 },
      { label: "MAY", value: 2900, prevValue: 2300 },
      { label: "JUN", value: 3200, prevValue: 2600 },
      { label: "JUL", value: 3100, prevValue: 2500 },
      { label: "AUG", value: 3600, prevValue: 3000 },
      { label: "SEP", value: 3900, prevValue: 3100 },
      { label: "OCT", value: 4100, prevValue: 3400 },
      { label: "NOV", value: 4300, prevValue: 3700 },
      { label: "DEC", value: 4700, prevValue: 4100 },
    ],
    "This month": [
      { label: "WEEK 1", value: 980, prevValue: 850 },
      { label: "WEEK 2", value: 1340, prevValue: 1100 },
      { label: "WEEK 3", value: 1150, prevValue: 1050 },
      { label: "WEEK 4", value: 1580, prevValue: 1300 },
    ],
    "Last 30 days": [
      { label: "DAYS 1-5", value: 820, prevValue: 750 },
      { label: "DAYS 6-10", value: 1150, prevValue: 980 },
      { label: "DAYS 11-15", value: 1420, prevValue: 1200 },
      { label: "DAYS 16-20", value: 1280, prevValue: 1100 },
      { label: "DAYS 21-25", value: 1650, prevValue: 1450 },
      { label: "DAYS 26-30", value: 1980, prevValue: 1720 },
    ],
  };

  const activeData = datasets[timeRange] || datasets["This year"];

  // Hover and interaction states
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // SVG Chart sizing & coordinates setup
  const width = 800;
  const height = 230;
  const paddingTop = 25;
  const paddingBottom = 15;
  const paddingLeft = 10;
  const paddingRight = 10;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Dynamically scale the chart with standard headroom
  const maxVal = Math.max(...activeData.flatMap(d => [d.value, d.prevValue])) * 1.15;

  const currentPoints = activeData.map((d, index) => {
    const x = paddingLeft + (index / (activeData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const prevPoints = activeData.map((d, index) => {
    const x = paddingLeft + (index / (activeData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.prevValue / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const getBezierPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const currentLinePath = getBezierPath(currentPoints);
  const prevLinePath = getBezierPath(prevPoints);

  const yBaseline = paddingTop + chartHeight;
  const currentAreaPath = currentLinePath ? `${currentLinePath} L ${currentPoints[currentPoints.length - 1].x} ${yBaseline} L ${currentPoints[0].x} ${yBaseline} Z` : "";
  const prevAreaPath = prevLinePath ? `${prevLinePath} L ${prevPoints[prevPoints.length - 1].x} ${yBaseline} L ${prevPoints[0].x} ${yBaseline} Z` : "";

  // Dynamic Y-axis scale labels (6 intervals)
  const yTicks = Array.from({ length: 6 }, (_, idx) => {
    const val = (maxVal * (5 - idx)) / 5;
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${Math.round(val)}`;
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const svgX = (x / rect.width) * width;
    
    const segmentWidth = chartWidth / (activeData.length - 1);
    const index = Math.round((svgX - paddingLeft) / segmentWidth);
    const safeIndex = Math.max(0, Math.min(activeData.length - 1, index));
    
    setHoverIndex(safeIndex);
    setTooltipPos({ 
      x: paddingLeft + safeIndex * segmentWidth, 
      y: Math.max(20, y - 10) 
    });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setTooltipPos(null);
  };

  const handleExportCSV = () => {
    // Generate dynamic CSV content from selected timeframe
    const headers = ["Timeframe", "Current Period ($)", "Previous Period ($)", "Growth (%)"];
    const rows = activeData.map(d => {
      const growth = Math.round(((d.value - d.prevValue) / d.prevValue) * 100);
      return [d.label, d.value.toString(), d.prevValue.toString(), `${growth}%`];
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "worksense_analytics_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="content font-sans">
      {/* Page Heading matching markup */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Turn sales activity into decisions</p>
        </div>
        <div className="heading-actions">
          {/* Timeframe Select */}
          <div className="relative inline-block">
            <select
              className="select filter-input text-xs appearance-none pr-8 cursor-pointer font-semibold"
              style={{ height: "40px", minWidth: "120px" }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="This year">This year</option>
              <option value="This month">This month</option>
              <option value="Last 30 days">Last 30 days</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <button className="btn" onClick={handleExportCSV}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Analytics Grid matching design */}
      <div className="analytics-grid">
        {/* Revenue Trend Line Chart Panel */}
        <section className="panel chart-card">
          <div className="panel-head">
            <div>
              <div className="section-title">Revenue trend</div>
              <div className="muted">Monthly performance across all products</div>
            </div>
            <span className="trend up flex items-center gap-1">
              <TrendingUp size={12} />
              <span>↑18.4%</span>
            </span>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] sm:text-xs mb-3 px-1 ml-[48px] mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[oklch(60%_.22_258)]" />
              <span className="font-semibold text-gray-700">This Year (Current)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="font-semibold text-gray-400">Last Year</span>
            </div>
          </div>

          <div className="line-chart relative" style={{ paddingLeft: "0px", marginTop: "5px", marginBottom: "16px" }}>
            <div className="ylabels">
              {yTicks.map((tick, idx) => (
                <span key={idx}>{tick}</span>
              ))}
            </div>
            
            {/* SVG line chart content */}
            <div className="h-full ml-[48px] pr-4 relative">
              <svg 
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none" 
                className="w-full h-full block overflow-visible select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  {/* Current year gradient */}
                  <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(60% .22 258)" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="oklch(60% .22 258)" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Last year gradient */}
                  <linearGradient id="prevYearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(75% .04 250)" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="oklch(75% .04 250)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="var(--line)" strokeWidth={1} strokeDasharray="4,8" opacity={0.3} />
                <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.25} x2={width - paddingRight} y2={paddingTop + chartHeight * 0.25} stroke="var(--line)" strokeWidth={1} strokeDasharray="4,8" opacity={0.3} />
                <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.5} x2={width - paddingRight} y2={paddingTop + chartHeight * 0.5} stroke="var(--line)" strokeWidth={1} strokeDasharray="4,8" opacity={0.3} />
                <line x1={paddingLeft} y1={paddingTop + chartHeight * 0.75} x2={width - paddingRight} y2={paddingTop + chartHeight * 0.75} stroke="var(--line)" strokeWidth={1} strokeDasharray="4,8" opacity={0.3} />
                <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke="var(--line)" strokeWidth={1} opacity={0.4} />

                {/* 1. Last Year (Prev Year) Area */}
                {prevAreaPath && (
                  <path 
                    d={prevAreaPath}
                    fill="url(#prevYearGrad)"
                    className="transition-all duration-300"
                  />
                )}
                {prevLinePath && (
                  <path 
                    d={prevLinePath}
                    fill="none"
                    stroke="oklch(70% .04 250)"
                    strokeWidth={1.5}
                    strokeDasharray="4,4"
                    className="transition-all duration-300"
                  />
                )}

                {/* 2. This Year (Current) Area */}
                {currentAreaPath && (
                  <path 
                    d={currentAreaPath}
                    fill="url(#currentGrad)"
                    className="transition-all duration-300"
                  />
                )}
                {currentLinePath && (
                  <path 
                    d={currentLinePath}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={2.5}
                    className="transition-all duration-300"
                  />
                )}

                {/* 3. Interactive Vertical Hover Guide line and Dots */}
                {hoverIndex !== null && (
                  <g>
                    <line 
                      x1={currentPoints[hoverIndex].x} 
                      y1={paddingTop} 
                      x2={currentPoints[hoverIndex].x} 
                      y2={paddingTop + chartHeight} 
                      stroke="var(--ink)" 
                      strokeWidth={1} 
                      strokeDasharray="2,4"
                      opacity={0.5}
                    />
                    
                    {/* Last year intersection circle */}
                    <circle 
                      cx={prevPoints[hoverIndex].x} 
                      cy={prevPoints[hoverIndex].y} 
                      r={5} 
                      fill="oklch(70% .04 250)" 
                      stroke="var(--surface)" 
                      strokeWidth={1.5} 
                    />
                    
                    {/* This year intersection circle */}
                    <circle 
                      cx={currentPoints[hoverIndex].x} 
                      cy={currentPoints[hoverIndex].y} 
                      r={6} 
                      fill="var(--accent)" 
                      stroke="var(--surface)" 
                      strokeWidth={2} 
                      className="animate-pulse"
                    />
                  </g>
                )}
              </svg>

              {/* Styled HTML interactive tooltip */}
              {hoverIndex !== null && tooltipPos && (
                <div 
                  className="absolute bg-[var(--ink)] text-[var(--surface)] text-[11px] rounded-xl p-2.5 shadow-xl pointer-events-none z-30 transition-all duration-75 border border-white/10"
                  style={{
                    left: `${(tooltipPos.x / width) * 100}%`,
                    top: `${tooltipPos.y}px`,
                    transform: "translate(-50%, -115%)",
                    minWidth: "140px",
                    lineHeight: "1.4"
                  }}
                >
                  <div className="font-bold text-[9px] tracking-wider text-gray-400 mb-1">
                    {activeData[hoverIndex].label}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        This Year:
                      </span>
                      <span className="font-mono font-bold">${activeData[hoverIndex].value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Last Year:
                      </span>
                      <span className="font-mono font-bold">${activeData[hoverIndex].prevValue.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-1 mt-1 flex items-center justify-between text-[9px] text-green-400 font-medium">
                      <span>Growth:</span>
                      <span className="font-bold font-mono">
                        +{Math.round(((activeData[hoverIndex].value - activeData[hoverIndex].prevValue) / activeData[hoverIndex].prevValue) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="months mt-3" style={{ marginLeft: "42px", display: "flex", justifyContent: "space-between", paddingRight: "16px" }}>
            {activeData.map((d, index) => (
              <span 
                key={index} 
                className={`text-[10px] font-semibold transition-all duration-150 ${
                  hoverIndex === index ? "text-[var(--ink)] font-bold scale-110" : "text-gray-400"
                }`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </section>

        {/* Category Breakdown Donut Chart Panel */}
        <section className="panel chart-card flex flex-col justify-between">
          <div>
            <div className="section-title">Revenue by category</div>
            <p className="muted text-xs mt-1">Breakdown of product division sales</p>
          </div>
          
          <div 
            className="donut-big"
            style={{
              background: isExpanded
                ? "conic-gradient(var(--accent) 0% 48%, oklch(58% .16 195) 48% 80%, var(--green) 80% 90%, var(--red) 90% 96%, oklch(75% .1 310) 96% 99%, oklch(85% .04 258) 99% 100%)"
                : "conic-gradient(var(--accent) 0% 48%, oklch(58% .16 195) 48% 80%, oklch(85% .04 258) 80% 100%)"
            }}
          ></div>
          
          <div className="legend-large space-y-2">
            {(isExpanded ? allCategories : categories).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <i className={cat.name === "Housewest" ? "swatch pale" : "swatch"} style={cat.colorStyle}></i>
                <span className="text-sm">{cat.name}</span>
                <span className="ml-auto font-semibold">{cat.percentage}</span>
              </div>
            ))}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 w-full py-1.5 px-3 rounded-xl border border-gray-150 text-[11px] font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
            >
              <span>{isExpanded ? "Collapse divisions" : "Expand divisions (6)"}</span>
              <ChevronDown size={12} className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </section>
      </div>

      {/* KPI Stats Strip at the bottom */}
      <div className="stat-strip" style={{ marginTop: "16px" }}>
        <div className="panel stat">
          <div className="stat-label">Conversion rate</div>
          <div className="stat-value">0.73%</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Customer acquisition cost</div>
          <div className="stat-value">$24.80</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Lifetime value</div>
          <div className="stat-value">$438</div>
        </div>
        <div className="panel stat">
          <div className="stat-label">Gross margin</div>
          <div className="stat-value">62.4%</div>
        </div>
      </div>
    </section>
  );
}
