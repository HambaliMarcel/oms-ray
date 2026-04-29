import { AIGeneratedPosition } from "@/lib/om-metrics";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";

type AIPositionLibraryTableProps = {
  positions: AIGeneratedPosition[];
  onView: (position: AIGeneratedPosition) => void;
  onEdit: (position: AIGeneratedPosition) => void;
  onSimulate: (position: AIGeneratedPosition) => void;
  onAdd: (position: AIGeneratedPosition) => void;
};

export function AIPositionLibraryTable({ positions, onView, onEdit, onSimulate, onAdd }: AIPositionLibraryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
      <table className="w-full">
        <thead className="bg-[#F8FAFC]">
          <tr>
            {["Position Name", "Department", "Reports To", "Linked Processes", "Required HC", "Monthly Cost", "Scenario Readiness", "Status", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr
              key={p.id}
              className="h-[64px] cursor-pointer border-t border-[#F1F5F9] hover:bg-[#F8FAFC]"
              onClick={() => onView(p)}
            >
              <td className="px-4 text-sm font-semibold text-[#0F172A]">
                <button
                  type="button"
                  className="text-left text-[#0F172A] hover:text-[#2563EB]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(p);
                  }}
                >
                  {p.positionName}
                </button>
              </td>
              <td className="px-4 text-sm text-[#475569]">{p.department}</td>
              <td className="px-4 text-sm text-[#475569]">{p.reportsTo}</td>
              <td className="px-4 text-sm text-[#475569]">{p.linkedBusinessProcesses.length}</td>
              <td className="px-4 text-sm text-[#475569]">{p.workloadAnalysis.requiredHC}</td>
              <td className="px-4 text-sm text-[#475569]">{formatRupiah(p.costEstimate.totalMonthlyCost)}</td>
              <td className="px-4 text-sm font-semibold text-[#0F172A]">{p.scenarioReadiness}</td>
              <td className="px-4">
                <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-semibold text-[#2563EB]">{p.status}</span>
              </td>
              <td className="px-4">
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-lg text-[#2563EB]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(p);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-lg text-[#2563EB]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(p);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-lg text-[#2563EB]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSimulate(p);
                    }}
                  >
                    Simulate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 rounded-lg text-[#2563EB]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(p);
                    }}
                  >
                    Add
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
