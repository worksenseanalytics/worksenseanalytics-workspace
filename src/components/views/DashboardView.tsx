/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  SlidersHorizontal, 
  Plus, 
  ChevronDown, 
  ArrowRight, 
  UsersRound, 
  Ellipsis,
  RotateCw,
  Download
} from "lucide-react";
import { WidgetConfig, Product, ActiveView } from "../../types";

interface DashboardViewProps {
  widgets: WidgetConfig[];
  products: Product[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: {
    period: string;
    minSales: number;
    productStatus: string[];
    orderStatus: string[];
  };
  onFilterClick: () => void;
  onAddWidgetClick: () => void;
  onNavigateTo: (view: ActiveView) => void;
}

export default function DashboardView({
  widgets,
  products,
  activeTab,
  setActiveTab,
  filters,
  onFilterClick,
  onAddWidgetClick,
  onNavigateTo
}: DashboardViewProps) {
  // Check if a widget is visible
  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visible !== false;

  const [activeSalesHover, setActiveSalesHover] = React.useState<string | null>(null);
  const [prodRevenueHover, setProdRevenueHover] = React.useState<string | null>(null);
  const [pillsExpanded, setPillsExpanded] = React.useState(false);

  // Local widget selectors & dropdowns (no alert mockups!)
  const [overviewPeriod, setOverviewPeriod] = React.useState("This month");
  const [overviewPeriodOpen, setOverviewPeriodOpen] = React.useState(false);
  
  const [overviewMetric, setOverviewMetric] = React.useState<"New sales" | "Avg. Ticket" | "Orders">("New sales");
  const [overviewMetricOpen, setOverviewMetricOpen] = React.useState(false);

  const [analyticsPeriod, setAnalyticsPeriod] = React.useState("This year");
  const [analyticsPeriodOpen, setAnalyticsPeriodOpen] = React.useState(false);

  const [visitsMoreOpen, setVisitsMoreOpen] = React.useState(false);
  const [trafficLoading, setTrafficLoading] = React.useState(false);
  const [trafficRefreshed, setTrafficRefreshed] = React.useState(false);

  // Sync overviewPeriod with global filter period
  React.useEffect(() => {
    if (filters?.period) {
      setOverviewPeriod(filters.period);
    }
  }, [filters?.period]);

  // Streamgraph states & refs
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [hoveredMonthIndex, setHoveredMonthIndex] = React.useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const [streamHover, setStreamHover] = React.useState<"cosmetics" | "housewest" | "prevYear" | null>(null);

  // Streamgraph 12-month data comparing this year and previous year
  const streamData = [
    { month: "Jan", cosmetics: 120, housewest: 80, prevTotal: 190, monthLong: "January" },
    { month: "Feb", cosmetics: 140, housewest: 95, prevTotal: 210, monthLong: "February" },
    { month: "Mar", cosmetics: 154, housewest: 82, prevTotal: 220, monthLong: "March" },
    { month: "Apr", cosmetics: 130, housewest: 110, prevTotal: 235, monthLong: "April" },
    { month: "May", cosmetics: 170, housewest: 105, prevTotal: 250, monthLong: "May" },
    { month: "Jun", cosmetics: 160, housewest: 125, prevTotal: 260, monthLong: "June" },
    { month: "Jul", cosmetics: 150, housewest: 140, prevTotal: 280, monthLong: "July" },
    { month: "Aug", cosmetics: 165, housewest: 130, prevTotal: 275, monthLong: "August" },
    { month: "Sep", cosmetics: 180, housewest: 145, prevTotal: 290, monthLong: "September" },
    { month: "Oct", cosmetics: 195, housewest: 150, prevTotal: 310, monthLong: "October" },
    { month: "Nov", cosmetics: 210, housewest: 165, prevTotal: 330, monthLong: "November" },
    { month: "Dec", cosmetics: 230, housewest: 180, prevTotal: 350, monthLong: "December" },
  ];

  const centerLine = [115, 125, 110, 130, 120, 115, 125, 110, 130, 120, 115, 125];
  const h_cosm = [35, 40, 45, 38, 50, 48, 44, 48, 52, 56, 58, 62];
  const h_house = [25, 30, 28, 34, 36, 40, 38, 36, 42, 46, 48, 50];
  const h_prev = [55, 65, 68, 66, 80, 82, 78, 79, 86, 92, 98, 102];

  const getBezierPath = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const getStreamLayerPath = (topPoints: { x: number; y: number }[], bottomPoints: { x: number; y: number }[]): string => {
    const topPath = getBezierPath(topPoints);
    const reversedBottom = [...bottomPoints].reverse();
    let d = topPath;
    d += ` L ${reversedBottom[0].x} ${reversedBottom[0].y}`;
    for (let i = 0; i < reversedBottom.length - 1; i++) {
      const p0 = reversedBottom[i];
      const p1 = reversedBottom[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    d += " Z";
    return d;
  };

  const cosmTop = streamData.map((_, i) => ({
    x: i * (800 / 11),
    y: centerLine[i] - (h_cosm[i] + h_house[i]) / 2
  }));

  const cosmBottom = streamData.map((_, i) => ({
    x: i * (800 / 11),
    y: centerLine[i] - (h_cosm[i] + h_house[i]) / 2 + h_cosm[i]
  }));

  const houseTop = cosmBottom;

  const houseBottom = streamData.map((_, i) => ({
    x: i * (800 / 11),
    y: centerLine[i] + (h_cosm[i] + h_house[i]) / 2
  }));

  const prevTop = streamData.map((_, i) => ({
    x: i * (800 / 11),
    y: centerLine[i] - 6 - h_prev[i] / 2
  }));

  const prevBottom = streamData.map((_, i) => ({
    x: i * (800 / 11),
    y: centerLine[i] - 6 + h_prev[i] / 2
  }));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const svgX = (x / rect.width) * 800;
    const index = Math.round(svgX / (800 / 11));
    const safeIndex = Math.max(0, Math.min(11, index));
    setHoveredMonthIndex(safeIndex);
    setTooltipPos({ x: safeIndex * (800 / 11), y: y });
  };

  const handleMouseLeave = () => {
    setHoveredMonthIndex(null);
    setTooltipPos(null);
    setStreamHover(null);
  };

  return (
    <section className="content font-sans">
      {/* Page Heading matching markup exactly */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Track your sales and performance of your strategy</p>
        </div>
        <div className="heading-actions">
          <button className="btn" onClick={onFilterClick}>
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <button className="btn dark" onClick={onAddWidgetClick}>
            <Plus size={14} />
            Add Widget
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        
        {/* Module 1: Product overview */}
        {isVisible("w_prod_overview") && (
          <section className="panel overview flex flex-col justify-between">
            <div className="panel-head relative">
              <div className="section-title">
                Product overview <span className="info" title="Segmented sales based on product categories and period">i</span>
              </div>
              
              <div className="relative">
                <button 
                  className="select" 
                  onClick={() => setOverviewPeriodOpen(!overviewPeriodOpen)}
                >
                  {overviewPeriod} <ChevronDown size={14} />
                </button>
                {overviewPeriodOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOverviewPeriodOpen(false)} />
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in duration-100">
                      {["This month", "Last month", "This quarter", "This year"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setOverviewPeriod(p);
                            setOverviewPeriodOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                            overviewPeriod === p ? "text-[var(--accent)] font-bold bg-indigo-50/10" : "text-gray-600"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="total-line" style={{ marginTop: "12px", marginLeft: "10px" }}>
              <span className="big-number" style={{ marginLeft: "0px", marginTop: "0px" }}>
                {(() => {
                  let base = 43630;
                  if (overviewPeriod === "This year") base = 512800;
                  else if (overviewPeriod === "This quarter") base = 128450;
                  else if (overviewPeriod === "Last month") base = 38240;

                  // Segment dynamically based on category pill activeTab!
                  if (activeTab === "cosmetics") return `$${Math.round(base * 0.63).toLocaleString()}`;
                  if (activeTab === "housewest") return `$${Math.round(base * 0.37).toLocaleString()}`;
                  if (activeTab === "accessories") return `$${Math.round(base * 0.15).toLocaleString()}`;
                  if (activeTab === "electronics") return `$${Math.round(base * 0.22).toLocaleString()}`;
                  if (activeTab === "office") return `$${Math.round(base * 0.08).toLocaleString()}`;
                  return `$${base.toLocaleString()}`;
                })()}
              </span>
              <span className="muted">Total sales ({activeTab === "cosmetics" ? "Cosmetics" : activeTab === "housewest" ? "Housewest" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})</span>
            </div>
            
            <div className="overview-row text-xs relative">
              <span style={{ marginLeft: "0px", marginTop: "10px" }}>Select by product</span>
              <div className="relative">
                <button 
                  className="flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100/70 px-2.5 py-1 rounded-lg transition-all border border-gray-100"
                  style={{ marginTop: "5px", paddingTop: "4px", height: "26.6667px", marginBottom: "0px" }}
                  onClick={() => setOverviewMetricOpen(!overviewMetricOpen)}
                >
                  {overviewMetric === "New sales" && <>New sales: <b>{overviewPeriod === "This year" ? "5,436" : overviewPeriod === "This quarter" ? "1,359" : overviewPeriod === "Last month" ? "410" : "453"}</b></>}
                  {overviewMetric === "Avg. Ticket" && <>Avg. Ticket: <b>{overviewPeriod === "This year" ? "$102.50" : "$96.31"}</b></>}
                  {overviewMetric === "Orders" && <>Orders: <b>{overviewPeriod === "This year" ? "5,230" : overviewPeriod === "This quarter" ? "1,290" : overviewPeriod === "Last month" ? "415" : "453"}</b></>}
                  <ChevronDown size={12} />
                </button>
                {overviewMetricOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOverviewMetricOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                      {([
                        { key: "New sales", label: "New sales" },
                        { key: "Avg. Ticket", label: "Avg. Ticket" },
                        { key: "Orders", label: "Orders count" }
                      ] as const).map((m) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => {
                            setOverviewMetric(m.key);
                            setOverviewMetricOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                            overviewMetric === m.key ? "text-[var(--accent)] font-bold bg-indigo-50/10" : "text-gray-600"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="pills" style={pillsExpanded ? { height: "auto", flexWrap: "wrap", gap: "8px" } : { height: "36px", gap: "8px" }}>
              <button 
                onClick={() => setActiveTab("cosmetics")}
                className={`pill orange transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "cosmetics" ? "ring-2 ring-offset-2 ring-[var(--accent)]" : "opacity-75"
                }`}
                style={{ 
                  cursor: "pointer", 
                  height: "36px", 
                  minHeight: "36px", 
                  fontSize: "11px",
                  flex: pillsExpanded ? "1 1 calc(50% - 4px)" : "1"
                }}
              >
                Cosmetics ●
              </button>
              <button 
                onClick={() => setActiveTab("housewest")}
                className={`pill peach transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "housewest" ? "ring-2 ring-offset-2 ring-[oklch(72%_.14_195)]" : "opacity-75"
                }`}
                style={{ 
                  cursor: "pointer", 
                  height: "36px", 
                  minHeight: "36px", 
                  fontSize: "11px",
                  flex: pillsExpanded ? "1 1 calc(50% - 4px)" : "1"
                }}
              >
                Housewest ●
              </button>
              
              {pillsExpanded ? (
                <>
                  <button 
                    onClick={() => setActiveTab("accessories")}
                    className={`pill transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === "accessories" ? "ring-2 ring-offset-2 ring-[var(--green)]" : "opacity-75"
                    }`}
                    style={{ 
                      background: "var(--green)", 
                      cursor: "pointer", 
                      height: "36px", 
                      minHeight: "36px", 
                      fontSize: "11px",
                      flex: "1 1 calc(50% - 4px)"
                    }}
                  >
                    Accessories ●
                  </button>
                  <button 
                    onClick={() => setActiveTab("electronics")}
                    className={`pill transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === "electronics" ? "ring-2 ring-offset-2 ring-[var(--red)]" : "opacity-75"
                    }`}
                    style={{ 
                      background: "var(--red)", 
                      cursor: "pointer", 
                      height: "36px", 
                      minHeight: "36px", 
                      fontSize: "11px",
                      flex: "1 1 calc(50% - 4px)"
                    }}
                  >
                    Electronics ●
                  </button>
                  <button 
                    onClick={() => setActiveTab("office")}
                    className={`pill transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                      activeTab === "office" ? "ring-2 ring-offset-2 ring-[oklch(75%_.1_310)]" : "opacity-75"
                    }`}
                    style={{ 
                      background: "oklch(75% .1 310)", 
                      cursor: "pointer", 
                      height: "36px", 
                      minHeight: "36px", 
                      fontSize: "11px",
                      flex: "1 1 calc(50% - 4px)"
                    }}
                  >
                    Office ●
                  </button>
                  <button
                    onClick={() => setPillsExpanded(false)}
                    className="h-[36px] bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all rounded-lg flex items-center justify-center cursor-pointer text-gray-500 font-medium text-xs gap-1"
                    style={{ 
                      flex: "1 1 calc(50% - 4px)",
                      height: "36px"
                    }}
                  >
                    <span>Less</span>
                    <ChevronDown size={14} className="transform rotate-180" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setPillsExpanded(true)}
                  className="flex-1 min-w-[50px] h-[36px] bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all rounded-lg flex items-center justify-center cursor-pointer text-gray-500 font-semibold text-xs gap-1.5"
                  title="Expand categories"
                >
                  <span>More</span>
                  <Plus size={14} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Module 2: Active Sales & Product Revenue (KPIS) */}
        {(isVisible("w_active_sales") || isVisible("w_prod_revenue")) && (
          <section className="panel kpis">
            {isVisible("w_active_sales") && (
              <div className="kpi">
                <div className="kpi-label text-sm flex items-center">
                  Active sales <span className="info">i</span>
                </div>
                <div className="kpi-number" style={{ marginLeft: "10px", paddingTop: "0px", marginTop: "20px" }}>$27,064</div>
                <div className="muted flex items-center gap-1" style={{ marginLeft: "10px" }}>
                  vs last month <span className="trend up">↑12%</span>
                </div>
                
                {/* Micro-Legend / Hover Annotation */}
                <div className="text-[11px] text-gray-400 mt-1 h-4 flex items-center transition-all duration-150" style={{ marginTop: "25px", marginLeft: "10px" }}>
                  {activeSalesHover ? (
                    <span className="text-[var(--ink)] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{
                        background: activeSalesHover === "cosmetics" ? "var(--accent)" : activeSalesHover === "housewest" ? "oklch(72% .14 195)" : "oklch(84% .06 258)"
                      }} />
                      {activeSalesHover === "cosmetics" && "Cosmetics: $15,420 (57%)"}
                      {activeSalesHover === "housewest" && "Housewest: $8,210 (30%)"}
                      {activeSalesHover === "other" && "Other: $3,434 (13%)"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        Cosm
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(72%_.14_195)]" />
                        HW
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(84%_.06_258)]" />
                        Oth
                      </span>
                    </span>
                  )}
                </div>

                <div className="bars" style={{ width: "70px", height: "75px", marginLeft: "0px", paddingRight: "0px", marginTop: "0px", marginRight: "20px" }}>
                  <i 
                    className={`bar cursor-pointer transition-all duration-200 hover:scale-y-[1.15] hover:opacity-100 relative group/bar ${
                      activeSalesHover && activeSalesHover !== "cosmetics" ? "opacity-35 scale-y-90" : ""
                    }`}
                    style={{ height: "55px", width: "15px" }}
                    onMouseEnter={() => setActiveSalesHover("cosmetics")}
                    onMouseLeave={() => setActiveSalesHover(null)}
                  >
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-[var(--ink)] text-[var(--surface)] text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10 pointer-events-none font-medium">
                      Cosmetics: $15,420
                    </span>
                  </i>
                  <i 
                    className={`bar cursor-pointer transition-all duration-200 hover:scale-y-[1.15] hover:opacity-100 relative group/bar ${
                      activeSalesHover && activeSalesHover !== "housewest" ? "opacity-35 scale-y-90" : ""
                    }`}
                    style={{ background: "oklch(72% .14 195)", width: "15px", height: "35px" }}
                    onMouseEnter={() => setActiveSalesHover("housewest")}
                    onMouseLeave={() => setActiveSalesHover(null)}
                  >
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-[var(--ink)] text-[var(--surface)] text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10 pointer-events-none font-medium">
                      Housewest: $8,210
                    </span>
                  </i>
                  <i 
                    className={`bar cursor-pointer transition-all duration-200 hover:scale-y-[1.15] hover:opacity-100 relative group/bar ${
                      activeSalesHover && activeSalesHover !== "other" ? "opacity-35 scale-y-90" : ""
                    }`}
                    style={{ background: "oklch(84% .06 258)", width: "15px", height: "20px" }}
                    onMouseEnter={() => setActiveSalesHover("other")}
                    onMouseLeave={() => setActiveSalesHover(null)}
                  >
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/bar:block bg-[var(--ink)] text-[var(--surface)] text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10 pointer-events-none font-medium">
                      Other: $3,434
                    </span>
                  </i>
                </div>
                <button className="see" onClick={() => onNavigateTo(ActiveView.Analytics)}>
                  See Details <ArrowRight size={14} />
                </button>
              </div>
            )}

            {isVisible("w_prod_revenue") && (
              <div className="kpi">
                <div className="kpi-label text-sm flex items-center">
                  Product Revenue <span className="info">i</span>
                </div>
                <div className="kpi-number" style={{ marginLeft: "10px", marginTop: "20px" }}>$16,568</div>
                <div className="muted flex items-center gap-1" style={{ marginLeft: "10px" }}>
                  vs last month <span className="trend up">↑7%</span>
                </div>

                {/* Micro-Legend / Hover Annotation */}
                <div className="text-[11px] text-gray-400 mt-1 h-4 flex items-center transition-all duration-150" style={{ marginTop: "25px", marginLeft: "10px" }}>
                  {prodRevenueHover ? (
                    <span className="text-[var(--ink)] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{
                        background: prodRevenueHover === "cosmetics" ? "var(--accent)" : "oklch(72% .14 195)"
                      }} />
                      {prodRevenueHover === "cosmetics" && "Cosmetics: $10,438 (63%)"}
                      {prodRevenueHover === "housewest" && "Housewest: $6,130 (37%)"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        Cosm
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[oklch(72%_.14_195)]" />
                        HW
                      </span>
                    </span>
                  )}
                </div>

                <div 
                  className="donut cursor-pointer transition-transform duration-200 hover:scale-105 relative group/donut"
                  style={{ marginRight: "20px", marginTop: "15px" }}
                  onMouseEnter={() => setProdRevenueHover("cosmetics")}
                  onMouseLeave={() => setProdRevenueHover(null)}
                >
                  <span className="absolute bottom-full right-0 mb-1.5 hidden group-hover/donut:block bg-[var(--ink)] text-[var(--surface)] text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap z-10 pointer-events-none font-medium">
                    Cosmetics: 63% · Housewest: 37%
                  </span>
                </div>
                <button className="see" onClick={() => onNavigateTo(ActiveView.Products)}>
                  See Details <ArrowRight size={14} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Module 3: Analytics Streamgraph */}
        {isVisible("w_analytics_chart") && (
          <section className="panel analytics">
            <div className="panel-head">
              <div className="section-title">
                Analytics <span className="info" title="Comparing this year stacked stream with last year's total volume">i</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 relative">
                <span className="font-medium">Streamgraph</span>
                <div className="relative">
                  <button 
                    className="select" 
                    onClick={() => setAnalyticsPeriodOpen(!analyticsPeriodOpen)}
                  >
                    {analyticsPeriod} <ChevronDown size={14} />
                  </button>
                  {analyticsPeriodOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAnalyticsPeriodOpen(false)} />
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50">
                        {["This year", "Last year", "Last 3 years"].map((y) => (
                          <button
                            key={y}
                            type="button"
                            onClick={() => {
                              setAnalyticsPeriod(y);
                              setAnalyticsPeriodOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${
                              analyticsPeriod === y ? "text-[var(--accent)] font-bold bg-indigo-50/10" : "text-gray-600"
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="metric-row">
              <div>
                <b className="metric-value">
                  {analyticsPeriod === "This year" && "$43,630"}
                  {analyticsPeriod === "Last year" && "$38,820"}
                  {analyticsPeriod === "Last 3 years" && "$114,200"}
                </b>
                <span className="metric-label">Sales</span>
                <span className="trend up">
                  {analyticsPeriod === "This year" && "↑12%"}
                  {analyticsPeriod === "Last year" && "↑8.5%"}
                  {analyticsPeriod === "Last 3 years" && "↑24.3%"}
                </span>
              </div>
              <div>
                <b className="metric-value">
                  {analyticsPeriod === "This year" && "2.40%"}
                  {analyticsPeriod === "Last year" && "2.25%"}
                  {analyticsPeriod === "Last 3 years" && "2.31%"}
                </b>
                <span className="metric-label">Conv. rate</span>
                <span className="trend up">
                  {analyticsPeriod === "This year" && "↑13%"}
                  {analyticsPeriod === "Last year" && "↑11%"}
                  {analyticsPeriod === "Last 3 years" && "↑18%"}
                </span>
              </div>
            </div>

            {/* Interactive Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs mb-3 px-1">
              <div 
                className={`flex items-center gap-1.5 cursor-pointer transition-all duration-150 ${
                  streamHover && streamHover !== "cosmetics" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
                onMouseEnter={() => setStreamHover("cosmetics")}
                onMouseLeave={() => setStreamHover(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[oklch(70%_.22_258)] border border-[oklch(60%_.22_258)]"></span>
                <span className="font-semibold text-gray-700">Cosmetics (This Year)</span>
              </div>
              <div 
                className={`flex items-center gap-1.5 cursor-pointer transition-all duration-150 ${
                  streamHover && streamHover !== "housewest" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
                onMouseEnter={() => setStreamHover("housewest")}
                onMouseLeave={() => setStreamHover(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[oklch(83%_.14_195)] border border-[oklch(75%_.14_195)]"></span>
                <span className="font-semibold text-gray-700">Housewest (This Year)</span>
              </div>
              <div 
                className={`flex items-center gap-1.5 cursor-pointer transition-all duration-150 ${
                  streamHover && streamHover !== "prevYear" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
                onMouseEnter={() => setStreamHover("prevYear")}
                onMouseLeave={() => setStreamHover(null)}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[oklch(93%_.02_240)] border border-[oklch(75%_.02_240)] border-dashed"></span>
                <span className="font-semibold text-gray-400">Previous Year (Total)</span>
              </div>
            </div>

            <div className="chart relative">
              <div className="ylabels">
                <span>$5K</span>
                <span>$4K</span>
                <span>$3K</span>
                <span>$2K</span>
                <span>$1K</span>
                <span>$0K</span>
              </div>
              
              <svg 
                ref={svgRef}
                viewBox="0 0 800 230" 
                preserveAspectRatio="none"
                className="w-full h-full block overflow-visible select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="cosmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(70% .22 258)" />
                    <stop offset="100%" stopColor="oklch(60% .22 258)" />
                  </linearGradient>
                  <linearGradient id="houseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(83% .14 195)" />
                    <stop offset="100%" stopColor="oklch(75% .14 195)" />
                  </linearGradient>
                  <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(93% .02 240 / .45)" />
                    <stop offset="100%" stopColor="oklch(88% .02 240 / .15)" />
                  </linearGradient>
                  <pattern id="stripePattern" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="12" stroke="oklch(75% .02 240 / 0.12)" strokeWidth="1.5" />
                  </pattern>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="50" x2="800" y2="50" stroke="var(--line)" strokeWidth="1" strokeDasharray="4,8" opacity="0.4" />
                <line x1="0" y1="115" x2="800" y2="115" stroke="var(--line)" strokeWidth="1" strokeDasharray="4,8" opacity="0.4" />
                <line x1="0" y1="180" x2="800" y2="180" stroke="var(--line)" strokeWidth="1" strokeDasharray="4,8" opacity="0.4" />

                {/* 1. Previous Year Stream */}
                <path 
                  d={getStreamLayerPath(prevTop, prevBottom)} 
                  fill="url(#prevGrad)"
                  className="transition-all duration-300"
                  opacity={streamHover === "prevYear" ? 1.0 : streamHover ? 0.25 : 0.65}
                />
                <path 
                  d={getStreamLayerPath(prevTop, prevBottom)} 
                  fill="url(#stripePattern)"
                  className="transition-all duration-300"
                  opacity={streamHover === "prevYear" ? 1.0 : streamHover ? 0.25 : 0.65}
                />
                <path
                  d={getBezierPath(prevTop)}
                  fill="none"
                  stroke="oklch(75% .02 240)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="transition-all duration-300"
                  opacity={streamHover === "prevYear" ? 1.0 : streamHover ? 0.25 : 0.8}
                />
                <path
                  d={getBezierPath(prevBottom)}
                  fill="none"
                  stroke="oklch(75% .02 240)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="transition-all duration-300"
                  opacity={streamHover === "prevYear" ? 1.0 : streamHover ? 0.25 : 0.8}
                />

                {/* 2. Cosmetics (This Year) Layer */}
                <path 
                  d={getStreamLayerPath(cosmTop, cosmBottom)} 
                  fill="url(#cosmGrad)"
                  stroke="oklch(60% .22 258)"
                  strokeWidth="1"
                  className="transition-all duration-300 cursor-pointer"
                  opacity={streamHover === "cosmetics" ? 1.0 : streamHover ? 0.25 : 0.85}
                  onMouseEnter={() => setStreamHover("cosmetics")}
                  onMouseLeave={() => setStreamHover(null)}
                />

                {/* 3. Housewest (This Year) Layer */}
                <path 
                  d={getStreamLayerPath(houseTop, houseBottom)} 
                  fill="url(#houseGrad)"
                  stroke="oklch(75% .14 195)"
                  strokeWidth="1"
                  className="transition-all duration-300 cursor-pointer"
                  opacity={streamHover === "housewest" ? 1.0 : streamHover ? 0.25 : 0.85}
                  onMouseEnter={() => setStreamHover("housewest")}
                  onMouseLeave={() => setStreamHover(null)}
                />

                {/* Hover vertical timeline tracker and intersection points */}
                {hoveredMonthIndex !== null && (
                  <g>
                    <line 
                      x1={hoveredMonthIndex * (800 / 11)} 
                      y1="0" 
                      x2={hoveredMonthIndex * (800 / 11)} 
                      y2="230" 
                      stroke="var(--ink)" 
                      strokeWidth="1.5" 
                      strokeDasharray="3,3"
                    />
                    
                    {/* Circle indicators on the stream boundaries */}
                    {/* Prev Year Center */}
                    <circle 
                      cx={hoveredMonthIndex * (800 / 11)} 
                      cy={centerLine[hoveredMonthIndex] - 6} 
                      r="4" 
                      fill="oklch(70% .02 240)" 
                      stroke="var(--surface)" 
                      strokeWidth="1.5"
                    />
                    {/* Cosmetics Center */}
                    <circle 
                      cx={hoveredMonthIndex * (800 / 11)} 
                      cy={centerLine[hoveredMonthIndex] - (h_cosm[hoveredMonthIndex] + h_house[hoveredMonthIndex]) / 2 + h_cosm[hoveredMonthIndex] / 2} 
                      r="4.5" 
                      fill="oklch(65% .22 258)" 
                      stroke="var(--surface)" 
                      strokeWidth="1.5"
                    />
                    {/* Housewest Center */}
                    <circle 
                      cx={hoveredMonthIndex * (800 / 11)} 
                      cy={centerLine[hoveredMonthIndex] - (h_cosm[hoveredMonthIndex] + h_house[hoveredMonthIndex]) / 2 + h_cosm[hoveredMonthIndex] + h_house[hoveredMonthIndex] / 2} 
                      r="4.5" 
                      fill="oklch(78% .14 195)" 
                      stroke="var(--surface)" 
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>

              {/* Rich interactive HTML Tooltip overlay */}
              {hoveredMonthIndex !== null && tooltipPos && (
                <div 
                  className="absolute z-30 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg p-3 shadow-2xl border border-gray-700/50 pointer-events-none transition-all duration-100"
                  style={{
                    left: `${(tooltipPos.x / 800) * 100}%`,
                    top: `${Math.max(10, Math.min(130, tooltipPos.y - 130))}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="font-bold border-b border-gray-700/50 pb-1 mb-2 text-center text-[13px]">
                    {streamData[hoveredMonthIndex].monthLong}
                  </div>
                  <div className="space-y-1.5 min-w-[140px]">
                    <div className="flex justify-between items-center gap-4">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-[oklch(70%_.22_258)]"></span>
                        Cosmetics
                      </span>
                      <span className="font-semibold">${(streamData[hoveredMonthIndex].cosmetics * 10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-2 h-2 rounded-full bg-[oklch(83%_.14_195)]"></span>
                        Housewest
                      </span>
                      <span className="font-semibold">${(streamData[hoveredMonthIndex].housewest * 10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 border-t border-gray-700/50 pt-1.5 mt-1 font-bold text-white">
                      <span>This Year</span>
                      <span>${((streamData[hoveredMonthIndex].cosmetics + streamData[hoveredMonthIndex].housewest) * 10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 text-gray-400">
                      <span>Prev. Year</span>
                      <span className="font-medium">${(streamData[hoveredMonthIndex].prevTotal * 10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 text-[10px] pt-1 font-semibold border-t border-gray-800">
                      <span className="text-gray-400">YoY Change</span>
                      {(() => {
                        const current = streamData[hoveredMonthIndex].cosmetics + streamData[hoveredMonthIndex].housewest;
                        const prev = streamData[hoveredMonthIndex].prevTotal;
                        const pct = Math.round(((current - prev) / prev) * 100);
                        return (
                          <span className={pct >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {pct >= 0 ? `↑ +${pct}%` : `↓ ${pct}%`}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Interactive Month Selector X-Axis */}
            <div className="months">
              {streamData.map((d, i) => (
                <span 
                  key={d.month} 
                  className={`text-[10px] cursor-pointer transition-all duration-150 py-1 px-1.5 rounded ${
                    hoveredMonthIndex === i 
                      ? "text-[var(--ink)] bg-gray-100 font-bold scale-110" 
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  onMouseEnter={() => setHoveredMonthIndex(i)}
                  onMouseLeave={() => setHoveredMonthIndex(null)}
                >
                  {d.month.toUpperCase()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Module 4: Sales Performance Gauge */}
        {isVisible("w_sales_perf") && (
          <section className="panel gauge flex flex-col justify-between">
            <div className="section-title">
              Sales Performance <span className="info">i</span>
            </div>
            
            <div className="gauge-visual">
              <svg viewBox="0 0 300 220">
                <path d="M35 160A115 115 0 0 1 265 160" fill="none" stroke="oklch(93% .008 258)" strokeWidth="12" strokeLinecap="round"/>
                <path d="M35 160A115 115 0 0 1 265 160" fill="none" stroke="oklch(65% .22 258)" strokeWidth="12" strokeLinecap="round" strokeDasharray="360" strokeDashoffset="176"/>
                <path d="M58 160A92 92 0 0 1 242 160" fill="none" stroke="oklch(94% .055 195)" strokeWidth="10" strokeLinecap="round"/>
                <path d="M58 160A92 92 0 0 1 242 160" fill="none" stroke="oklch(72% .14 195)" strokeWidth="10" strokeLinecap="round" strokeDasharray="290" strokeDashoffset="160"/>
              </svg>
              <div className="gauge-center">
                <div className="gauge-number flex items-center justify-center gap-1">
                  17.9% <span className="trend up">↑</span>
                </div>
                <div className="gauge-caption">Since yesterday</div>
              </div>
            </div>

            <div className="legend">
              <div className="legend-row">
                <i className="swatch"></i>
                <span>Total Sales per day</span>
                <span className="text-right">For week</span>
              </div>
              <div className="legend-row">
                <i className="swatch pale"></i>
                <span>Average Sales</span>
                <span className="text-right">For today</span>
              </div>
            </div>

            <button className="see mt-4" onClick={() => onNavigateTo(ActiveView.Performance)}>
              See Details <ArrowRight size={14} />
            </button>
          </section>
        )}

        {/* Module 5: Total visits hourly */}
        {isVisible("w_hourly_visits") && (
          <section className="panel visits flex flex-col justify-between relative">
            <div className="visit-top">
              <div className="visit-copy">
                <div className="people">
                  <UsersRound size={20} />
                </div>
                <div>
                  <div className="section-title flex items-center gap-1.5">
                    Total visits by hourly 
                    <span className="info" title="Hourly user traffic intensity throughout the week">i</span>
                    {trafficLoading && (
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                    {trafficRefreshed && (
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.2 rounded-md animate-fade-in">
                        Refreshed!
                      </span>
                    )}
                  </div>
                  <div className="visit-num">
                    {trafficLoading ? "Refreshing..." : "288,822"} <span className="trend up">↑4%</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  className="more p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" 
                  onClick={() => setVisitsMoreOpen(!visitsMoreOpen)}
                >
                  <Ellipsis size={16} />
                </button>
                {visitsMoreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setVisitsMoreOpen(false)} />
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 text-xs font-medium text-gray-600">
                      <button
                        type="button"
                        onClick={() => {
                          setVisitsMoreOpen(false);
                          setTrafficLoading(true);
                          setTrafficRefreshed(false);
                          setTimeout(() => {
                            setTrafficLoading(false);
                            setTrafficRefreshed(true);
                            setTimeout(() => setTrafficRefreshed(false), 2000);
                          }, 800);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-indigo-50/20 hover:text-[var(--accent)] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCw size={13} /> Refresh Traffic Map
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVisitsMoreOpen(false);
                          const csv = "data:text/csv;charset=utf-8,Day,Hour,Intensity\nMonday,8AM,Low\nMonday,12PM,Medium\nTuesday,2PM,High\nWednesday,8AM,Low\nWednesday,2PM,High\n";
                          const link = document.createElement("a");
                          link.setAttribute("href", encodeURI(csv));
                          link.setAttribute("download", "hourly_traffic_data.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-indigo-50/20 hover:text-[var(--accent)] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Download size={13} /> Export Section CSV
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="heatmap relative">
              <span className="day">MON</span>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>

              <span className="day">TUE</span>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat hot"></i>
              <i className="heat"></i>

              <span className="day">WED</span>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>
              <i className="heat hot"></i>
              <i className="heat"></i>

              <span className="day">THU</span>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat hot"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>
              <i className="heat"></i>

              <span className="day">FRI</span>
              <i className="heat mid"></i>
              <i className="heat mid"></i>
              <i className="heat hot"></i>
              <i className="heat hot"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>

              <span className="day">SAT</span>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>

              <span className="day">SUN</span>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              <i className="heat mid"></i>
              <i className="heat"></i>
              <i className="heat"></i>
              
              <div className="heat-note" style={{ top: "45px" }}>♧ 3,880 (8AM)</div>
            </div>
          </section>
        )}

        {/* Module 6: Top Products */}
        {isVisible("w_top_products") && (
          <section className="panel products">
            <div className="products-head">
              <div className="section-title">
                Top Products <span className="info">i</span>
              </div>
              <button className="link flex items-center gap-1 text-xs" onClick={() => onNavigateTo(ActiveView.Products)}>
                See Details <ArrowRight size={14} />
              </button>
            </div>

            <div className="product-body">
              <div className="feature">
                <div className="feature-icon font-bold">▥</div>
                <div className="feature-name">Biled Shorts</div>
                <div className="feature-price">$4,730.33</div>
                <div className="progress">
                  <i style={{ width: "58%" }}></i>
                </div>
                <div className="tiny">12% targets achieved</div>
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = products.filter((p) => {
                        const statusMatch = filters?.productStatus ? filters.productStatus.includes(p.status) : true;
                        const revenueMatch = filters?.minSales ? p.revenue >= filters.minSales : true;
                        return statusMatch && revenueMatch;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-400 text-xs font-semibold">
                              No products match the selected filters.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.slice(0, 3).map((p, idx) => (
                        <tr key={p.id || idx}>
                          <td><b>{p.name}</b></td>
                          <td>{p.sales} pcs</td>
                          <td>${p.revenue.toLocaleString()}</td>
                          <td>{p.stock}</td>
                          <td>
                            <span className={`status ${p.status === "Out of stock" ? "out" : ""}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </div>
    </section>
  );
}
