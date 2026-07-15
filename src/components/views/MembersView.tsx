/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserPlus, Search, MoreHorizontal, X, ShieldAlert, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Member {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
}

export default function MembersView() {
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Exact default member list from veselty-workspace-complete.html
  const [members, setMembers] = useState<Member[]>([
    {
      id: "m1",
      initials: "IK",
      name: "Ikhsan Kamal",
      email: "ikhsan@worksense.ai",
      role: "Admin"
    },
    {
      id: "m2",
      initials: "AP",
      name: "Ari Pratama",
      email: "ari@worksense.ai",
      role: "Editor"
    },
    {
      id: "m3",
      initials: "MN",
      name: "Mina Noor",
      email: "mina@worksense.ai",
      role: "Editor"
    },
    {
      id: "m4",
      initials: "RK",
      name: "Raka K",
      email: "raka@worksense.ai",
      role: "Viewer"
    },
    {
      id: "m5",
      initials: "DS",
      name: "Dina S",
      email: "dina@worksense.ai",
      role: "Viewer"
    }
  ]);

  // Invite Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Editor");
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    // Get initials
    const initials = newName
      .trim()
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

    const newMem: Member = {
      id: `m_${Date.now()}`,
      initials,
      name: newName,
      email: newEmail,
      role: newRole
    };

    setMembers([...members, newMem]);
    setShowInviteModal(false);
    setNewName("");
    setNewEmail("");
    setNewRole("Editor");
    triggerToast(`Undangan terkirim ke ${newEmail}`);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2200);
  };

  const filteredMembers = members.filter(m => {
    const s = search.toLowerCase();
    return m.name.toLowerCase().includes(s) || 
           m.email.toLowerCase().includes(s) || 
           m.role.toLowerCase().includes(s);
  });

  return (
    <section className="content font-sans">
      {/* Toast Alert matching mockup */}
      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        {showToast}
      </div>

      {/* Page Heading matching mockup markup */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Members</h1>
          <p className="page-sub">Invite teammates and control access</p>
        </div>
        <div className="heading-actions">
          <button className="btn dark" onClick={() => setShowInviteModal(true)}>
            <UserPlus size={14} />
            Invite member
          </button>
        </div>
      </div>

      {/* Section panel matching HTML structure */}
      <section className="panel">
        <div className="toolbar flex items-center justify-between p-4 border-b border-[var(--line)]">
          <div>
            <b className="text-sm">Workspace members</b>
            <span className="muted text-xs text-gray-400"> · {members.length} people</span>
          </div>
          <input
            className="filter-input text-xs"
            placeholder="Search members"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* List layout of member-cards */}
        <div className="list">
          {filteredMembers.map((member) => {
            // Apply unique styles for JK, AP, MN matching design
            let avatarStyle = {};
            if (member.initials === "AP") {
              avatarStyle = { background: "oklch(84% .07 165)", color: "oklch(35% .08 165)" };
            } else if (member.initials === "MN") {
              avatarStyle = { background: "oklch(86% .06 270)", color: "oklch(35% .08 270)" };
            }

            return (
              <div key={member.id} className="member-card flex items-center justify-between p-4 border-b border-[var(--line)] last:border-0 hover:bg-[var(--canvas)] transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <div className="avatar shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[oklch(79% .08 38)] text-[oklch(32% .08 38)] font-bold text-xs" style={avatarStyle}>
                    {member.initials}
                  </div>
                  <div className="member-info">
                    <div className="member-name font-semibold text-sm">{member.name}</div>
                    <div className="member-email text-xs text-gray-400 mt-0.5">{member.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="role px-2.5 py-1 text-xs border border-[var(--line)] rounded-lg text-gray-600 bg-white">
                    {member.role}
                  </span>
                  <button 
                    onClick={() => triggerToast(`Aksi menu untuk ${member.name}`)}
                    className="more flex items-center justify-center border border-gray-200 rounded-lg"
                    style={{ width: "32px", height: "32px" }}
                  >
                    <MoreHorizontal size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredMembers.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-xs">
              No members found matching "{search}".
            </div>
          )}
        </div>
      </section>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowInviteModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="panel panel-pad relative z-10 w-full max-w-md"
              id="invite-member-modal"
            >
              <div className="panel-head flex justify-between items-center mb-4">
                <div className="section-title flex items-center gap-2 font-bold text-base">
                  <UserPlus size={18} className="text-[var(--accent)]" />
                  <span>Invite Workspace Member</span>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="more flex items-center justify-center border border-gray-200 rounded-lg"
                  style={{ width: "28px", height: "28px" }}
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4">
                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>

                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. john@worksense.ai"
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>

                <div className="field">
                  <label className="text-xs font-semibold block mb-1">Workspace Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="select w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm h-[40px]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <div className="form-footer flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="btn px-4 py-2 text-xs border border-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn dark px-4 py-2 text-xs bg-[var(--ink)] text-[var(--surface)] rounded-lg"
                  >
                    Send Invitation
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
