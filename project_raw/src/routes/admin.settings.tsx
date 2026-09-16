import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Badge, Button, Card, Field, Input, SectionTitle, Toggle } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Administration — Kangaroo Admin" },
      {
        name: "description",
        content:
          "Company profile, service zones, VAT, call-out fees, dispatch rules and AI voice settings for Kangaroo Home Care Qatar.",
      },
      { property: "og:title", content: "Administration — Kangaroo Admin" },
      { property: "og:description", content: "Control the pricing rules, zones and automation of the whole platform." },
    ],
  }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { settings, updateSettings, resetDemo, customers, users, technicians, orders } = useStore();
  const [zone, setZone] = useState("");

  return (
    <div className="space-y-4">
      <SectionTitle title="Administration" subtitle="إعدادات الشركة والتسعير والمناطق والتشغيل الآلي" />

      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <p className="font-bold">Company profile</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company name">
            <Input value={settings.companyName} onChange={(e) => updateSettings({ companyName: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <Input value={settings.tagline} onChange={(e) => updateSettings({ tagline: e.target.value })} />
          </Field>
          <Field label="Support phone">
            <Input value={settings.phone} onChange={(e) => updateSettings({ phone: e.target.value })} />
          </Field>
          <Field label="Emergency line">
            <Input value={settings.emergency} onChange={(e) => updateSettings({ emergency: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={settings.email} onChange={(e) => updateSettings({ email: e.target.value })} />
          </Field>
          <Field label="Working hours">
            <Input value={settings.workingHours} onChange={(e) => updateSettings({ workingHours: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Head office address">
              <Input value={settings.address} onChange={(e) => updateSettings({ address: e.target.value })} />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="font-bold">Commercial rules</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="VAT %">
            <Input
              type="number"
              value={settings.vatPercent}
              onChange={(e) => updateSettings({ vatPercent: Number(e.target.value) })}
            />
          </Field>
          <Field label="Call-out fee">
            <Input
              type="number"
              value={settings.callOutFee}
              onChange={(e) => updateSettings({ callOutFee: Number(e.target.value) })}
            />
          </Field>
          <Field label="Emergency surcharge">
            <Input
              type="number"
              value={settings.emergencySurcharge}
              onChange={(e) => updateSettings({ emergencySurcharge: Number(e.target.value) })}
            />
          </Field>
          <Field label="Free delivery over">
            <Input
              type="number"
              value={settings.freeDeliveryOver}
              onChange={(e) => updateSettings({ freeDeliveryOver: Number(e.target.value) })}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="font-bold">Service zones</p>
        <div className="flex flex-wrap gap-2">
          {settings.zones.map((z) => (
            <span key={z} className="flex items-center gap-1 rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold">
              {z}
              <button
                type="button"
                aria-label={`Remove ${z}`}
                onClick={() => updateSettings({ zones: settings.zones.filter((x) => x !== z) })}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <Input value={zone} onChange={(e) => setZone(e.target.value)} placeholder="Add a zone…" />
          <Button
            onClick={() => {
              const v = zone.trim();
              if (!v) return;
              updateSettings({ zones: [...new Set([...settings.zones, v])] });
              setZone("");
              toast.success("Zone added");
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <p className="font-bold">Automation</p>
        <Toggle
          label="Auto-dispatch new requests"
          hint="Assign the nearest available technician automatically"
          checked={settings.autoDispatch}
          onChange={(autoDispatch) => updateSettings({ autoDispatch })}
        />
        <Toggle
          label="Roo AI voice calls"
          hint="Customers can call the AI agent and share their camera"
          checked={settings.aiVoiceEnabled}
          onChange={(aiVoiceEnabled) => updateSettings({ aiVoiceEnabled })}
        />
        <Toggle
          label="Store enabled"
          hint="Show the product store and cart inside the customer app"
          checked={settings.storeEnabled}
          onChange={(storeEnabled) => updateSettings({ storeEnabled })}
        />
      </Card>

      <Card className="space-y-3">
        <p className="font-bold">Platform snapshot</p>
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{customers.length} customers</Badge>
          <Badge tone="brand">{users.length} users</Badge>
          <Badge tone="brand">{technicians.length} technicians</Badge>
          <Badge tone="brand">{orders.length} orders</Badge>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            resetDemo();
            toast.success("Demo data restored");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset demo data
        </Button>
      </Card>
    </div>
  );
}
