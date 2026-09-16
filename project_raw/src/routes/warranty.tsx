import { createFileRoute } from "@tanstack/react-router";
import { FileText, ShieldCheck } from "lucide-react";
import { CustomerShell } from "@/components/shells";
import { Badge, Card, EmptyState } from "@/components/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty Vault — Kangaroo Home Care" },
      { name: "description", content: "Every appliance warranty, serial number and supplier contact filed and monitored by Kangaroo engineers in Qatar." },
      { property: "og:title", content: "Warranty Vault — Kangaroo Home Care" },
      { property: "og:description", content: "Managed warranty records with expiry tracking and supplier coordination." },
    ],
  }),
  component: WarrantyPage,
});

const monthsLeft = (start: string, months: number) => {
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  return Math.round((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
};

function WarrantyPage() {
  const { warranties } = useStore();

  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">Warranty vault</h1>
        <p className="text-sm text-muted-foreground">ملفات الضمان للأجهزة الداخلة في المنظومة</p>
      </div>
      <div className="space-y-3 px-4 pt-4">
        {warranties.length === 0 ? (
          <EmptyState title="No warranty files" body="Files appear here once the admin registers your devices." />
        ) : (
          warranties.map((w) => {
            const left = monthsLeft(w.startDate, w.months);
            return (
              <Card key={w.id}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-strong text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{w.device}</p>
                    <p className="text-xs text-muted-foreground">
                      SN {w.serial} · {w.supplier}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3 shrink-0" /> {w.documentName}
                    </p>
                  </div>
                  <Badge tone={left > 6 ? "success" : left > 0 ? "warning" : "danger"}>
                    {left > 0 ? `${left} mo left` : "expired"}
                  </Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </CustomerShell>
  );
}
