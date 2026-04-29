"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Save, Send, Briefcase, Plus, X } from "lucide-react";
import { positions, departments } from "@/lib/oms-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatRupiah } from "@/lib/currency";

const GRADES = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"];

export default function EditPositionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const position = positions.find((p) => p.id === id);

  const [form, setForm] = useState({
    title: position?.title ?? "",
    dept: position?.dept ?? "",
    grade: position?.grade ?? "G4",
    planned: String(position?.planned ?? 1),
    salaryMin: String(position?.salaryMin ?? 30000000),
    salaryMax: String(position?.salaryMax ?? 55000000),
    reportingTo: "",
    status: position?.status ?? "Filled",
  });
  const [competencies, setCompetencies] = useState<string[]>(position?.competencies ?? []);
  const [newComp, setNewComp] = useState("");
  const [submitDialog, setSubmitDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function addComp() {
    const c = newComp.trim();
    if (c && !competencies.includes(c)) { setCompetencies((prev) => [...prev, c]); }
    setNewComp("");
  }
  function removeComp(c: string) { setCompetencies((prev) => prev.filter((x) => x !== c)); }

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Position not found.</p>
        <Link href="/organization/positions"><Button variant="outline" size="sm"><ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back</Button></Link>
      </div>
    );
  }

  const salaryGap = Number(form.salaryMax) - Number(form.salaryMin);
  const deptObj = departments.find((d) => d.name === form.dept);

  return (
    <div className="flex gap-6 min-h-full">
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        {/* Header */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/organization/positions" className="hover:underline">Position Directory</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/organization/positions/${id}`} className="hover:underline">{position.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "var(--primary)" }} className="font-medium">Edit</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary-light)" }}>
                <Briefcase className="w-5 h-5" style={{ color: "var(--primary)" }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Edit Position</h1>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{position.id} · Last modified today</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/organization/positions/${id}`}><Button variant="outline" size="sm"><ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Cancel</Button></Link>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSave}>
                <Save className="w-3.5 h-3.5" /> {saved ? "Saved!" : "Save Draft"}
              </Button>
              <Button size="sm" className="gap-1.5" style={{ background: "var(--primary)", color: "white" }} onClick={() => setSubmitDialog(true)}>
                <Send className="w-3.5 h-3.5" /> Submit for Approval
              </Button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-5" style={{ color: "var(--foreground)" }}>Position Information</p>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Position Title <span style={{ color: "var(--destructive)" }}>*</span></label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} className="text-sm" placeholder="e.g. Senior Software Engineer" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Department <span style={{ color: "var(--destructive)" }}>*</span></label>
              <Select value={form.dept} onValueChange={(v) => set("dept", v)}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d.id} value={d.name} className="text-sm">{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Job Grade <span style={{ color: "var(--destructive)" }}>*</span></label>
              <Select value={form.grade} onValueChange={(v) => set("grade", v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{GRADES.map((g) => <SelectItem key={g} value={g} className="text-sm">{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Planned Headcount <span style={{ color: "var(--destructive)" }}>*</span></label>
              <Input type="number" min={1} value={form.planned} onChange={(e) => set("planned", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Salary Min (Rupiah/bulan)</label>
              <Input type="number" step={1000} value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Salary Max (Rupiah/bulan)</label>
              <Input type="number" step={1000} value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} className="text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Reporting To</label>
              <Input value={form.reportingTo} onChange={(e) => set("reportingTo", e.target.value)} className="text-sm" placeholder="e.g. Tech Lead" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>Status</label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Filled" className="text-sm">Filled</SelectItem>
                  <SelectItem value="Open" className="text-sm">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Competencies */}
        <div className="rounded-xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: "var(--foreground)" }}>Required Competencies</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {competencies.map((c) => (
              <div key={c} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border" style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "var(--primary)" }}>
                {c}
                <button onClick={() => removeComp(c)} className="hover:opacity-70"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addComp(); } }}
              placeholder="Add competency (press Enter)"
              className="text-sm flex-1"
            />
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addComp}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </div>

      {/* Right Panel — Impact Preview */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Impact Preview</p>
          {[
            { label: "Planned HC",    value: form.planned },
            { label: "Department",    value: form.dept || "—" },
            { label: "Grade",         value: form.grade },
            { label: "Annual Min",    value: formatRupiah(Number(form.salaryMin) * 12) },
            { label: "Annual Max",    value: formatRupiah(Number(form.salaryMax) * 12) },
            { label: "Salary Range",  value: `${formatRupiah(Math.max(salaryGap, 0))} spread` },
          ].map((f) => (
            <div key={f.label} className="flex justify-between py-2 border-b text-xs" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--muted-foreground)" }}>{f.label}</span>
              <span className="font-semibold" style={{ color: "var(--foreground)" }}>{f.value}</span>
            </div>
          ))}
        </div>

        {deptObj && (
          <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted-foreground)" }}>Department Context</p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Head</span><span style={{ color: "var(--foreground)" }}>{deptObj.head}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Current HC</span><span style={{ color: "var(--foreground)" }}>{deptObj.hc}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Vacancies</span><span style={{ color: "var(--destructive)" }}>{deptObj.vacancies}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted-foreground)" }}>Department Code</span><span style={{ color: "var(--foreground)" }}>{deptObj.code}</span></div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={submitDialog} onOpenChange={setSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit for Approval</DialogTitle>
            <DialogDescription>
              Changes to <strong>{form.title}</strong> will be sent to the department head and HR Director for review. You will be notified once approved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialog(false)}>Cancel</Button>
            <Link href={`/organization/positions/${id}`}>
              <Button style={{ background: "var(--primary)", color: "white" }}>Confirm Submission</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
