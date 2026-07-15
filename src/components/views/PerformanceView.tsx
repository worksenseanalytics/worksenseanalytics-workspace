/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ChevronDown, 
  Plus, 
  X, 
  TrendingUp, 
  Package, 
  UserPlus, 
  Target, 
  Sparkles 
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Goal {
  id: string;
  name: string;
  progress: number;
  current: string;
  target: string;
}

interface Highlight {
  id: string;
  iconType: "trending" | "package" | "user";
  title: string;
  subtitle: string;
}

export default function PerformanceView() {
  const [timeRange, setTimeRange] = useState("Q3 2026");
  const [showAddModal, setShowAddModal] = useState(false);

  // Default goals matching veselty-workspace-complete.html
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "g1",
      name: "Monthly revenue",
      progress: 82,
      current: "$43,630",
      target: "$53,000"
    },
    {
      id: "g2",
      name: "New customers",
      progress: 68,
      current: "1,284",
      target: "1,900"
    },
    {
      id: "g3",
      name: "Repeat orders",
      progress: 91,
      current: "1,146",
      target: "1,260"
    }
  ]);

  // Default highlights matching veselty-workspace-complete.html
  const [highlights, setHighlights] = useState<Highlight[]>([
    {
      id: "h1",
      iconType: "trending",
      title: "Active sales grew 12%",
      subtitle: "Best week since April"
    },
    {
      id: "h2",
      iconType: "package",
      title: "Inventory accuracy improved",
      subtitle: "Up to 96.2% this month"
    },
    {
      id: "h3",
      iconType: "user",
      title: "1,284 new customers",
      subtitle: "14% above target"
    }
  ]);

  // Form states
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalCurrent, setNewGoalCurrent] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalProgress, setNewGoalProgress] = useState(50);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    const newGoal: Goal = {
      id: `g_${Date.now()}`,
      name: newGoalName,
      progress: Number(newGoalProgress),
      current: newGoalCurrent.trim() || "0",
      target: newGoalTarget.trim() || "100"
    };

    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    setNewGoalName("");
    setNewGoalCurrent("");
    setNewGoalTarget("");
    setNewGoalProgress(50);

    // Also add a corresponding highlight for the new goal!
    const newHighlight: Highlight = {
      id: `h_${Date.now()}`,
      iconType: "trending",
      title: `New Target Configured: ${newGoalName}`,
      subtitle: `Target initialized at ${newGoalProgress}% progress`
    };
    setHighlights([newHighlight, ...highlights]);
  };

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "trending":
        return <TrendingUp size={16} className="text-[var(--accent-deep)]" />;
      case "package":
        return <Package size={16} className="text-[var(--accent-deep)]" />;
      case "user":
        return <UserPlus size={16} className="text-[var(--accent-deep)]" />;
      default:
        return <Target size={16} className="text-[var(--accent-deep)]" />;
    }
  };

  return (
    <section className="content font-sans">
      {/* Page Heading matching the markup exactly */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Performance</h1>
          <p className="page-sub">Track targets across teams and channels</p>
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
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q1 2026">Q1 2026</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>

          <button className="btn dark" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Add goal
          </button>
        </div>
      </div>

      {/* Main Grid Area matching performance-grid design */}
      <div className="performance-grid">
        {/* Left Side: Team Goals panel */}
        <section className="panel panel-pad">
          <div className="panel-head">
            <div>
              <div className="section-title">Team goals</div>
              <div className="muted">Progress through July 14, 2026</div>
            </div>
            <span className="trend up">On track</span>
          </div>

          <div className="goals-list">
            {goals.map((goal) => (
              <div className="goal" key={goal.id}>
                <div className="goal-top">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-value">{goal.progress}%</span>
                </div>
                <div className="muted">
                  {goal.current} of {goal.target}
                </div>
                <div className="goal-track">
                  <i style={{ width: `${goal.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Side: Latest highlights panel */}
        <section className="panel panel-pad flex flex-col">
          <div className="section-title mb-4">Latest highlights</div>
          <div className="list" style={{ marginTop: "10px" }}>
            {highlights.map((item) => (
              <div key={item.id} className="list-row flex items-center gap-3 p-3 hover:bg-[var(--canvas)] transition-colors duration-150 rounded-lg">
                <div className="people shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-soft)]">
                  {getHighlightIcon(item.iconType)}
                </div>
                <div className="list-main">
                  <div className="list-title font-semibold text-sm">{item.title}</div>
                  <div className="list-meta text-xs text-gray-400 mt-0.5">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add New Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="panel panel-pad relative z-10 w-full max-w-md"
              id="add-goal-modal"
            >
              <div className="panel-head flex justify-between items-center mb-4">
                <div className="section-title flex items-center gap-2 font-bold text-base">
                  <Target size={18} className="text-[var(--accent)]" />
                  <span>Configure New Target Goal</span>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="more flex items-center justify-center border border-gray-200 rounded-lg"
                  style={{ width: "28px", height: "28px" }}
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Goal / KPI Name</label>
                  <input
                    type="text"
                    required
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="e.g. Return rate reduction"
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>

                <div className="form-grid grid grid-cols-2 gap-3">
                  <div className="field">
                    <label className="text-xs font-semibold block mb-1">Current Value</label>
                    <input
                      type="text"
                      value={newGoalCurrent}
                      onChange={(e) => setNewGoalCurrent(e.target.value)}
                      placeholder="e.g. $10,200"
                      className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                    />
                  </div>

                  <div className="field">
                    <label className="text-xs font-semibold block mb-1">Target Value</label>
                    <input
                      type="text"
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(e.target.value)}
                      placeholder="e.g. $15,000"
                      className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Progress Percentage ({newGoalProgress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newGoalProgress}
                    onChange={(e) => setNewGoalProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                  />
                </div>

                <div className="form-footer flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn px-4 py-2 text-xs border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn dark px-4 py-2 text-xs bg-[var(--ink)] text-[var(--surface)] rounded-lg"
                  >
                    Create Target Goal
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
