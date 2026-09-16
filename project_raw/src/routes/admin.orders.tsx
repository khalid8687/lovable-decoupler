import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Modal, SectionTitle, Select, Textarea, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/data";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Dispatch Board — Kangaroo Admin" },
      { name: "description", content: "Assign technicians, change job status and review AI evidence for every Kangaroo maintenance job." },
      { property: "og:title", content: "Dispatch Board — Kangaroo Admin" },
      { property: "og:description", content: "Assign, escalate and close jobs across Qatar from one board." },
    ],
  }),
  component: DispatchBoard,
});

const STATUSES: OrderStatus[] = ["new", "assigned", "in-progress", "completed", "cancelled"];

function DispatchBoard() {
  const { orders, technicians, assignTechnician, setOrderStatus, updateOrder } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [active, setActive] = useState<Order | null>(null);
  const [note, setNote] = useState("");

  const list = orders.filter((o) => filter === "all" || o.status === filter);
  const current = active ? orders.find((o) => o.id === active.id) ?? active : null;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Jobs & dispatch"
        subtitle="Assign technicians and track SLA"
        action={
          <Select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "all")} className="w-40">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((order) => {
          const tech = technicians.find((t) => t.id === order.technicianId);
          return (
            <Card key={order.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{order.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.customer} · {order.zone} · {timeAgo(order.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge tone={order.status === "completed" ? "success" : order.status === "in-progress" ? "warning" : "brand"}>
                    {order.status}
                  </Badge>
                  {order.priority === "urgent" && <Badge tone="danger">urgent</Badge>}
                </div>
              </div>

              {order.aiSummary && (
                <p className="mt-2 rounded-xl bg-surface p-3 text-xs text-muted-foreground">🤖 {order.aiSummary}</p>
              )}

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Select
                  value={order.technicianId ?? ""}
                  onChange={(e) => {
                    assignTechnician(order.id, e.target.value);
                    toast.success("Technician assigned");
                  }}
                >
                  <option value="">Unassigned…</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} · {t.trade} ({t.status})
                    </option>
                  ))}
                </Select>
                <Select value={order.status} onChange={(e) => setOrderStatus(order.id, e.target.value as OrderStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <span className="truncate text-sm font-bold text-primary">{money(order.amount)}</span>
                <Button size="sm" variant="outline" onClick={() => { setActive(order); setNote(order.notes ?? ""); }}>
                  Open file
                </Button>
              </div>
              {tech ? <p className="mt-2 text-xs text-muted-foreground">On duty: {tech.name} · {tech.phone}</p> : null}
            </Card>
          );
        })}
      </div>

      <Modal open={!!current} onClose={() => setActive(null)} title={current ? `${current.id} — ${current.customer}` : ""} wide>
        {current && (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">Job:</span> {current.title}</p>
              <p><span className="text-muted-foreground">Phone:</span> {current.phone}</p>
              <p><span className="text-muted-foreground">Address:</span> {current.address}</p>
              <p><span className="text-muted-foreground">Channel:</span> {current.source}</p>
              <p><span className="text-muted-foreground">Amount:</span> {money(current.amount)}</p>
              <p><span className="text-muted-foreground">Rating:</span> {current.rating ? `${current.rating}/5` : "—"}</p>
            </div>

            {current.attachments && current.attachments.length > 0 && (
              <div>
                <p className="text-sm font-semibold">AI camera evidence</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.attachments.map((a, i) =>
                    a.startsWith("data:") ? (
                      <img key={i} src={a} alt={`Evidence ${i + 1}`} className="h-24 w-32 rounded-xl object-cover" />
                    ) : (
                      <span key={i} className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{a}</span>
                    ),
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold">Timeline</p>
              <ol className="mt-2 space-y-2">
                {current.timeline.map((t, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    {timeAgo(t.at)} · {t.label} ({t.by})
                  </li>
                ))}
              </ol>
            </div>

            <Field label="Internal note">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  updateOrder(current.id, { notes: note }, "Note updated");
                  toast.success("Saved");
                }}
              >
                Save note
              </Button>
              <Button variant="success" onClick={() => { setOrderStatus(current.id, "completed"); toast.success("Job closed"); }}>
                Mark completed
              </Button>
              <Button variant="danger" onClick={() => { setOrderStatus(current.id, "cancelled"); toast("Job cancelled"); }}>
                Cancel job
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
