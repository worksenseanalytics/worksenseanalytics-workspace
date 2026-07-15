/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, Check } from "lucide-react";

export default function FeedbackView() {
  const [rating, setRating] = useState(4);
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desc.trim()) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setDesc("");
        setRating(4);
      }, 2500);
    }
  };

  return (
    <section className="content font-sans">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">User opinion</div>
          <h1 className="page-title">Feedback</h1>
          <p className="page-sub">Tell us how we can improve Worksense dashboard engine</p>
        </div>
      </div>

      <div className="panel panel-pad feedback-box">
        {sent ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Feedback Received!</h3>
            <p className="text-xs text-gray-400">Thank you for helping us sculpt a better analytical workspace.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field full">
              <label>How satisfied are you with this workspace?</label>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button 
                    key={num}
                    type="button" 
                    className={rating === num ? "selected" : ""}
                    onClick={() => setRating(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="field full">
              <label htmlFor="feedback-text">Feedback details</label>
              <textarea 
                id="feedback-text" 
                placeholder="Write what went wrong, or what you would love to see..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            
            <div className="form-footer">
              <button type="submit" className="btn dark">
                <Send size={13} />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
