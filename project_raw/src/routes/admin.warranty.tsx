import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  ImageUpload,
  Input,
  Modal,
  SectionTitle,
  Select,
  Stat,
  Textarea,
  dateLabel,
  money,
} from "@/components/kit";
import { useStore } from "@/lib/store";
import type { WarrantyFile } from "@/lib/data";
import { uniqueId } from "@/lib/store";

export const Route = createFileRoute("/admin/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty Vault — Kangaroo Admin" },
      {
        name: "description",
        content:
          "Store warranty cards, serial numbers, suppliers and scanned documents for every Kangaroo customer device.",
      },
      { property: "og:title", content: "Warranty Vault — Kangaroo Admin" },
      { property: "og:description", content: "Device warranties linked to customer records with uploaded documents." },
    ],
  }),
  component: WarrantyAdmin,
});

const blank = (customerId: string): WarrantyFile => ({
  id: uniqueId("WR"),
  customerId,
  device: "",
  serial: "",
  supplier: "",
  startDate: new Date().toISOString().slice(0, 10),
  months: 12,
  documentName: "",
});

const expiry = (w: WarrantyFile) => {
  const d = new Date(w.startDate);
  d.setMonth(d.getMonth() + w.months);
  return d;
};

function WarrantyAdmin() {
  const { warranties, customers, products, upsertWarranty, removeWarranty } = useStore();
  const [draft, setDraft] = useState<WarrantyFile | null>(null);
  const [filter, setFilter] = useState("all");

  const rows = useMemo(
    () => (filter === "all" ? warranties : warranties.filter((w) => w.customerId === filter)),
    [warranties, filter],
  );
  const active = warranties.filter((w) => expiry(w).getTime() > Date.now());
  const covered = warranties.reduce((s, w) => s + (w.purchasePrice ?? 0), 0);
  const nameOf = (id: string) => customers.find((c) => c.id === id)?.name ?? "Unlinked customer";

  const save = () => {
    if (!draft) return;
    if (!draft.customerId || !draft.device.trim()) {
      toast.error("Pick a customer and enter the device");
      return;
    }
    upsertWarranty({ ...draft, documentName: draft.documentName || `warranty-${draft.serial || draft.id}.jpg` });
    toast.success("Warranty file saved");
    setDraft(null);
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Warranty vault"
        subtitle="ملفات الضمان مربوطة بعملاء المنظومة مع صور المستندات"
        action={
          <Button onClick={() => setDraft(blank(customers[0]?.id ?? ""))}>
            <Plus className="h-4 w-4" /> New file
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Files" value={String(warranties.length)} icon={<FileText className="h-4 w-4" />} />
        <Stat label="Active cover" value={String(active.length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <Stat label="Expiring ≤60d" value={String(active.filter((w) => expiry(w).getTime() - Date.now() < 60 * 864e5).length)} />
        <Stat label="Assets value" value={money(covered)} />
      </div>

      <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All customers</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      {rows.length === 0 ? (
        <EmptyState title="No warranty files" body="Add a file and link it to a registered customer." />
      ) : (
        <div className="grid gap-3">
          {rows.map((w) => {
            const end = expiry(w);
            const live = end.getTime() > Date.now();
            return (
              <Card key={w.id}>
                <div className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
                  {w.documentImage ? (
                    <img src={w.documentImage} alt={w.documentName} className="h-24 w-full rounded-2xl object-cover sm:h-24" />
                  ) : (
                    <div className="grid h-24 place-items-center rounded-2xl bg-muted text-xs text-muted-foreground">
                      No scan
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-bold">{w.device}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {nameOf(w.customerId)} · SN {w.serial || "—"} · {w.supplier || "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dateLabel(w.startDate)} → {dateLabel(end.toISOString())} · {w.months} months
                    </p>
                    {w.notes ? <p className="mt-1 text-xs text-muted-foreground">{w.notes}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone={live ? "success" : "danger"}>{live ? "Under warranty" : "Expired"}</Badge>
                      {w.purchasePrice ? <Badge tone="brand">{money(w.purchasePrice)}</Badge> : null}
                      <Badge>{w.documentName}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <Button variant="outline" size="sm" onClick={() => setDraft(w)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        removeWarranty(w.id);
                        toast.success("File removed");
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

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Warranty file" wide>
        {draft ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Customer">
              <Select
                value={draft.customerId}
                onChange={(e) => setDraft({ ...draft, customerId: e.target.value })}
              >
                <option value="">Select a customer…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Device">
              <Select value={draft.device} onChange={(e) => setDraft({ ...draft, device: e.target.value })}>
                <option value="">Custom / type below…</option>
                {products.map((p) => (
                  <option key={p.id} value={`${p.brand} ${p.name}`}>
                    {p.brand} {p.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Device name">
              <Input value={draft.device} onChange={(e) => setDraft({ ...draft, device: e.target.value })} />
            </Field>
            <Field label="Serial number">
              <Input value={draft.serial} onChange={(e) => setDraft({ ...draft, serial: e.target.value })} />
            </Field>
            <Field label="Supplier">
              <Input value={draft.supplier} onChange={(e) => setDraft({ ...draft, supplier: e.target.value })} />
            </Field>
            <Field label="Purchase price (QAR)">
              <Input
                type="number"
                value={draft.purchasePrice ?? 0}
                onChange={(e) => setDraft({ ...draft, purchasePrice: Number(e.target.value) })}
              />
            </Field>
            <Field label="Start date">
              <Input
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
              />
            </Field>
            <Field label="Cover (months)">
              <Input
                type="number"
                value={draft.months}
                onChange={(e) => setDraft({ ...draft, months: Number(e.target.value) })}
              />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                label="Warranty document"
                hint="ارفع صورة كارت الضمان أو الفاتورة"
                value={draft.documentImage}
                onChange={(documentImage) =>
                  setDraft({
                    ...draft,
                    documentImage,
                    documentName: documentImage ? draft.documentName || `warranty-${draft.serial || draft.id}.jpg` : draft.documentName,
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="Internal notes">
                <Textarea value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
              <Button variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button onClick={save}>Save file</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
