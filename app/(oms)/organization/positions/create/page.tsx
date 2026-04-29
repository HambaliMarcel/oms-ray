"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, X, Save, Send, Info, AlertCircle } from "lucide-react";
import { departments } from "@/lib/oms-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/currency";

const JOB_LEVELS = ["Junior", "Mid-Level", "Senior", "Lead", "Manager", "Director", "VP", "C-Level"];
const GRADES = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"];
const COMPETENCY_OPTIONS = [
  "Leadership", "Communication", "Analytics", "Project Management", "Python", "Java",
  "JavaScript", "React", "AWS", "Azure", "SQL", "Finance", "IFRS", "HR Strategy",
  "Operations", "Supply Chain", "Legal", "Compliance", "Brand Management", "Agile",
];

export default function CreatePositionPage() {
  const router = useRouter();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [competencyInput, setCompetencyInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    dept: "",
    grade: "",
    level: "",
    requiredHC: "1",
    salaryMin: "",
    salaryMax: "",
    reportingTo: "",
    description: "",
    competencies: [] as string[],
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addCompetency = (comp: string) => {
    if (comp && !form.competencies.includes(comp)) {
      setForm((prev) => ({ ...prev, competencies: [...prev.competencies, comp] }));
      setCompetencyInput("");
    }
  };

  const removeCompetency = (comp: string) =>
    setForm((prev) => ({ ...prev, competencies: prev.competencies.filter((c) => c !== comp) }));

  const isValid = form.title && form.dept && form.grade && form.level && form.salaryMin && form.salaryMax;

  const annualCostMin = form.salaryMin ? Number(form.salaryMin) * Number(form.requiredHC) : 0;
  const annualCostMax = form.salaryMax ? Number(form.salaryMax) * Number(form.requiredHC) : 0;

  function handleSubmit(isDraft: boolean) {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowSubmitDialog(false);
      router.push("/organization/positions");
    }, 1200);
  }

  return (
    <div className="flex gap-6 min-h-full">
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
              <Link href="/organization/positions" className="hover:underline">Position Directory</Link>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: "var(--primary)" }} className="font-medium">Create Position</span>
            </nav>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Create New Position</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>Define the role requirements and workforce allocation.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleSubmit(true)}>
              <Save className="w-3.5 h-3.5" /> Save Draft
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!isValid}
              style={{ background: isValid ? "var(--primary)" : "var(--muted)", color: isValid ? "white" : "var(--muted-foreground)" }}
              onClick={() => setShowSubmitDialog(true)}
            >
              <Send className="w-3.5 h-3.5" /> Submit
            </Button>
          </div>
        </div>

        <div className="rounded-xl border p-6 flex flex-col gap-5" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          {/* Role Details */}
          <div>
            <p className="text-sm font-semibold mb-4 pb-2 border-b" style={{ color: "var(--foreground)", borderColor: "var(--border)" }}>Role Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Position Name *</Label>
                <Input placeholder="e.g. Senior Data Engineer" value={form.title} onChange={(e) => set("title", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Department *</Label>
                <Select value={form.dept} onValueChange={(v) => set("dept", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-xs">{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Job Level *</Label>
                <Select value={form.level} onValueChange={(v) => set("level", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {JOB_LEVELS.map((l) => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Grade *</Label>
                <Select value={form.grade} onValueChange={(v) => set("grade", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select grade" /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => <SelectItem key={g} value={g} className="text-xs font-mono">{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Required HC</Label>
                <Input type="number" min={1} value={form.requiredHC} onChange={(e) => set("requiredHC", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Reporting To</Label>
                <Input placeholder="e.g. Tech Lead" value={form.reportingTo} onChange={(e) => set("reportingTo", e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <p className="text-sm font-semibold mb-4 pb-2 border-b" style={{ color: "var(--foreground)", borderColor: "var(--border)" }}>Salary Range (Rupiah/bulan)</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Minimum *</Label>
                <Input type="number" placeholder="e.g. 30000000" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Maximum *</Label>
                <Input type="number" placeholder="e.g. 55000000" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
          </div>

          {/* Competencies */}
          <div>
            <p className="text-sm font-semibold mb-4 pb-2 border-b" style={{ color: "var(--foreground)", borderColor: "var(--border)" }}>Competency Requirements</p>
            <div className="flex gap-2 mb-3">
              <Select value={competencyInput} onValueChange={(v) => { setCompetencyInput(v); addCompetency(v); }}>
                <SelectTrigger className="flex-1 h-9 text-sm"><SelectValue placeholder="Select or type competency" /></SelectTrigger>
                <SelectContent>
                  {COMPETENCY_OPTIONS.filter((c) => !form.competencies.includes(c)).map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {form.competencies.map((comp) => (
                <span
                  key={comp}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                >
                  {comp}
                  <button onClick={() => removeCompetency(comp)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.competencies.length === 0 && (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>No competencies added yet</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Role Description</Label>
            <Textarea
              placeholder="Describe the responsibilities, scope, and impact of this role..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {!isValid && (
            <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "#FEF3C7", color: "var(--warning)" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Complete all required fields (*) to submit.
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>New positions require approval from the Department Head and HR Director before being listed as active vacancies.</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Impact Preview */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--primary-light)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>Position Summary</p>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {[
              { label: "Title", value: form.title || "—" },
              { label: "Department", value: departments.find((d) => d.id === form.dept)?.name || "—" },
              { label: "Grade", value: form.grade || "—" },
              { label: "Level", value: form.level || "—" },
              { label: "Required HC", value: form.requiredHC },
              { label: "Salary Range", value: form.salaryMin && form.salaryMax ? `${formatRupiah(Number(form.salaryMin))} – ${formatRupiah(Number(form.salaryMax))}` : "—" },
              { label: "Annual Cost (min)", value: annualCostMin > 0 ? formatRupiah(annualCostMin * 12) : "—", color: "var(--destructive)" },
              { label: "Annual Cost (max)", value: annualCostMax > 0 ? formatRupiah(annualCostMax * 12) : "—", color: "var(--destructive)" },
              { label: "Competencies", value: form.competencies.length > 0 ? `${form.competencies.length} added` : "None" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-xs py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                <span style={{ color: "var(--muted-foreground)" }}>{row.label}</span>
                <span className="font-semibold" style={{ color: (row as { color?: string }).color ?? "var(--foreground)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Approval Route</p>
          {[
            { step: 1, name: "Department Head", status: "Auto-assigned" },
            { step: 2, name: "HR Director — Lestari Putri", status: "Pending" },
            { step: 3, name: "Finance Director — Sri Mulyani", status: "Pending" },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-2.5 p-2.5 rounded-lg border mb-2 last:mb-0" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--primary)", color: "white" }}>
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>{s.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Position</DialogTitle>
            <DialogDescription>
              You are submitting <strong>{form.title || "this position"}</strong> for approval. A notification will be sent to the Department Head and HR Director.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button
              style={{ background: "var(--primary)", color: "white" }}
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
