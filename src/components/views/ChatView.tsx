/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Search, Check, Circle, Phone, Video, Info } from "lucide-react";
import { ChatMessage } from "../../types";

interface ChatViewProps {
  initialUnreadCount: number;
  onClearUnread: () => void;
}

interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: boolean;
  online: boolean;
  messages: ChatMessage[];
}

export default function ChatView({ initialUnreadCount, onClearUnread }: ChatViewProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "s1",
      name: "Sarah Connor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80",
      lastMsg: "Do we have the premium stock ready?",
      time: "5m ago",
      unread: true,
      online: true,
      messages: [
        { id: "m1", sender: "agent", text: "Hello Sarah, your order of T-Shirts has been processed.", timestamp: "10:30 AM" },
        { id: "m2", sender: "user", text: "Awesome! What about the shipment ETA?", timestamp: "10:32 AM" },
        { id: "m3", sender: "agent", text: "It should arrive within three business days. We will supply the code.", timestamp: "10:33 AM" },
        { id: "m4", sender: "user", text: "Do we have the premium stock ready?", timestamp: "10:35 AM" }
      ]
    },
    {
      id: "s2",
      name: "David Beckham",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80",
      lastMsg: "Thank you for the quick support!",
      time: "2h ago",
      unread: false,
      online: false,
      messages: [
        { id: "m5", sender: "user", text: "Hey! Can I change the invoice name?", timestamp: "Yesterday" },
        { id: "m6", sender: "agent", text: "Yes, please supply the company details and I will update it.", timestamp: "Yesterday" },
        { id: "m7", sender: "user", text: "Thank you for the quick support!", timestamp: "Yesterday" }
      ]
    },
    {
      id: "s3",
      name: "Michael Jordan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&fit=crop&q=80",
      lastMsg: "Pending order is solved now.",
      time: "1d ago",
      unread: false,
      online: true,
      messages: [
        { id: "m8", sender: "user", text: "The transaction is failing on Checkout.", timestamp: "Monday" },
        { id: "m9", sender: "agent", text: "I can see the portal was on maintenance. Please retry now.", timestamp: "Monday" },
        { id: "m10", sender: "user", text: "Pending order is solved now.", timestamp: "Monday" }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState("s1");
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages]);

  // Clear unread on session change
  useEffect(() => {
    if (activeSession.unread) {
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, unread: false } : s));
      onClearUnread();
    }
  }, [activeSessionId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMsg: ChatMessage = {
        id: "m_new_" + Date.now(),
        sender: "agent", // "agent" represents ME
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            lastMsg: inputText,
            time: "Just now",
            messages: [...s.messages, newMsg]
          };
        }
        return s;
      }));

      setInputText("");

      // Simulated customer reply after 1.5 seconds
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: "m_reply_" + Date.now(),
          sender: "user", // "user" is the CLIENT
          text: "Got it, thank you for clarifying that!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              lastMsg: replyMsg.text,
              time: "Just now",
              messages: [...s.messages, replyMsg]
            };
          }
          return s;
        }));
      }, 1500);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="content font-sans">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">Customer Support</div>
          <h1 className="page-title">Live Chat</h1>
          <p className="page-sub">Engage with your active consumers and resolve issues in real-time</p>
        </div>
      </div>

      <div className="panel chat-layout">
        
        {/* Chat sidebar list */}
        <div className="chat-list">
          <div className="chat-search">
            <input 
              placeholder="Search chat sessions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowY: "auto", maxHeight: "500px" }}>
            {filteredSessions.map((sess) => {
              const isSelected = sess.id === activeSessionId;
              return (
                <div 
                  key={sess.id}
                  className={`chat-person ${isSelected ? "selected" : ""}`}
                  onClick={() => setActiveSessionId(sess.id)}
                >
                  <div className="avatar" style={{ position: "relative", width: "36px", height: "36px", borderRadius: "8px", background: "oklch(85% .05 43)" }}>
                    {sess.name.slice(0, 2).toUpperCase()}
                    {sess.online && (
                      <span 
                        style={{ 
                          position: "absolute", 
                          bottom: "-2px", 
                          right: "-2px", 
                          width: "10px", 
                          height: "10px", 
                          background: "var(--green)", 
                          borderRadius: "50%", 
                          border: "2px solid var(--surface)" 
                        }} 
                      />
                    )}
                  </div>
                  <div className="list-main">
                    <div className="list-title flex justify-between" style={{ fontSize: "13px" }}>
                      <span style={{ fontWeight: sess.unread ? "700" : "600" }}>{sess.name}</span>
                      <span className="text-[10px] text-gray-400" style={{ fontWeight: "normal" }}>{sess.time}</span>
                    </div>
                    <div className="list-meta text-xs text-gray-400 truncate" style={{ fontWeight: sess.unread ? "600" : "normal" }}>
                      {sess.lastMsg}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat main screen */}
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="avatar" style={{ width: "36px", height: "36px", borderRadius: "8px" }}>
              {activeSession.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="list-main">
              <div className="list-title" style={{ fontSize: "14px", fontWeight: "700" }}>{activeSession.name}</div>
              <div className="list-meta text-[11px] text-green-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                {activeSession.online ? "Online Now" : "Away"}
              </div>
            </div>

            <div className="flex gap-2" style={{ marginLeft: "auto" }}>
              <button className="btn" style={{ width: "32px", height: "32px", padding: 0, borderRadius: "6px" }} onClick={() => alert("Calling...")}>
                <Phone size={13} />
              </button>
              <button className="btn" style={{ width: "32px", height: "32px", padding: 0, borderRadius: "6px" }} onClick={() => alert("Starting video...")}>
                <Video size={13} />
              </button>
              <button className="btn" style={{ width: "32px", height: "32px", padding: 0, borderRadius: "6px" }} onClick={() => alert("Details panel...")}>
                <Info size={13} />
              </button>
            </div>
          </div>

          {/* Messages trails */}
          <div className="chat-messages" style={{ overflowY: "auto", height: "380px" }}>
            {activeSession.messages.map((msg) => {
              const isMe = msg.sender === "agent";
              return (
                <div 
                  key={msg.id} 
                  className={`bubble ${isMe ? "me" : ""}`}
                  style={{
                    alignSelf: isMe ? "end" : "start",
                    background: isMe ? "var(--accent)" : "var(--canvas)",
                    color: isMe ? "var(--surface)" : "var(--ink)"
                  }}
                >
                  <div style={{ fontSize: "13px" }}>{msg.text}</div>
                  <div className="text-[9px] text-right mt-1 opacity-70" style={{ color: isMe ? "var(--surface)" : "var(--muted)" }}>
                    {msg.timestamp}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Compose input footer */}
          <form className="chat-compose" onSubmit={handleSendMessage}>
            <input 
              placeholder={`Type reply to ${activeSession.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button className="btn dark" type="submit" style={{ height: "40px", padding: "0 18px" }}>
              <Send size={14} />
              <span>Send</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
