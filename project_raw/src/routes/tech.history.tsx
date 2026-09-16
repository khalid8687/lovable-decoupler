import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, EmptyState, SectionTitle, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/tech/history")({
  head: () => ({
    meta: [
      { title: "Job History — Kangaroo Technician App" },
      { name: "description", content: "Closed jobs, customer ratings and earnings history for Kangaroo field technicians." },
      { property: "og:title", content: "Job History — Kangaroo Technician App" },
      { property: "og:description", content: "Completed work log with ratings and totals." },
    ],
  }),
  component: History,
});

function History() {
  const { orders } = useStore();
  const done = orders.filter((o) => o.status === "completed" && o.technicianId);

  return (
    <div className="space-y-4">
      <SectionTitle title="History" subtitle="الأعمال المنتهية والتقييمات" />
      {done.length === 0 ? (
        <EmptyState title="No closed jobs yet" body="Completed work will be listed here with ratings." />
      ) : (
        done.map((job) => (
          <Card key={job.id}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {job.id} · {job.customer} · {timeAgo(job.createdAt)}
                </p>
                <p className="mt-1 text-sm font-bold text-primary">{money(job.amount)}</p>
              </div>
              <Badge tone="success">{job.rating ? `⭐ ${job.rating}/5` : "closed"}</Badge>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
