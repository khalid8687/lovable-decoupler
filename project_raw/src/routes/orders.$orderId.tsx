import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bot, MapPin, Phone, Star } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import { Badge, Button, Card, EmptyState, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [
      { title: "Job Details — Kangaroo Home Care" },
      { name: "description", content: "Follow your maintenance job timeline, assigned technician, AI diagnosis notes and rate the service." },
      { property: "og:title", content: "Job Details — Kangaroo Home Care" },
      { property: "og:description", content: "Timeline, technician details and AI call evidence for your Kangaroo job." },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const { orders, technicians, rateOrder } = useStore();
  const order = orders.find((o) => o.id === orderId);
  const tech = technicians.find((t) => t.id === order?.technicianId);

  if (!order) {
    return (
      <CustomerShell>
        <div className="p-4">
          <EmptyState title="Order not found" body="Check the orders list for your latest jobs." />
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="space-y-4 px-4 pt-5">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Orders
        </Link>

        <Card>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-bold">{order.title}</h1>
              <p className="text-xs text-muted-foreground">
                {order.id} · {timeAgo(order.createdAt)} · {order.source}
              </p>
            </div>
            <Badge tone={order.status === "completed" ? "success" : order.status === "in-progress" ? "warning" : "brand"}>
              {order.status}
            </Badge>
          </div>
          <div className="mt-3 grid gap-1 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> {order.address} · {order.zone}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" /> {order.phone}
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-primary">{money(order.amount)}</p>
        </Card>

        {order.aiSummary && (
          <Card>
            <p className="flex items-center gap-2 font-semibold">
              <Bot className="h-4 w-4 text-secondary" /> AI diagnosis
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{order.aiSummary}</p>
            {order.attachments && order.attachments.length > 0 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {order.attachments.map((a, i) =>
                  a.startsWith("data:") ? (
                    <img key={i} src={a} alt={`Evidence ${i + 1}`} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <span key={i} className="shrink-0 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                      {a}
                    </span>
                  ),
                )}
              </div>
            )}
          </Card>
        )}

        {tech && (
          <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{tech.name}</p>
              <p className="text-xs text-muted-foreground">
                {tech.trade} · ⭐ {tech.rating}
              </p>
            </div>
            <a href={`tel:${tech.phone.replace(/\s/g, "")}`} className="shrink-0">
              <Button size="sm" variant="amber">
                <Phone className="h-4 w-4" /> Call
              </Button>
            </a>
          </Card>
        )}

        {order.items && order.items.length > 0 && (
          <Card>
            <p className="font-semibold">Items</p>
            <ul className="mt-2 space-y-1 text-sm">
              {order.items.map((item) => (
                <li key={item.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <span className="truncate text-muted-foreground">
                    {item.qty}× {item.name}
                  </span>
                  <span className="font-semibold">{money(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card>
          <p className="font-semibold">Timeline</p>
          <ol className="mt-3 space-y-3">
            {order.timeline.map((entry, i) => (
              <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{entry.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.by} · {timeAgo(entry.at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {order.status === "completed" && (
          <Card>
            <p className="font-semibold">Rate the service</p>
            <p className="text-xs text-muted-foreground">قيّم مزود الخدمة بعد انتهاء العمل</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    rateOrder(order.id, n);
                    toast.success("Thanks for your rating");
                  }}
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      (order.rating ?? 0) >= n ? "fill-secondary text-secondary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </CustomerShell>
  );
}
