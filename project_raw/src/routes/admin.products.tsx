import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Field, ImageUpload, Input, Modal, SectionTitle, Select, Textarea, money } from "@/components/kit";
import { useStore, uniqueId } from "@/lib/store";
import { IMAGES, productImage, type ImageKey, type Product } from "@/lib/data";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Store Manager — Kangaroo Admin" },
      { name: "description", content: "Manage store products, images, pricing, stock and warranty length for the Kangaroo app shop." },
      { property: "og:title", content: "Store Manager — Kangaroo Admin" },
      { property: "og:description", content: "Full control of the in-app appliance store catalogue." },
    ],
  }),
  component: ProductsAdmin,
});

const IMAGE_KEYS = Object.keys(IMAGES) as ImageKey[];

const empty = (): Product => ({
  id: uniqueId("pr"),
  name: "",
  brand: "",
  category: "Home Appliances",
  price: 0,
  stock: 0,
  imageKey: "ac",
  warrantyMonths: 12,
  description: "",
  active: true,
});

function ProductsAdmin() {
  const { products, upsertProduct, removeProduct } = useStore();
  const [draft, setDraft] = useState<Product | null>(null);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Store manager"
        subtitle="إضافة المنتجات والصور والأسعار والمخزون"
        action={
          <Button onClick={() => setDraft(empty())}>
            <Plus className="h-4 w-4" /> Add product
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="p-4">
            <img
              src={productImage(product)}
              alt={product.name}
              loading="lazy"
              width={912}
              height={912}
              className="h-32 w-full rounded-xl bg-surface object-contain p-2"
            />
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.brand} · {product.category}
                </p>
              </div>
              <Badge tone={product.active ? "success" : "neutral"}>{product.active ? "live" : "hidden"}</Badge>
            </div>
            <p className="mt-2 text-sm font-bold text-primary">{money(product.price)}</p>
            <p className="text-xs text-muted-foreground">
              stock {product.stock} · warranty {product.warrantyMonths} mo
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDraft(product)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  removeProduct(product.id);
                  toast("Product removed");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!draft} onClose={() => setDraft(null)} title="Product" wide>
        {draft && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </Field>
              <Field label="Brand">
                <Input value={draft.brand} onChange={(e) => setDraft({ ...draft, brand: e.target.value })} />
              </Field>
              <Field label="Category">
                <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </Field>
              <Field label="Price (QAR)">
                <Input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
              </Field>
              <Field label="Stock">
                <Input type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} />
              </Field>
              <Field label="Warranty (months)">
                <Input
                  type="number"
                  value={draft.warrantyMonths}
                  onChange={(e) => setDraft({ ...draft, warrantyMonths: Number(e.target.value) })}
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ImageUpload
                label="Upload product photo"
                hint="ارفع صورة المنتج من جهازك"
                value={draft.imageData}
                onChange={(imageData) => setDraft({ ...draft, imageData })}
              />
              <Field label="Or pick a bundled photo" hint="Used when no picture is uploaded.">
                <Select value={draft.imageKey} onChange={(e) => setDraft({ ...draft, imageKey: e.target.value as ImageKey })}>
                  {IMAGE_KEYS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </Select>
                <img
                  src={productImage(draft)}
                  alt="Preview"
                  loading="lazy"
                  className="mt-3 h-32 w-32 rounded-xl bg-surface object-contain p-2"
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <Field label="Visibility">
              <Select value={draft.active ? "live" : "hidden"} onChange={(e) => setDraft({ ...draft, active: e.target.value === "live" })}>
                <option value="live">Live in store</option>
                <option value="hidden">Hidden</option>
              </Select>
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                if (!draft.name || draft.price <= 0) {
                  toast.error("Name and price are required");
                  return;
                }
                upsertProduct(draft);
                setDraft(null);
                toast.success("Store updated");
              }}
            >
              Save product
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
