import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, Input, Modal, SectionTitle, Select } from "@/components/kit";
import { useStore, uniqueId } from "@/lib/store";
import type { AppUser } from "@/lib/data";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Team — Kangaroo Admin" },
      { name: "description", content: "Add customers, technicians and admins, set zones and control access to the Kangaroo apps." },
      { property: "og:title", content: "Users & Team — Kangaroo Admin" },
      { property: "og:description", content: "Role-based user management for the Kangaroo operations platform." },
    ],
  }),
  component: UsersAdmin,
});

const empty = (): AppUser => ({ id: uniqueId("us"), name: "", role: "customer", phone: "", zone: "Doha", active: true });

const PERMISSIONS = ["dispatch", "jobs", "finance", "store", "customers", "settings", "all"];

function UsersAdmin() {
  const { users, technicians, customers, upsertUser, removeUser, upsertTechnician } = useStore();
  const [draft, setDraft] = useState<AppUser | null>(null);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Users & team"
        subtitle="إضافة المستخدمين والفنيين وتحديد الصلاحيات"
        action={
          <Button onClick={() => setDraft(empty())}>
            <Plus className="h-4 w-4" /> Add user
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const linked = customers.find((c) => c.id === user.customerId);
          return (
          <Card key={user.id}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.phone} · {user.zone}
                </p>
                {user.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
                {linked ? (
                  <p className="mt-1 truncate text-xs text-primary">CRM: {linked.name} · {linked.tier}</p>
                ) : null}
                {user.permissions?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {user.permissions.map((p) => (
                      <Badge key={p}>{p}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <Badge tone={user.role === "admin" ? "danger" : user.role === "technician" ? "warning" : "brand"}>
                {user.role}
              </Badge>
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDraft(user)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  removeUser(user.id);
                  toast("User removed");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
          );
        })}
      </div>

      <SectionTitle title="Technician roster" subtitle="Availability drives dispatch options" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {technicians.map((tech) => (
          <Card key={tech.id}>
            <p className="truncate font-semibold">{tech.name}</p>
            <p className="text-xs text-muted-foreground">
              {tech.trade} · {tech.zone} · ⭐ {tech.rating}
            </p>
            <Select
              className="mt-3"
              value={tech.status}
              onChange={(e) => upsertTechnician({ ...tech, status: e.target.value as typeof tech.status })}
            >
              <option value="available">available</option>
              <option value="on-job">on-job</option>
              <option value="off">off duty</option>
            </Select>
          </Card>
        ))}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="User">
        {draft && (
          <div className="space-y-3">
            <Field label="Full name">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
            <Field label="Zone">
              <Input value={draft.zone} onChange={(e) => setDraft({ ...draft, zone: e.target.value })} />
            </Field>
            <Field label="Role">
              <Select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as AppUser["role"] })}>
                <option value="customer">customer</option>
                <option value="technician">technician</option>
                <option value="admin">admin</option>
              </Select>
            </Field>
            <Field label="Email">
              <Input value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </Field>
            {draft.role === "customer" ? (
              <Field label="Linked customer record" hint="Ties this login to a CRM file">
                <Select
                  value={draft.customerId ?? ""}
                  onChange={(e) => setDraft({ ...draft, customerId: e.target.value || undefined })}
                >
                  <option value="">Not linked</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.phone}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}
            <Field label="Permissions">
              <div className="flex flex-wrap gap-2">
                {PERMISSIONS.map((p) => {
                  const on = draft.permissions?.includes(p) ?? false;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          permissions: on
                            ? (draft.permissions ?? []).filter((x) => x !== p)
                            : [...(draft.permissions ?? []), p],
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        on ? "brand-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                if (!draft.name) {
                  toast.error("Name is required");
                  return;
                }
                upsertUser(draft);
                setDraft(null);
                toast.success("User saved");
              }}
            >
              Save user
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
