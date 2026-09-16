import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import { Badge, Button, Card, Field, Input, Modal, Select, Textarea } from "@/components/kit";
import { ServiceIcon } from "@/components/service-icon";
import { useStore } from "@/lib/store";
import type { ServiceCategory } from "@/lib/data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Maintenance Services in Qatar — Kangaroo Home Care" },
      {
        name: "description",
        content:
          "Book AC, plumbing, electrical, appliance, pool, painting and emergency maintenance across Doha with transparent starting prices.",
      },
      { property: "og:title", content: "Maintenance Services in Qatar — Kangaroo Home Care" },
      { property: "og:description", content: "Twelve engineer-supervised service lines with a 60-minute emergency SLA in Doha." },
    ],
  }),
  component: ServicesPage,
});

const ZONES = ["West Bay", "Lusail", "Al Waab", "Al Sadd", "Al Wakrah", "Al Gharrafa", "Al Kheesa", "Msheireb"];

function ServicesPage() {
  const { services, addOrder, me } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ServiceCategory | null>(null);
  const [propertyId, setPropertyId] = useState(me.defaultPropertyId);
  const [form, setForm] = useState({
    slot: me.preferredWindow === "morning" ? "Tomorrow · 9-12 AM" : "Today · 6-9 PM",
    priority: "normal",
    notes: "",
  });

  const property = me.properties.find((p) => p.id === propertyId) ?? me.properties[0]!;

  const list = services.filter(
    (s) =>
      s.active &&
      `${s.name} ${s.nameAr} ${s.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  const submit = () => {
    if (!selected) return;
    const order = addOrder({
      kind: "service",
      title: `${selected.name} — ${form.slot}`,
      customerId: me.id,
      customer: me.name,
      phone: me.phone,
      address: `${property.label} · ${property.address}`,
      zone: property.zone,
      status: "new",
      priority: form.priority === "urgent" ? "urgent" : "normal",
      amount: selected.fromPrice,
      source: "manual",
      notes: form.notes,
    });
    setSelected(null);
    toast.success(`Request ${order.id} sent to dispatch`);
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };


  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">Maintenance services</h1>
        <p className="text-sm text-muted-foreground">اختر الخدمة وسيتم إرسال العرض من مركز التوزيع</p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a service…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3 px-4 pt-4 sm:grid-cols-2">
        {list.map((service) => (
          <Card key={service.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-strong text-primary">
              <ServiceIcon name={service.icon} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate font-semibold">{service.name}</p>
                <Badge tone="brand">from {service.fromPrice}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{service.nameAr}</p>
              <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <span className="flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  SLA {service.slaMinutes < 60 ? `${service.slaMinutes}m` : `${Math.round(service.slaMinutes / 60)}h`}
                </span>
                <Button size="sm" onClick={() => setSelected(service)}>
                  Book
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Book ${selected?.name ?? ""}`}>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-surface p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Booking as</p>
            <p className="mt-0.5 truncate font-bold">
              {me.name} · {me.phone}
            </p>
            <p className="text-xs text-muted-foreground">
              {me.tier} member · {me.contractType === "none" ? "no contract" : `${me.contractType} contract`}
            </p>
            <Link to="/profile" className="mt-1 inline-block text-xs font-semibold text-primary">
              Edit my details
            </Link>
          </div>
          <Field label="Where should we come?" hint="عناويني المحفوظة — لا حاجة للكتابة">
            <div className="grid gap-2">
              {me.properties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPropertyId(p.id)}
                  className={`rounded-2xl border p-3 text-left transition-colors ${
                    p.id === propertyId ? "border-primary bg-surface-strong" : "border-border bg-card"
                  }`}
                >
                  <span className="block truncate text-sm font-semibold">
                    {p.label} · {p.zone}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{p.address}</span>
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Slot">
              <Select value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
                {["Now (emergency)", "Today · 6-9 PM", "Tomorrow · 9-12 AM", "Tomorrow · 4-7 PM"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>

            <Field label="Slot">
              <Select value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
                {["Now (emergency)", "Today · 6-9 PM", "Tomorrow · 9-12 AM", "Tomorrow · 4-7 PM"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Priority">
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent (60 min SLA)</option>
            </Select>
          </Field>
          <Field label="Notes for the technician" hint="Mention the brand, model or what you already tried.">
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <Button className="w-full" size="lg" onClick={submit}>
            Send request
          </Button>
        </div>
      </Modal>
    </CustomerShell>
  );
}
