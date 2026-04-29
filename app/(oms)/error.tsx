"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OmsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OMS] route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div
        className="max-w-2xl w-full rounded-xl border p-6 flex flex-col gap-4"
        style={{ background: "var(--card)", borderColor: "var(--destructive)" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#FEE2E2" }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "var(--destructive)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              Something went wrong rendering this page
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              The OM+ app caught an exception while rendering. Use the details
              below to help diagnose, or reset to try again.
            </p>
          </div>
        </div>

        <div
          className="rounded-lg border p-4 font-mono text-xs whitespace-pre-wrap break-words overflow-x-auto"
          style={{ background: "#FEF2F2", borderColor: "var(--border)", color: "var(--destructive)" }}
        >
          <p className="font-bold mb-1">{error.name ?? "Error"}: {error.message}</p>
          {error.digest && (
            <p className="opacity-75 mb-2">Digest: {error.digest}</p>
          )}
          {error.stack && (
            <pre className="opacity-90 leading-relaxed text-xs">
              {error.stack.split("\n").slice(0, 8).join("\n")}
            </pre>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={reset} className="gap-1.5" size="sm" style={{ background: "var(--primary)", color: "white" }}>
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Home className="w-3.5 h-3.5" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
