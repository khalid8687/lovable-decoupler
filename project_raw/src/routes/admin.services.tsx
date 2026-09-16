import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input, Modal, SectionTitle, Select, Textarea } from "@/components/kit";
import { ServiceIcon, SERVICE_ICON_NAMES } from "@/components/service-icon";
import { useStore, uniqueId } from "@/lib/store";
import type { ServiceCategory } from "@/lib/data";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Service Catalogue — Kangaroo Admin" },
      { name: "description", content: "Create and price the maintenance services shown in the Kangaroo customer app, with SLA per category." },
      { property: "og:title", content: "Service Catalogue — Kangaroo Admin" },
      { property: "og:description", content: "Control which services customers can book, their SLA and starting price." },
    ],
  }),
  component: ServicesAdmin,
});

const empty = (): ServiceCategory => ({
  id: uniqueId("sv"),
  name: "",
  nameAr: "",
  icon: "Wrench",
  slaMinutes: 120,
  fromPrice: 150,
  active: true,
  description: "",
});

function ServicesAdmin() {
  const { services, upsertService, removeService } = useStore();
  const [draft, setDraft] = useState<ServiceCategory | null>(null);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Service catalogue"
        subtitle="الخدمات الظاهرة للعميل والأسعار الابتدائية"
        action={
          <Button onClick={() => setDraft(empty())}>
            <Plus className="h-4 w-4" /> Add service
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-strong text-primary">
                <ServiceIcon name={service.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.nameAr}</p>
              </div>
              <Badge tone={service.active ? "success" : "neutral"}>{service.active ? "live" : "hidden"}</Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{service.description}</p>
            <p className="mt-2 text-sm font-semibold">
              from {service.fromPrice} QAR · SLA {service.slaMinutes}m
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDraft(service)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  removeService(service.id);
                  toast("Service removed");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Service">
        {draft && (
          <div className="space-y-3">
            <Field label="Name (EN)">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Name (AR)">
              <Input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} />
            </Field>
            <Field label="Icon">
              <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                {SERVICE_ICON_NAMES.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="From price (QAR)">
                <Input
                  type="number"
                  value={draft.fromPrice}
                  onChange={(e) => setDraft({ ...draft, fromPrice: Number(e.target.value) })}
                />
              </Field>
              <Field label="SLA (minutes)">
                <Input
                  type="number"
                  value={draft.slaMinutes}
                  onChange={(e) => setDraft({ ...draft, slaMinutes: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <Field label="Visibility">
              <Select
                value={draft.active ? "live" : "hidden"}
                onChange={(e) => setDraft({ ...draft, active: e.target.value === "live" })}
              >
                <option value="live">Live in app</option>
                <option value="hidden">Hidden</option>
              </Select>
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                if (!draft.name) {
                  toast.error("Name is required");
                  return;
                }
                upsertService(draft);
                setDraft(null);
                toast.success("Catalogue updated");
              }}
            >
              Save service
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
