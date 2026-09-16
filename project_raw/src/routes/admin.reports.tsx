import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, EmptyState, Modal, SectionTitle, Stat, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";
import type { AgentReport } from "@/lib/data";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "AI Call Reports — Kangaroo Admin" },
      { name: "description", content: "Full transcripts, camera snapshots and outcomes from every Roo AI support call in Qatar." },
      { property: "og:title", content: "AI Call Reports — Kangaroo Admin" },
      { property: "og:description", content: "Evidence-backed AI support reports feeding dispatch and quality control." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { reports } = useStore();
  const [open, setOpen] = useState<AgentReport | null>(null);

  const count = (r: AgentReport["resolution"]) => reports.filter((x) => x.resolution === r).length;

  return (
    <div className="space-y-4">
      <SectionTitle title="AI call reports" subtitle="تقارير مكالمات الوكيل الذكي مع الصور والمحادثة" />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Solved on the call" value={String(count("self-fixed"))} hint="no technician needed" />
        <Stat label="Escalated to visit" value={String(count("needs-visit"))} hint="jobs dispatched" />
        <Stat label="Info only" value={String(count("info-only"))} hint="enquiries" />
      </div>

      {reports.length === 0 ? (
        <EmptyState title="No AI reports yet" body="Start a call from the customer app to generate one." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{report.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.id} · {report.customer} · {timeAgo(report.createdAt)}
                  </p>
                  <p className="mt-1 text-sm">{report.symptom}</p>
                </div>
                <Badge
                  tone={report.resolution === "self-fixed" ? "success" : report.resolution === "needs-visit" ? "warning" : "neutral"}
                >
                  {report.resolution}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <p className="truncate text-xs text-muted-foreground">
                  {report.snapshots.length} snapshot(s) · {report.transcript.length} turns
                  {report.orderId ? ` · job ${report.orderId}` : ""}
                </p>
                <Button size="sm" variant="outline" onClick={() => setOpen(report)}>
                  View report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.id} — ${open.device}` : ""} wide>
        {open && (
          <div className="space-y-4">
            {open.snapshots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {open.snapshots.map((s, i) =>
                  s.startsWith("data:") ? (
                    <img key={i} src={s} alt={`Snapshot ${i + 1}`} className="h-28 w-36 rounded-xl object-cover" />
                  ) : (
                    <span key={i} className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{s}</span>
                  ),
                )}
              </div>
            )}
            <div className="space-y-2">
              {open.transcript.map((turn, i) => (
                <div key={i} className={turn.role === "agent" ? "flex" : "flex justify-end"}>
                  <p
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      turn.role === "agent" ? "bg-surface text-foreground" : "amber-gradient text-secondary-foreground"
                    }`}
                  >
                    {turn.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
