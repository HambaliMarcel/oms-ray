"use client";

import { ReactNode } from "react";
import { TopBar } from "@/components/oms/topbar";

type AIModuleLayoutProps = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  filters?: ReactNode;
  kpis?: ReactNode;
  children: ReactNode;
  toast?: string | null;
};

export function AIModuleLayout({
  breadcrumb,
  title,
  subtitle,
  actions,
  filters,
  kpis,
  children,
  toast,
}: AIModuleLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopBar />
      <main className="space-y-6 px-8 pb-8">
        <section className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#94A3B8]">{breadcrumb}</p>
            <h1 className="mt-2 text-[32px] font-bold leading-tight text-[#0F172A]">{title}</h1>
            <p className="mt-1 max-w-4xl text-sm text-[#64748B]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </section>
        {filters}
        {kpis}
        {children}
      </main>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
