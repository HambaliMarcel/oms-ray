"use client";

import type { ReactNode } from "react";
import { Bell, Search, Settings } from "lucide-react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: string[];
  userName?: string;
  userRole?: string;
  actions?: ReactNode;
}

export function TopBar({
  title,
  subtitle,
  breadcrumb,
  userName = "Adriana V.",
  userRole = "CHRO Office",
  actions,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#F8FAFC]/95 px-8 py-4 backdrop-blur-sm relative">
      <div className="absolute right-8 top-3 flex items-center gap-1">
        {actions}
        <button className="h-10 w-10 rounded-xl text-[#64748B] transition-colors hover:bg-[#EEF2FF]">
          <Bell className="mx-auto h-4 w-4" />
        </button>
        <button className="h-10 w-10 rounded-xl text-[#64748B] transition-colors hover:bg-[#EEF2FF]">
          <Settings className="mx-auto h-4 w-4" />
        </button>
        <div className="ml-2 flex items-center gap-3 rounded-xl px-2 py-1">
          <div className="h-9 w-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-semibold">
            AV
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#0F172A]">{userName}</p>
            <p className="text-xs text-[#64748B]">{userRole}</p>
          </div>
        </div>
      </div>
      {(breadcrumb || title) && (
        <div className="mb-3 pr-[340px]">
          {breadcrumb && (
            <p className="text-xs uppercase tracking-[0.12em] text-[#94A3B8]">{breadcrumb.join(" / ")}</p>
          )}
          {title && (
            <div className="mt-1 flex items-baseline gap-2">
              <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#0F172A]">{title}</h1>
              {subtitle && <span className="text-sm text-[#64748B]">{subtitle}</span>}
            </div>
          )}
        </div>
      )}
      <div className="flex items-start gap-4 rounded-2xl pr-[340px]">
        <div className="relative w-full max-w-[520px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-11 w-full rounded-2xl border-0 bg-[#F1F5F9] pl-11 pr-4 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
      </div>
    </header>
  );
}
