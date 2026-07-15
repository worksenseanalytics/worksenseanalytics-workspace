/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Check, Grid, Eye, EyeOff } from "lucide-react";
import { WidgetConfig } from "../../types";
import { motion, AnimatePresence } from "motion/react";

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
}

export default function AddWidgetModal({ isOpen, onClose, widgets, onToggleWidget }: AddWidgetModalProps) {
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
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-full border-l border-gray-50"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Grid size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-none">Dashboard Widgets</h3>
                    <span className="text-[10px] text-gray-400 mt-1 block">Toggle metrics and graph modules</span>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body lists */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(["Overview", "Charts", "Tables"] as const).map((category) => {
                  const catWidgets = widgets.filter(w => w.category === category);
                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        {category} MODULES
                      </h4>
                      <div className="space-y-2">
                        {catWidgets.map((widget) => (
                          <div 
                            key={widget.id}
                            onClick={() => onToggleWidget(widget.id)}
                            className={`p-3.5 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                              widget.visible 
                                ? "bg-indigo-50/10 border-indigo-200/50 hover:border-indigo-300" 
                                : "bg-white border-gray-100 hover:bg-gray-50/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`p-1.5 rounded-lg ${widget.visible ? "bg-indigo-100/50 text-[var(--accent)]" : "bg-gray-100 text-gray-400"}`}>
                                {widget.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                              </span>
                              <span className={`text-xs font-semibold ${widget.visible ? "text-gray-900" : "text-gray-500"}`}>
                                {widget.title}
                              </span>
                            </div>

                            {/* Checkbox indicator */}
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              widget.visible 
                                ? "bg-[var(--accent)] border-[var(--accent)] text-white" 
                                : "border-gray-200 bg-white"
                            }`}>
                              {widget.visible && <Check size={12} strokeWidth={3} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/50 text-center">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-deep)] text-white text-xs font-semibold rounded-xl shadow-sm transition-all shadow-indigo-500/10 cursor-pointer"
                >
                  Done customizing
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
