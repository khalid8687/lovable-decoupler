import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input, Modal, SectionTitle, Textarea } from "@/components/kit";
import { useStore, uniqueId } from "@/lib/store";
import type { DeviceKnowledge } from "@/lib/data";

export const Route = createFileRoute("/admin/agent")({
  head: () => ({
    meta: [
      { title: "AI Knowledge Base — Kangaroo Admin" },
      {
        name: "description",
        content: "Teach Roo, the Kangaroo AI agent: register devices, fault symptoms, camera checks and safe step-by-step fixes.",
      },
      { property: "og:title", content: "AI Knowledge Base — Kangaroo Admin" },
      { property: "og:description", content: "Every appliance and guided repair script the AI agent can use with customers." },
    ],
  }),
  component: AgentKnowledge,
});

const emptyDevice = (): DeviceKnowledge => ({
  id: uniqueId("dv"),
  brand: "",
  model: "",
  category: "Home Appliances",
  warrantyMonths: 12,
  symptoms: [{ label: "", keywords: [], visualCheck: "", steps: [""], escalateTo: "" }],
});

function AgentKnowledge() {
  const { devices, upsertDevice, removeDevice, services } = useStore();
  const [draft, setDraft] = useState<DeviceKnowledge | null>(null);

  const save = () => {
    if (!draft) return;
    if (!draft.brand || !draft.model) {
      toast.error("Brand and model are required");
      return;
    }
    upsertDevice({
      ...draft,
      symptoms: draft.symptoms
        .filter((s) => s.label)
        .map((s) => ({ ...s, steps: s.steps.filter(Boolean) })),
    });
    setDraft(null);
    toast.success("Roo has learned this device");
  };

  const patchSymptom = (index: number, patch: Partial<DeviceKnowledge["symptoms"][number]>) =>
    setDraft((d) =>
      d ? { ...d, symptoms: d.symptoms.map((s, i) => (i === index ? { ...s, ...patch } : s)) } : d,
    );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="AI knowledge base"
        subtitle="قاعدة معرفة الوكيل الذكي — الأجهزة والأعطال وخطوات الإصلاح"
        action={
          <Button onClick={() => setDraft(emptyDevice())}>
            <Plus className="h-4 w-4" /> Add device
          </Button>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {devices.map((device) => (
          <Card key={device.id}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {device.brand} {device.model}
                </p>
                <p className="text-xs text-muted-foreground">
                  {device.category} · warranty {device.warrantyMonths} mo
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => setDraft(device)}>
                  Edit
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeDevice(device.id);
                    toast("Device removed");
                  }}
                  aria-label="Remove device"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {device.symptoms.map((symptom) => (
                <div key={symptom.label} className="rounded-2xl bg-surface p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-sm font-semibold">{symptom.label}</p>
                    {symptom.escalateTo ? <Badge tone="brand">{symptom.escalateTo}</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">📷 {symptom.visualCheck}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
                    {symptom.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Device the AI agent can support" wide>
        {draft && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Brand">
                <Input value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} />
              </Field>
              <Field label="Model">
                <Input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} />
              </Field>
              <Field label="Service category">
                <Input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  list="service-names"
                />
              </Field>
              <Field label="Warranty (months)">
                <Input
                  type="number"
                  value={draft.warrantyMonths}
                  onChange={(e) => setDraft({ ...draft, warrantyMonths: Number(e.target.value) })}
                />
              </Field>
            </div>
            <datalist id="service-names">
              {services.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>

            {draft.symptoms.map((symptom, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-border p-4">
                <Field label="Fault name">
                  <Input value={symptom.label} onChange={(e) => patchSymptom(index, { label: e.target.value })} />
                </Field>
                <Field label="Trigger keywords" hint="Comma separated, Arabic works too.">
                  <Input
                    value={symptom.keywords.join(", ")}
                    onChange={(e) => patchSymptom(index, { keywords: e.target.value.split(",").map((k) => k.trim()) })}
                  />
                </Field>
                <Field label="What should Roo look at on camera?">
                  <Input value={symptom.visualCheck} onChange={(e) => patchSymptom(index, { visualCheck: e.target.value })} />
                </Field>
                <Field label="Guided steps" hint="One step per line — Roo reads them out one at a time.">
                  <Textarea
                    value={symptom.steps.join("\n")}
                    onChange={(e) => patchSymptom(index, { steps: e.target.value.split("\n") })}
                  />
                </Field>
                <Field label="Escalate to service">
                  <Input
                    value={symptom.escalateTo ?? ""}
                    onChange={(e) => patchSymptom(index, { escalateTo: e.target.value })}
                    list="service-names"
                  />
                </Field>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setDraft({
                    ...draft,
                    symptoms: [...draft.symptoms, { label: "", keywords: [], visualCheck: "", steps: [""], escalateTo: "" }],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add fault
              </Button>
              <Button onClick={save}>Save to knowledge base</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
