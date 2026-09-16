import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Hand, ShoppingBag, Star } from "lucide-react";
import { CustomerShell } from "@/components/shells";
import { Badge, Card, EmptyState, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/data";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My Orders & Jobs — Kangaroo Home Care" },
      { name: "description", content: "Track maintenance jobs, technician assignment, store deliveries and service ratings in one place." },
      { property: "og:title", content: "My Orders & Jobs — Kangaroo Home Care" },
      { property: "og:description", content: "Live job status, AI call reports and delivery tracking for Kangaroo customers." },
    ],
  }),
  component: OrdersPage,
});

const FILTERS: (OrderStatus | "all")[] = ["all", "new", "assigned", "in-progress", "completed"];

const sourceIcon = { "ai-agent": Bot, manual: Hand, store: ShoppingBag } as const;

function OrdersPage() {
  const { orders, technicians } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const list = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">كل طلباتك — خدمات ومنتجات وتقارير الوكيل الذكي</p>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                filter === f ? "brand-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 px-4 pt-4">
        {list.length === 0 ? (
          <EmptyState title="Nothing here yet" body="Start an AI call or pick a service to create your first job." />
        ) : (
          list.map((order) => {
            const Icon = sourceIcon[order.source];
            const tech = technicians.find((t) => t.id === order.technicianId);
            return (
              <Link key={order.id} to="/orders/$orderId" params={{ orderId: order.id }}>
                <Card>
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-strong text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{order.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.id} · {timeAgo(order.createdAt)} · {money(order.amount)}
                      </p>
                      {tech ? <p className="mt-1 text-xs text-muted-foreground">Technician: {tech.name}</p> : null}
                      {order.rating ? (
                        <p className="mt-1 flex items-center gap-1 text-xs text-secondary-foreground">
                          <Star className="h-3 w-3 fill-secondary text-secondary" /> {order.rating}/5
                        </p>
                      ) : null}
                    </div>
                    <Badge
                      tone={
                        order.status === "completed"
                          ? "success"
                          : order.status === "in-progress"
                            ? "warning"
                            : order.status === "cancelled"
                              ? "danger"
                              : "brand"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </CustomerShell>
  );
}
