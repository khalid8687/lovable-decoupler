import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Truck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import { Badge, Button, Card, EmptyState, money } from "@/components/kit";
import { useStore } from "@/lib/store";
import { productImage } from "@/lib/data";

export const Route = createFileRoute("/store/$productId")({
  head: () => ({
    meta: [
      { title: "Product — Kangaroo Home Care Store" },
      { name: "description", content: "Product details, warranty period and installation options from Kangaroo Home Care Qatar." },
      { property: "og:title", content: "Product — Kangaroo Home Care Store" },
      { property: "og:description", content: "Original appliances with managed warranty and Kangaroo installation." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = useParams({ from: "/store/$productId" });
  const { products, addToCart } = useStore();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <CustomerShell>
        <div className="p-4">
          <EmptyState title="Product not found" body="It may have been removed by the admin." />
        </div>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell>
      <div className="px-4 pt-5">
        <Link to="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Store
        </Link>
        <img
          src={productImage(product)}
          alt={product.name}
          loading="lazy"
          width={912}
          height={912}
          className="mt-3 h-64 w-full rounded-3xl bg-surface object-contain p-4"
        />
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">
              {product.brand} · {product.category}
            </p>
          </div>
          <Badge tone={product.stock > 0 ? "success" : "danger"}>{product.stock} left</Badge>
        </div>
        <p className="mt-3 text-2xl font-bold text-primary">{money(product.price)}</p>
        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: `${product.warrantyMonths} mo warranty` },
            { icon: Wrench, label: "Kangaroo install" },
            { icon: Truck, label: "Free Doha delivery" },
          ].map((f) => (
            <div key={f.label} className="card-soft p-3 text-center">
              <f.icon className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-1 text-[11px] font-semibold leading-tight">{f.label}</p>
            </div>
          ))}
        </div>

        <Card className="mt-4">
          <p className="text-sm font-semibold">Managed warranty</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Every purchase is filed in the Warranty Vault with the serial number, supplier and claim history — our engineers
            handle supplier coordination for you.
          </p>
        </Card>

        <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              addToCart(product.id);
              toast.success("Added to cart");
            }}
          >
            Add to cart
          </Button>
          <Link to="/cart" onClick={() => addToCart(product.id)}>
            <Button size="lg" className="w-full">
              Buy now
            </Button>
          </Link>
        </div>
      </div>
    </CustomerShell>
  );
}
