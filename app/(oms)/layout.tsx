import { Sidebar } from "@/components/oms/sidebar";

export default function OmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
