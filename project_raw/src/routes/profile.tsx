import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Plus, Trash2, ShieldCheck, Wallet, Star, Languages } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  ImageUpload,
  Input,
  KeyValue,
  Modal,
  Select,
  Stat,
  Tabs,
  Textarea,
  Toggle,
  dateLabel,
  money,
} from "@/components/kit";
import { useStore, uniqueId } from "@/lib/store";
import type { CustomerProperty } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Account — Kangaroo Home Care Qatar" },
      {
        name: "description",
        content:
          "Your Kangaroo profile: saved properties, contract and tier, payment preference, warranty devices and service history in Qatar.",
      },
      { property: "og:title", content: "My Account — Kangaroo Home Care" },
      { property: "og:description", content: "Saved addresses, contract details, warranties and spend in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const emptyProperty = (): CustomerProperty => ({
  id: uniqueId("pr"),
  label: "",
  type: "villa",
  zone: "West Bay",
  address: "",
});

function ProfilePage() {
  const { me, updateMe, orders, warranties, settings } = useStore();
  const [tab, setTab] = useState<"profile" | "places" | "assets" | "prefs">("profile");
  const [draft, setDraft] = useState<CustomerProperty | null>(null);

  const mine = orders.filter((o) => o.customerId === me.id);
  const spend = mine.reduce((s, o) => s + o.amount, 0);
  const myWarranties = warranties.filter((w) => w.customerId === me.id);

  const saveProperty = () => {
    if (!draft) return;
    if (!draft.label.trim() || !draft.address.trim()) {
      toast.error("Add a label and address");
      return;
    }
    const exists = me.properties.some((p) => p.id === draft.id);
    updateMe({
      properties: exists ? me.properties.map((p) => (p.id === draft.id ? draft : p)) : [...me.properties, draft],
      defaultPropertyId: me.properties.length === 0 ? draft.id : me.defaultPropertyId,
    });
    setDraft(null);
    toast.success("Address saved");
  };

  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <Avatar name={me.name} src={me.avatar} size={60} />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{me.name}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {me.phone} · member since {dateLabel(me.joinedAt)}
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge tone="brand">{me.tier}</Badge>
              <Badge tone={me.contractType === "none" ? "neutral" : "success"}>
                {me.contractType === "none" ? "no contract" : `${me.contractType} contract`}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Requests" value={String(mine.length)} icon={<Home className="h-4 w-4" />} />
          <Stat label="Lifetime spend" value={money(spend)} icon={<Wallet className="h-4 w-4" />} />
          <Stat label="Devices covered" value={String(myWarranties.length)} icon={<ShieldCheck className="h-4 w-4" />} />
          <Stat label="Credit limit" value={money(me.creditLimit)} icon={<Star className="h-4 w-4" />} />
        </div>

        <div className="mt-4">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "profile", label: "Profile" },
              { id: "places", label: `Places (${me.properties.length})` },
              { id: "assets", label: "My devices" },
              { id: "prefs", label: "Preferences" },
            ]}
          />
        </div>

        {tab === "profile" ? (
          <div className="mt-4 space-y-3">
            <Card className="space-y-3">
              <ImageUpload
                label="Profile picture"
                aspect="aspect-square max-w-[160px]"
                value={me.avatar}
                onChange={(avatar) => updateMe({ avatar })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name">
                  <Input value={me.name} onChange={(e) => updateMe({ name: e.target.value })} />
                </Field>
                <Field label="Arabic name">
                  <Input value={me.nameAr ?? ""} onChange={(e) => updateMe({ nameAr: e.target.value })} />
                </Field>
                <Field label="Mobile">
                  <Input value={me.phone} onChange={(e) => updateMe({ phone: e.target.value })} />
                </Field>
                <Field label="Alternative phone">
                  <Input value={me.altPhone ?? ""} onChange={(e) => updateMe({ altPhone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <Input value={me.email ?? ""} onChange={(e) => updateMe({ email: e.target.value })} />
                </Field>
                <Field label="WhatsApp">
                  <Input value={me.whatsapp ?? ""} onChange={(e) => updateMe({ whatsapp: e.target.value })} />
                </Field>
                <Field label="QID">
                  <Input value={me.qid ?? ""} onChange={(e) => updateMe({ qid: e.target.value })} />
                </Field>
                <Field label="Language">
                  <Select value={me.language} onChange={(e) => updateMe({ language: e.target.value as "en" | "ar" })}>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </Select>
                </Field>
              </div>
              <Field label="Notes for our engineers" hint="Gate code, pets, best time to call…">
                <Textarea value={me.notes ?? ""} onChange={(e) => updateMe({ notes: e.target.value })} />
              </Field>
            </Card>
            <Card>
              <p className="font-semibold">Account summary</p>
              <div className="mt-2 divide-y divide-border">
                <KeyValue label="Customer ID" value={me.id.toUpperCase()} />
                <KeyValue label="Tier" value={me.tier} />
                <KeyValue label="Contract" value={me.contractType} />
                <KeyValue label="Renewal" value={me.contractRenewal ? dateLabel(me.contractRenewal) : "—"} />
                <KeyValue label="Payment" value={me.paymentMethod} />
                <KeyValue label="Support line" value={settings.phone} />
              </div>
            </Card>
          </div>
        ) : null}

        {tab === "places" ? (
          <div className="mt-4 space-y-3">
            {me.properties.map((p) => (
              <Card key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {p.label} <span className="text-xs font-normal text-muted-foreground">· {p.type}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.zone} — {p.address}
                  </p>
                  {p.gateNote ? <p className="text-xs text-muted-foreground">Gate: {p.gateNote}</p> : null}
                  {p.id === me.defaultPropertyId ? (
                    <Badge tone="success" className="mt-2">
                      Default
                    </Badge>
                  ) : (
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold text-primary"
                      onClick={() => updateMe({ defaultPropertyId: p.id })}
                    >
                      Make default
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDraft(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => updateMe({ properties: me.properties.filter((x) => x.id !== p.id) })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Button className="w-full" variant="outline" onClick={() => setDraft(emptyProperty())}>
              <Plus className="h-4 w-4" /> Add a place
            </Button>
          </div>
        ) : null}

        {tab === "assets" ? (
          <div className="mt-4 space-y-3">
            {myWarranties.length === 0 ? (
              <Card>
                <p className="text-sm text-muted-foreground">No registered devices yet.</p>
              </Card>
            ) : (
              myWarranties.map((w) => (
                <Card key={w.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  {w.documentImage ? (
                    <img src={w.documentImage} alt={w.device} className="h-16 w-16 rounded-xl object-cover" />
                  ) : (
                    <span className="grid h-16 w-16 place-items-center rounded-xl bg-surface-strong text-primary">
                      <ShieldCheck className="h-6 w-6" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{w.device}</p>
                    <p className="text-xs text-muted-foreground">
                      SN {w.serial} · {w.supplier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cover {w.months} months from {dateLabel(w.startDate)}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : null}

        {tab === "prefs" ? (
          <div className="mt-4 space-y-3">
            <Card className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Preferred visit window">
                  <Select
                    value={me.preferredWindow}
                    onChange={(e) => updateMe({ preferredWindow: e.target.value as "morning" | "afternoon" | "evening" })}
                  >
                    <option value="morning">Morning 8-12</option>
                    <option value="afternoon">Afternoon 12-5</option>
                    <option value="evening">Evening 5-9</option>
                  </Select>
                </Field>
                <Field label="Payment method">
                  <Select
                    value={me.paymentMethod}
                    onChange={(e) => updateMe({ paymentMethod: e.target.value as "cash" | "card" | "account" })}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="account">Company account</option>
                  </Select>
                </Field>
              </div>
              <Toggle
                label="Arabic interface hints"
                hint="تظهر المساعدة بالعربية داخل البرنامج"
                checked={me.language === "ar"}
                onChange={(v) => updateMe({ language: v ? "ar" : "en" })}
              />
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl bg-surface p-3 text-xs text-muted-foreground">
                <Languages className="h-4 w-4 shrink-0" />
                <span>Roo, our AI agent, speaks {me.language === "ar" ? "Arabic" : "English"} on calls.</span>
              </div>
            </Card>
          </div>
        ) : null}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Saved place">
        {draft ? (
          <div className="space-y-3">
            <Field label="Label">
              <Input
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Villa 22"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <Select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value as CustomerProperty["type"] })}
                >
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
                  <option value="compound">Compound</option>
                </Select>
              </Field>
              <Field label="Zone">
                <Select value={draft.zone} onChange={(e) => setDraft({ ...draft, zone: e.target.value })}>
                  {settings.zones.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Address">
              <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Unit">
                <Input value={draft.unit ?? ""} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} />
              </Field>
              <Field label="Gate note">
                <Input value={draft.gateNote ?? ""} onChange={(e) => setDraft({ ...draft, gateNote: e.target.value })} />
              </Field>
            </div>
            <Button className="w-full" onClick={saveProperty}>
              Save place
            </Button>
          </div>
        ) : null}
      </Modal>
    </CustomerShell>
  );
}
