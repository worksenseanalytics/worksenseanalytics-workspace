/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Settings, Save, Check } from "lucide-react";

interface SettingsViewProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  username: string;
  setUsername: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

export default function SettingsView({
  businessName,
  setBusinessName,
  username,
  setUsername,
  userEmail,
  setUserEmail
}: SettingsViewProps) {
  const [bName, setBName] = useState(businessName);
  const [uName, setUName] = useState(username);
  const [uEmail, setUEmail] = useState(userEmail);
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [bio, setBio] = useState("Workspace administrator and chief of analytics strategy.");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessName(bName);
    setUsername(uName);
    setUserEmail(uEmail);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="content font-sans">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">System Config</div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Configure and customize your workspace parameters</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Left Settings Navigation Tabs */}
        <aside className="settings-nav panel">
          <button 
            type="button"
            className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Settings
          </button>
          <button 
            type="button"
            className={`settings-tab ${activeTab === "corporate" ? "active" : ""}`}
            onClick={() => setActiveTab("corporate")}
          >
            Corporate Identity
          </button>
          <button 
            type="button"
            className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            System Alerts
          </button>
        </aside>

        {/* Right Form Panel */}
        <main className="form-panel panel">
          <form onSubmit={handleSave} className="form-grid">
            {activeTab === "profile" && (
              <>
                <div className="field">
                  <label htmlFor="set-username">Username</label>
                  <input 
                    id="set-username" 
                    value={uName} 
                    onChange={(e) => setUName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="set-email">Email Address</label>
                  <input 
                    id="set-email" 
                    type="email"
                    value={uEmail} 
                    onChange={(e) => setUEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field full">
                  <label>Bio Profile</label>
                  <textarea 
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </>
            )}

            {activeTab === "corporate" && (
              <>
                <div className="field full">
                  <label htmlFor="set-business">Business Name</label>
                  <input 
                    id="set-business" 
                    value={bName} 
                    onChange={(e) => setBName(e.target.value)}
                    required
                  />
                </div>
                <div className="field full">
                  <label htmlFor="set-plan">Active Plan</label>
                  <select id="set-plan" className="select" style={{ height: "40px", width: "100%" }}>
                    <option>Free Plan</option>
                    <option>Premium Enterprise</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <div className="field full space-y-3" style={{ padding: "10px 0" }}>
                <label className="flex items-center gap-3 cursor-pointer" style={{ fontWeight: "normal" }}>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                  <span>Email me when custom monthly sales target is exceeded</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer" style={{ fontWeight: "normal" }}>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500" />
                  <span>Notify me immediately upon new customer registration</span>
                </label>
              </div>
            )}

            <div className="form-footer">
              <button type="submit" className="btn dark">
                {saved ? <Check size={14} className="text-green-400" /> : <Save size={14} />}
                <span>{saved ? "Changes Saved!" : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
}
