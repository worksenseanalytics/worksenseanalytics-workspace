/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserRound, Save, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AccountView() {
  const [firstName, setFirstName] = useState("Ikhsan");
  const [lastName, setLastName] = useState("Kamal");
  const [emailAddress, setEmailAddress] = useState("ikhsan@worksense.ai");
  const [role, setRole] = useState("Admin");
  const [bio, setBio] = useState("Leading growth and operations at Worksense Analytics.");

  const [activeTab, setActiveTab] = useState<"Profile" | "Security" | "Notifications">("Profile");
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    triggerToast("Perubahan berhasil disimpan");
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCancel = () => {
    setFirstName("Ikhsan");
    setLastName("Kamal");
    setEmailAddress("ikhsan@worksense.ai");
    setRole("Admin");
    setBio("Leading growth and operations at Worksense Analytics.");
    triggerToast("Perubahan dibatalkan");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2200);
  };

  return (
    <section className="content font-sans">
      {/* Toast Alert matching mockup */}
      <div className={`toast ${showToast ? "show" : ""}`} id="toast">
        {showToast}
      </div>

      {/* Page Heading matching the markup exactly */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worksense workspace</div>
          <h1 className="page-title">Account</h1>
          <p className="page-sub">Manage your profile and workspace identity</p>
        </div>
        <div className="heading-actions">
          <button className="btn accent" onClick={handleSave}>
            {isSaved ? <Check size={14} /> : <Save size={14} />}
            Save changes
          </button>
        </div>
      </div>

      {/* Settings Layout matching HTML structure */}
      <div className="settings-layout">
        <nav className="panel settings-nav flex flex-col gap-1">
          {(["Profile", "Security", "Notifications"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`settings-tab text-left text-sm ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                triggerToast(`${tab} dibuka`);
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="panel form-panel">
          {activeTab === "Profile" && (
            <form onSubmit={handleSave}>
              <div className="panel-head">
                <div>
                  <div className="section-title text-base font-semibold">Profile details</div>
                  <div className="muted text-xs text-gray-400 mt-1">
                    This information is visible to your workspace members.
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label className="text-xs font-semibold">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>
                <div className="field">
                  <label className="text-xs font-semibold">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>
                <div className="field">
                  <label className="text-xs font-semibold">Email address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm"
                  />
                </div>
                <div className="field">
                  <label className="text-xs font-semibold">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="select w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm h-[40px]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
                <div className="field full">
                  <label className="text-xs font-semibold">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-[var(--line)] rounded-lg p-2 bg-[var(--surface)] text-sm h-[100px] resize-y"
                  />
                </div>
              </div>

              <div className="form-footer flex justify-end gap-2 pt-4 border-t border-[var(--line)] mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn px-4 py-2 text-xs border border-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn accent px-4 py-2 text-xs bg-[var(--accent)] text-[var(--surface)] rounded-lg font-semibold"
                >
                  Save changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "Security" && (
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-base">Security preferences</h3>
              <p className="text-xs text-gray-400">Configure authentication credentials and login sessions.</p>
              <div className="border border-[var(--line)] p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-[var(--line)] pb-2">
                  <span>Two-factor authentication</span>
                  <span className="status">Enabled</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span>Last password change</span>
                  <span className="text-gray-400">3 months ago</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-base">Notification settings</h3>
              <p className="text-xs text-gray-400">Manage communication alerts and daily summary schedules.</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent)]" />
                  <span>Receive weekly performance updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--accent)]" />
                  <span>Notify upon customer feedback creation</span>
                </label>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
