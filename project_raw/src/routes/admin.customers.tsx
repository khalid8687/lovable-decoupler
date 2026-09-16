import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Phone, MapPin, Wallet, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  ImageUpload,
  Input,
  KeyValue,
  Modal,
  SectionTitle,
  Select,
  Stat,
  Tabs,
  Textarea,
  dateLabel,
  money,
  timeAgo,
} from "@/components/kit";
import { useStore, uniqueId } from "@/lib/store";
import type { Customer, CustomerProperty } from "@/lib/data";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customer CRM — Kangaroo Admin" },
      {
        name: "description",
        content:
          "Full customer records for Kangaroo Qatar: contacts, properties, contracts, tiers, credit limits, devices and job history.",
      },
      { property: "og:title", content: "Customer CRM — Kangaroo Admin" },
      { property: "og:description", content: "Every customer detail the operations team needs, in one record." },
    ],
  }),
  component: CustomersAdmin,
});

const blankCustomer = (zone: string): Customer => {
  const pid = uniqueId("pr");
  return {
    id: uniqueId("cu"),
    name: "",
    phone: "",
    language: "en",
    tier: "standard",
    contractType: "none",
    joinedAt: new Date().toISOString(),
    properties: [{ id: pid, label: "Main address", type: "villa", zone, address: "" }],
    defaultPropertyId: pid,
    preferredWindow: "evening",
    paymentMethod: "cash",
    creditLimit: 0,
    tags: [],
    active: true,
  };
};

function CustomersAdmin() {
  const { customers, orders, warranties, reports, settings, upsertCustomer, removeCustomer, setCurrentCustomer } =
    useStore();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("all");
  const [draft, setDraft] = useState<Customer | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"details" | "places" | "history">("details");

  const rows = useMemo(
    () =>
      customers.filter(
        (c) =>
          (tier === "all" || c.tier === tier) &&
          `${c.name} ${c.nameAr ?? ""} ${c.phone} ${c.email ?? ""} ${c.tags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [customers, query, tier],
  );

  const stats = (id: string) => {
    const mine = orders.filter((o) => o.customerId === id);
    const open = mine.filter((o) => o.status !== "completed" && o.status !== "cancelled");
    return {
      jobs: mine.length,
      total: mine.reduce((s, o) => s + o.amount, 0),
      open: open.reduce((s, o) => s + o.amount, 0),
      last: mine[0]?.createdAt,
      devices: warranties.filter((w) => w.customerId === id).length,
      calls: reports.filter((r) => r.customerId === id).length,
    };
  };

  const open = customers.find((c) => c.id === openId) ?? null;
  const openStats = open ? stats(open.id) : null;

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    upsertCustomer(draft);
    setDraft(null);
    toast.success("Customer saved");
  };

  const patchProperty = (id: string, patch: Partial<CustomerProperty>) =>
    setDraft((d) =>
      d ? { ...d, properties: d.properties.map((p) => (p.id === id ? { ...p, ...patch } : p)) } : d,
    );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Customer CRM"
        subtitle="كل بيانات العميل: العناوين، العقود، الرصيد، الأجهزة والسجل"
        action={
          <Button onClick={() => setDraft(blankCustomer(settings.zones[0] ?? "West Bay"))}>
            <Plus className="h-4 w-4" /> New customer
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Customers" value={String(customers.length)} icon={<Users className="h-4 w-4" />} />
        <Stat label="On contract" value={String(customers.filter((c) => c.contractType !== "none").length)} />
        <Stat
          label="Receivables"
          value={money(customers.reduce((s, c) => s + stats(c.id).open, 0))}
          icon={<Wallet className="h-4 w-4" />}
        />
        <Stat label="Devices filed" value={String(warranties.length)} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, tag…"
            className="pl-9"
          />
        </div>
        <Select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="all">All tiers</option>
          {["standard", "silver", "gold", "platinum"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No customers" body="Adjust the filters or add a new record." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((c) => {
            const s = stats(c.id);
            return (
              <Card key={c.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                <Avatar name={c.name || "?"} src={c.avatar} size={52} />
                <div className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate font-bold">{c.name}</p>
                    <Badge tone={c.tier === "platinum" ? "brand" : c.tier === "gold" ? "warning" : "neutral"}>
                      {c.tier}
                    </Badge>
                  </div>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {c.properties.length} place(s) · {c.properties[0]?.zone ?? "—"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <Badge>{s.jobs} jobs</Badge>
                    <Badge tone="success">{money(s.total)}</Badge>
                    {s.open ? <Badge tone="danger">{money(s.open)} due</Badge> : null}
                    {c.contractType !== "none" ? <Badge tone="brand">{c.contractType}</Badge> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setOpenId(c.id);
                        setTab("details");
                      }}
                    >
                      Open file
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDraft(c)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setCurrentCustomer(c.id);
                        toast.success(`App is now signed in as ${c.name}`);
                      }}
                    >
                      Impersonate
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        removeCustomer(c.id);
                        toast.success("Customer removed");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Customer file */}
      <Modal open={!!open} onClose={() => setOpenId(null)} title={open?.name ?? ""} wide>
        {open && openStats ? (
          <div className="space-y-4">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "details", label: "Details" },
                { id: "places", label: `Places (${open.properties.length})` },
                { id: "history", label: `History (${openStats.jobs})` },
              ]}
            />
            {tab === "details" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="divide-y divide-border">
                  <KeyValue label="Customer ID" value={open.id.toUpperCase()} />
                  <KeyValue label="Arabic name" value={open.nameAr ?? "—"} />
                  <KeyValue label="Phone" value={open.phone} />
                  <KeyValue label="Alt phone" value={open.altPhone ?? "—"} />
                  <KeyValue label="WhatsApp" value={open.whatsapp ?? "—"} />
                  <KeyValue label="Email" value={open.email ?? "—"} />
                  <KeyValue label="QID" value={open.qid ?? "—"} />
                  <KeyValue label="Language" value={open.language === "ar" ? "العربية" : "English"} />
                </Card>
                <Card className="divide-y divide-border">
                  <KeyValue label="Tier" value={open.tier} />
                  <KeyValue label="Contract" value={open.contractType} />
                  <KeyValue label="Renewal" value={open.contractRenewal ? dateLabel(open.contractRenewal) : "—"} />
                  <KeyValue label="Joined" value={dateLabel(open.joinedAt)} />
                  <KeyValue label="Payment" value={open.paymentMethod} />
                  <KeyValue label="Credit limit" value={money(open.creditLimit)} />
                  <KeyValue label="Lifetime value" value={money(openStats.total)} />
                  <KeyValue label="Outstanding" value={openStats.open ? money(openStats.open) : "—"} />
                  <KeyValue label="AI calls" value={String(openStats.calls)} />
                  <KeyValue label="Devices" value={String(openStats.devices)} />
                </Card>
                {open.notes ? (
                  <Card className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                    <p className="mt-1 text-sm">{open.notes}</p>
                  </Card>
                ) : null}
                {open.tags.length ? (
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    {open.tags.map((t) => (
                      <Badge key={t} tone="brand">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {tab === "places" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {open.properties.map((p) => (
                  <Card key={p.id}>
                    <p className="truncate font-semibold">
                      {p.label} · {p.type}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.zone}</p>
                    <p className="mt-1 text-sm">{p.address}</p>
                    {p.unit ? <p className="text-xs text-muted-foreground">Unit {p.unit}</p> : null}
                    {p.gateNote ? <p className="text-xs text-muted-foreground">Gate: {p.gateNote}</p> : null}
                    {p.id === open.defaultPropertyId ? (
                      <Badge tone="success" className="mt-2">
                        Default
                      </Badge>
                    ) : null}
                  </Card>
                ))}
              </div>
            ) : null}

            {tab === "history" ? (
              <div className="space-y-2">
                {orders.filter((o) => o.customerId === open.id).length === 0 ? (
                  <EmptyState title="No jobs yet" body="Requests will appear here." />
                ) : (
                  orders
                    .filter((o) => o.customerId === open.id)
                    .map((o) => (
                      <Card key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {o.id} · {o.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(o.createdAt)} · {o.zone} · {o.source}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{money(o.amount)}</p>
                          <Badge tone={o.status === "completed" ? "success" : "warning"}>{o.status}</Badge>
                        </div>
                      </Card>
                    ))
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {/* Editor */}
      <Modal open={!!draft} onClose={() => setDraft(null)} title="Customer record" wide>
        {draft ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload
                label="Photo"
                aspect="aspect-square max-w-[150px]"
                value={draft.avatar}
                onChange={(avatar) => setDraft({ ...draft, avatar })}
              />
            </div>
            <Field label="Full name">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Arabic name">
              <Input value={draft.nameAr ?? ""} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
            <Field label="Alt phone">
              <Input value={draft.altPhone ?? ""} onChange={(e) => setDraft({ ...draft, altPhone: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </Field>
            <Field label="WhatsApp">
              <Input value={draft.whatsapp ?? ""} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} />
            </Field>
            <Field label="QID">
              <Input value={draft.qid ?? ""} onChange={(e) => setDraft({ ...draft, qid: e.target.value })} />
            </Field>
            <Field label="Language">
              <Select
                value={draft.language}
                onChange={(e) => setDraft({ ...draft, language: e.target.value as "en" | "ar" })}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </Select>
            </Field>
            <Field label="Tier">
              <Select value={draft.tier} onChange={(e) => setDraft({ ...draft, tier: e.target.value as Customer["tier"] })}>
                {["standard", "silver", "gold", "platinum"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Contract">
              <Select
                value={draft.contractType}
                onChange={(e) => setDraft({ ...draft, contractType: e.target.value as Customer["contractType"] })}
              >
                {["none", "monthly", "annual", "warranty"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Contract renewal">
              <Input
                type="date"
                value={(draft.contractRenewal ?? "").slice(0, 10)}
                onChange={(e) => setDraft({ ...draft, contractRenewal: e.target.value })}
              />
            </Field>
            <Field label="Payment method">
              <Select
                value={draft.paymentMethod}
                onChange={(e) => setDraft({ ...draft, paymentMethod: e.target.value as Customer["paymentMethod"] })}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="account">Company account</option>
              </Select>
            </Field>
            <Field label="Credit limit (QAR)">
              <Input
                type="number"
                value={draft.creditLimit}
                onChange={(e) => setDraft({ ...draft, creditLimit: Number(e.target.value) })}
              />
            </Field>
            <Field label="Preferred window">
              <Select
                value={draft.preferredWindow}
                onChange={(e) =>
                  setDraft({ ...draft, preferredWindow: e.target.value as Customer["preferredWindow"] })
                }
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Select>
            </Field>
            <Field label="Tags" hint="Comma separated">
              <Input
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Internal notes">
                <Textarea value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </Field>
            </div>

            <div className="space-y-3 sm:col-span-2">
              <p className="text-sm font-bold">Properties</p>
              {draft.properties.map((p) => (
                <Card key={p.id} className="grid gap-3 sm:grid-cols-2">
                  <Field label="Label">
                    <Input value={p.label} onChange={(e) => patchProperty(p.id, { label: e.target.value })} />
                  </Field>
                  <Field label="Zone">
                    <Select value={p.zone} onChange={(e) => patchProperty(p.id, { zone: e.target.value })}>
                      {settings.zones.map((z) => (
                        <option key={z}>{z}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Type">
                    <Select
                      value={p.type}
                      onChange={(e) => patchProperty(p.id, { type: e.target.value as CustomerProperty["type"] })}
                    >
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="office">Office</option>
                      <option value="compound">Compound</option>
                    </Select>
                  </Field>
                  <Field label="Unit">
                    <Input value={p.unit ?? ""} onChange={(e) => patchProperty(p.id, { unit: e.target.value })} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Address">
                      <Input value={p.address} onChange={(e) => patchProperty(p.id, { address: e.target.value })} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={p.id === draft.defaultPropertyId ? "primary" : "outline"}
                      onClick={() => setDraft({ ...draft, defaultPropertyId: p.id })}
                    >
                      {p.id === draft.defaultPropertyId ? "Default" : "Make default"}
                    </Button>
                    {draft.properties.length > 1 ? (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          setDraft({ ...draft, properties: draft.properties.filter((x) => x.id !== p.id) })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setDraft({
                    ...draft,
                    properties: [
                      ...draft.properties,
                      {
                        id: uniqueId("pr"),
                        label: "New place",
                        type: "apartment",
                        zone: settings.zones[0] ?? "West Bay",
                        address: "",
                      },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add property
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
              <Button variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button onClick={save}>Save customer</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
