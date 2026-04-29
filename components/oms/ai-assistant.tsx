"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Send, ChevronRight } from "lucide-react";

const quickActions = [
  { label: "Fix workforce gap", path: "/scenario/builder", category: "Action" },
  { label: "Optimize cost", path: "/financial/overview", category: "Action" },
  { label: "Run scenario", path: "/scenario/builder", category: "Planning" },
  { label: "View scenarios", path: "/scenario/directory", category: "Analytics" },
  { label: "Check pending approvals", path: "/scenario/directory", category: "Workflow" },
];

const aiResponses: Record<string, string> = {
  "Fix workforce gap":
    "Technology has a gap of 2 critical roles. I recommend fast-tracking pipelines R001 (Software Engineer) and R006 (Data Scientist). Estimated fill time: 3–4 weeks with executive sponsorship.",
  "Optimize cost":
    "Operations is at 91% budget utilization. Marketing has Rp 42 Juta under-utilization. Recommend reallocation + a hiring freeze on G3 roles in non-critical departments to save Rp 120 Juta in Q2.",
  "Run scenario":
    "3 scenarios are pre-modeled: (1) Dept merge — saves Rp 180 Juta/tahun, (2) Remote-first — reduces office cost by 22%, (3) Upskilling in lieu of hiring — fills 5 roles internally. Navigate to Scenario Planning to run simulations.",
  default:
    "I can help you analyze workforce gaps, optimize costs, generate scenarios, or review governance risks. What would you like to focus on today?",
};

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello, Sri. I have 4 new recommendations for your review. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleAction = (action: (typeof quickActions)[0]) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: action.label },
      { role: "assistant", text: aiResponses[action.label] || aiResponses.default },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "assistant", text: aiResponses.default },
    ]);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          style={{ background: "var(--primary)" }}
        >
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          style={{ maxHeight: "calc(100vh - 48px)" }}>
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border"
            style={{ background: "var(--primary)" }}>
            <Sparkles className="w-4 h-4 text-white" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">OM+ AI Assistant</p>
              <p className="text-xs text-blue-200">Context-aware · Real-time</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "var(--primary)", color: "white" }
                      : { background: "var(--muted)", color: "var(--foreground)" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="px-4 py-3 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested Actions</p>
            <div className="space-y-1.5">
              {quickActions.slice(0, 3).map((a) => (
                <button
                  key={a.label}
                  onClick={() => handleAction(a)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-card rounded-lg text-xs font-medium text-foreground hover:bg-secondary transition-colors border border-border"
                >
                  <span>{a.label}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-lg text-white transition-colors"
              style={{ background: "var(--primary)" }}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
