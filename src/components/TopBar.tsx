/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Bell, Plus, Download, X, Check, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface TopBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onExport: () => void;
  onInviteMember: (name: string, email: string) => void;
  members: Array<{ name: string; avatar: string }>;
}

export default function TopBar({ 
  onSearch, 
  searchQuery, 
  onExport, 
  onInviteMember,
  members 
}: TopBarProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New sales transaction",
      desc: "Cosmetics order of $430 registered successfully.",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: "2",
      title: "Workspace Member joined",
      desc: "Maria Sanchez has activated their member account.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "3",
      title: "Export completed",
      desc: "Your weekly Analytics data is ready for download.",
      time: "1 day ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteName.trim() && inviteEmail.trim()) {
      onInviteMember(inviteName, inviteEmail);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowInviteModal(false);
        setInviteName("");
        setInviteEmail("");
      }, 1500);
    }
  };

  return (
    <header className="topbar" id="top-bar" style={{ marginLeft: "10px" }}>
      <label className="search">
        <Search width="18" />
        <input 
          id="global-search" 
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        <span className="kbd">F⌘</span>
      </label>

      <div className="top-actions">
        {/* Faces stack */}
        <div className="faces" onClick={() => setShowInviteModal(true)} style={{ cursor: "pointer" }}>
          <div className="avatar">A</div>
          <div className="avatar" style={{ background: "oklch(84% .07 165)", color: "oklch(35% .08 165)" }}>M</div>
          <div className="avatar" style={{ background: "oklch(86% .06 270)", color: "oklch(35% .08 270)" }}>S</div>
        </div>

        {/* Action button: add widget / trigger invite modal */}
        <button 
          className="icon-btn" 
          onClick={() => setShowInviteModal(true)}
          title="Invite member"
        >
          <Plus size={18} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            className="icon-btn relative"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--red)] rounded-full animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Close overlay when clicking outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.25 }}
                  className="absolute right-0 mt-3 w-80 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--r)] shadow-[var(--shadow)] z-50 p-4 space-y-3"
                  style={{ top: "100%" }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                    <span className="font-semibold text-xs text-[var(--ink)] tracking-tight">Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] text-[var(--accent)] hover:underline font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearAll}
                          className="text-[10px] text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-xs flex flex-col items-center justify-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                          <Check size={16} />
                        </div>
                        <span>All caught up!</span>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkAsRead(n.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group flex justify-between gap-2 ${
                            n.unread 
                              ? "bg-[var(--accent-soft)]/20 border-[var(--accent-soft)] hover:bg-[var(--accent-soft)]/30" 
                              : "bg-[var(--canvas)] border-transparent hover:bg-gray-100/50"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {n.unread && <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full shrink-0 animate-pulse" />}
                              <p className={`text-[11px] leading-tight truncate ${n.unread ? "font-semibold text-[var(--ink)]" : "text-gray-500"}`}>
                                {n.title}
                              </p>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-normal">
                              {n.desc}
                            </p>
                            <span className="text-[9px] text-gray-400 font-mono block mt-1">
                              {n.time}
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => handleClearNotification(n.id, e)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-0.5 self-start cursor-pointer"
                            title="Dismiss"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Export Button */}
        <button className="export" onClick={onExport}>
          <span>Export</span>
          <Download width="16" />
        </button>
      </div>

      {/* Invite Modal Overlay */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
              onClick={() => setShowInviteModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="panel panel-pad relative z-10 w-full max-w-md"
              id="invite-member-modal"
            >
              <div className="panel-head">
                <div className="section-title flex items-center gap-2">
                  <Users size={18} className="text-[var(--accent)]" />
                  <span>Invite Team Member</span>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="more"
                  style={{ width: "28px", height: "28px" }}
                >
                  <X size={14} />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3">
                    <Check size={24} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">Invitation Sent!</p>
                  <p className="text-xs text-gray-400 mt-1">An invitation has been sent to {inviteEmail}</p>
                </div>
              ) : (
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div className="field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. john@worksense.ai"
                    />
                  </div>

                  <div className="form-footer">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn dark"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
