import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Clock,
  ListChecks,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card, SectionTitle, Stat, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Kangaroo Admin" },
      { name: "description", content: "Live dispatch KPIs, revenue split, AI resolution rate and technician load for Kangaroo Home Care Qatar." },
      { property: "og:title", content: "Operations Dashboard — Kangaroo Admin" },
      { property: "og:description", content: "Command centre for jobs, AI reports, store orders and technician performance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { orders, reports, technicians, products, users } = useStore();
  const open = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);
  const aiJobs = orders.filter((o) => o.source === "ai-agent").length;
  const selfFixed = reports.filter((r) => r.resolution === "self-fixed").length;
  const rated = orders.filter((o) => o.rating);
  const avgRating = rated.length
    ? (rated.reduce((s, o) => s + (o.rating ?? 0), 0) / rated.length).toFixed(1)
    : "—";

  const byZone = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.zone] = (acc[o.zone] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([zone, jobs]) => ({ zone, jobs }));

  const bySource = [
    { name: "AI agent", value: orders.filter((o) => o.source === "ai-agent").length },
    { name: "Manual", value: orders.filter((o) => o.source === "manual").length },
    { name: "Store", value: orders.filter((o) => o.source === "store").length },
  ];
  const pieColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Operations dashboard</h1>
        <p className="text-sm text-muted-foreground">Doha · live queue, AI performance and revenue</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open jobs" value={String(open.length)} hint="awaiting or in progress" icon={<ListChecks className="h-4 w-4" />} />
        <Stat label="Completed revenue" value={money(revenue)} hint="all channels" icon={<TrendingUp className="h-4 w-4" />} />
        <Stat label="AI-created jobs" value={String(aiJobs)} hint={`${selfFixed} solved on the call`} icon={<Bot className="h-4 w-4" />} />
        <Stat label="Avg rating" value={String(avgRating)} hint={`${rated.length} rated jobs`} icon={<Star className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Jobs by zone" subtitle="Dispatch load across Qatar" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byZone}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="zone" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="jobs" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Channel mix" subtitle="Where requests come from" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {bySource.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle
            title="Live queue"
            subtitle="Newest first"
            action={
              <Link to="/admin/orders" className="shrink-0 text-sm font-semibold text-primary">
                Dispatch board
              </Link>
            }
          />
          <ul className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-surface p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{order.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.zone} · {timeAgo(order.createdAt)}
                  </p>
                </div>
                <Badge tone={order.priority === "urgent" ? "danger" : "brand"}>{order.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle title="Team & catalogue" subtitle="Snapshot" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat label="Technicians" value={String(technicians.length)} hint={`${technicians.filter((t) => t.status === "available").length} available`} icon={<Users className="h-4 w-4" />} />
            <Stat label="Store SKUs" value={String(products.length)} hint={`${products.reduce((s, p) => s + p.stock, 0)} units in stock`} icon={<ShoppingBag className="h-4 w-4" />} />
            <Stat label="App users" value={String(users.length)} hint="customers, techs, admins" icon={<Users className="h-4 w-4" />} />
            <Stat label="AI reports" value={String(reports.length)} hint="with camera evidence" icon={<Clock className="h-4 w-4" />} />
          </div>
        </Card>
      </div>
    </div>
  );
}
