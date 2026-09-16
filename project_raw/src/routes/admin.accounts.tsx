import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, TrendingUp, Wallet, Receipt, Percent } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Meter, SectionTitle, Select, Stat, Tabs, dateLabel, money } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/accounts")({
  head: () => ({
    meta: [
      { title: "Finance & Statements — Kangaroo Admin" },
      {
        name: "description",
        content:
          "Revenue by channel and zone, VAT, receivables, per-customer statements and technician productivity for Kangaroo Qatar.",
      },
      { property: "og:title", content: "Finance & Statements — Kangaroo Admin" },
      { property: "og:description", content: "Full financial reporting for the Kangaroo operations team." },
    ],
  }),
  component: Accounts,
});

const CLOSED = ["completed"];
const isOpen = (s: string) => s !== "completed" && s !== "cancelled";

function Accounts() {
  const { orders, technicians, customers, settings } = useStore();
  const [tab, setTab] = useState<"overview" | "statements" | "team">("overview");
  const [range, setRange] = useState("30");

  const scoped = useMemo(() => {
    const days = Number(range);
    if (!days) return orders;
    const from = Date.now() - days * 864e5;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= from);
  }, [orders, range]);

  const completed = scoped.filter((o) => CLOSED.includes(o.status));
  const collected = completed.reduce((s, o) => s + o.amount, 0);
  const pipeline = scoped.filter((o) => isOpen(o.status)).reduce((s, o) => s + o.amount, 0);
  const vat = Math.round((collected * settings.vatPercent) / 100);
  const services = completed.filter((o) => o.kind === "service").reduce((s, o) => s + o.amount, 0);
  const productsRev = completed.filter((o) => o.kind === "product").reduce((s, o) => s + o.amount, 0);

  const byZone = Object.entries(
    completed.reduce<Record<string, number>>((acc, o) => {
      acc[o.zone] = (acc[o.zone] ?? 0) + o.amount;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const bySource = Object.entries(
    completed.reduce<Record<string, number>>((acc, o) => {
      acc[o.source] = (acc[o.source] ?? 0) + o.amount;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const maxZone = Math.max(1, ...byZone.map(([, v]) => v));

  const statements = customers
    .map((c) => {
      const mine = orders.filter((o) => o.customerId === c.id);
      const done = mine.filter((o) => CLOSED.includes(o.status));
      return {
        customer: c,
        jobs: mine.length,
        billed: mine.reduce((s, o) => s + o.amount, 0),
        paid: done.reduce((s, o) => s + o.amount, 0),
        due: mine.filter((o) => isOpen(o.status)).reduce((s, o) => s + o.amount, 0),
        last: mine[0]?.createdAt,
      };
    })
    .sort((a, b) => b.billed - a.billed);

  const exportCsv = () => {
    const header = "Customer,Phone,Tier,Contract,Jobs,Billed,Collected,Outstanding\n";
    const body = statements
      .map((r) =>
        [r.customer.name, r.customer.phone, r.customer.tier, r.customer.contractType, r.jobs, r.billed, r.paid, r.due].join(
          ",",
        ),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([header + body], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kangaroo-statements.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Statement exported");
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Finance & statements"
        subtitle="كشوف الحسابات والتقارير المالية التفصيلية"
        action={
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "statements", label: "Customer statements" },
            { id: "team", label: "Team productivity" },
          ]}
        />
        <Select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last quarter</option>
          <option value="0">All time</option>
        </Select>
      </div>

      {tab === "overview" ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Collected" value={money(collected)} hint={`${completed.length} closed jobs`} icon={<Wallet className="h-4 w-4" />} />
            <Stat label="Open pipeline" value={money(pipeline)} hint="not invoiced yet" icon={<TrendingUp className="h-4 w-4" />} />
            <Stat
              label="Avg ticket"
              value={money(completed.length ? Math.round(collected / completed.length) : 0)}
              hint="per closed job"
              icon={<Receipt className="h-4 w-4" />}
            />
            <Stat label={`VAT ${settings.vatPercent}%`} value={money(vat)} hint="due to authority" icon={<Percent className="h-4 w-4" />} />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="space-y-3">
              <p className="font-bold">Revenue by zone</p>
              {byZone.length === 0 ? (
                <p className="text-sm text-muted-foreground">No closed jobs in this range.</p>
              ) : (
                byZone.map(([z, v]) => <Meter key={z} label={z} value={v} max={maxZone} />)
              )}
            </Card>
            <Card className="space-y-3">
              <p className="font-bold">Revenue by channel</p>
              {bySource.map(([s, v]) => (
                <Meter key={s} label={s} value={v} max={Math.max(1, ...bySource.map(([, x]) => x))} tone="bg-success" />
              ))}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-2xl bg-surface p-3">
                  <p className="text-xs text-muted-foreground">Services</p>
                  <p className="font-bold">{money(services)}</p>
                </div>
                <div className="rounded-2xl bg-surface p-3">
                  <p className="text-xs text-muted-foreground">Store</p>
                  <p className="font-bold">{money(productsRev)}</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : null}

      {tab === "statements" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2">Customer</th>
                  <th className="py-2">Tier</th>
                  <th className="py-2">Jobs</th>
                  <th className="py-2">Billed</th>
                  <th className="py-2">Collected</th>
                  <th className="py-2">Outstanding</th>
                  <th className="py-2">Last job</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((r) => (
                  <tr key={r.customer.id} className="border-t border-border">
                    <td className="py-2">
                      <span className="block font-semibold">{r.customer.name}</span>
                      <span className="block text-xs text-muted-foreground">{r.customer.phone}</span>
                    </td>
                    <td className="py-2">
                      <Badge tone={r.customer.tier === "platinum" ? "brand" : "neutral"}>{r.customer.tier}</Badge>
                    </td>
                    <td className="py-2">{r.jobs}</td>
                    <td className="py-2">{money(r.billed)}</td>
                    <td className="py-2 text-success">{money(r.paid)}</td>
                    <td className="py-2 text-destructive">{r.due ? money(r.due) : "—"}</td>
                    <td className="py-2 text-xs text-muted-foreground">{r.last ? dateLabel(r.last) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === "team" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => {
            const jobs = orders.filter((o) => o.technicianId === tech.id);
            const done = jobs.filter((o) => CLOSED.includes(o.status));
            const revenue = done.reduce((s, o) => s + o.amount, 0);
            const rated = done.filter((o) => typeof o.rating === "number");
            const avg = rated.length ? (rated.reduce((s, o) => s + (o.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
            return (
              <Card key={tech.id} className="space-y-2">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tech.trade} · {tech.zone}
                    </p>
                  </div>
                  <Badge tone="brand">★ {avg}</Badge>
                </div>
                <Meter label="Revenue closed" value={revenue} max={Math.max(1, collected)} tone="bg-primary" />
                <p className="text-xs text-muted-foreground">
                  {done.length}/{jobs.length} jobs closed · {jobs.filter((o) => isOpen(o.status)).length} in progress
                </p>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
