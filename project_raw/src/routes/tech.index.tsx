import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, PlayCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, EmptyState, Field, Modal, SectionTitle, Select, Textarea, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/tech/")({
  head: () => ({
    meta: [
      { title: "My Jobs — Kangaroo Technician App" },
      { name: "description", content: "Technician job queue: accept dispatch, start work, add findings and close jobs with a report." },
      { property: "og:title", content: "My Jobs — Kangaroo Technician App" },
      { property: "og:description", content: "The field app used by Kangaroo technicians across Qatar." },
    ],
  }),
  component: TechJobs,
});

function TechJobs() {
  const { orders, technicians, setOrderStatus, updateOrder } = useStore();
  const [techId, setTechId] = useState(technicians[0]?.id ?? "");
  const [reportFor, setReportFor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const myJobs = orders.filter(
    (o) => o.technicianId === techId && o.status !== "completed" && o.status !== "cancelled",
  );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="My jobs"
        subtitle="الطلبات الموزعة من الإدارة"
        action={
          <Select value={techId} onChange={(e) => setTechId(e.target.value)} className="w-44">
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        }
      />

      {myJobs.length === 0 ? (
        <EmptyState title="No jobs assigned" body="The dispatcher will push new jobs here instantly." />
      ) : (
        myJobs.map((job) => (
          <Card key={job.id}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {job.id} · {job.customer} · {timeAgo(job.createdAt)}
                </p>
              </div>
              <Badge tone={job.priority === "urgent" ? "danger" : "brand"}>{job.status}</Badge>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> {job.address}
            </p>
            {job.aiSummary ? (
              <p className="mt-2 rounded-xl bg-surface p-3 text-xs text-muted-foreground">🤖 {job.aiSummary}</p>
            ) : null}
            {job.attachments && job.attachments.length > 0 && (
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                {job.attachments.map((a, i) =>
                  a.startsWith("data:") ? (
                    <img key={i} src={a} alt={`Evidence ${i + 1}`} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span key={i} className="shrink-0 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{a}</span>
                  ),
                )}
              </div>
            )}
            <p className="mt-2 font-bold text-primary">{money(job.amount)}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <a href={`tel:${job.phone.replace(/\s/g, "")}`}>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
              <Button
                size="sm"
                variant="amber"
                onClick={() => {
                  setOrderStatus(job.id, "in-progress", "Technician");
                  toast.success("Job started");
                }}
              >
                <PlayCircle className="h-4 w-4" /> Start
              </Button>
              <Button size="sm" variant="success" onClick={() => { setReportFor(job.id); setNote(""); }}>
                <CheckCircle2 className="h-4 w-4" /> Close
              </Button>
            </div>
          </Card>
        ))
      )}

      <Modal open={!!reportFor} onClose={() => setReportFor(null)} title="Completion report">
        <div className="space-y-3">
          <Field label="Work done / parts used">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Replaced drain pump, tested 2 cycles…" />
          </Field>
          <Button
            className="w-full"
            onClick={() => {
              if (!reportFor) return;
              updateOrder(reportFor, { notes: note }, `Completion report: ${note || "no notes"}`, "Technician");
              setOrderStatus(reportFor, "completed", "Technician");
              setReportFor(null);
              toast.success("Job closed and sent to admin");
            }}
          >
            Submit & close job
          </Button>
        </div>
      </Modal>
    </div>
  );
}
