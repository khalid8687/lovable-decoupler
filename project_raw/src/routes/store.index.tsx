import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import { Badge, Button, Card, Input, money } from "@/components/kit";
import { useStore } from "@/lib/store";
import { productImage } from "@/lib/data";

export const Route = createFileRoute("/store/")({
  head: () => ({
    meta: [
      { title: "Home Appliance Store — Kangaroo Home Care Qatar" },
      {
        name: "description",
        content: "Buy air conditioners, refrigerators, washers and tools with Kangaroo installation and managed warranty in Qatar.",
      },
      { property: "og:title", content: "Home Appliance Store — Kangaroo Home Care Qatar" },
      { property: "og:description", content: "Appliances delivered and installed by Kangaroo technicians in Doha." },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  const { products, addToCart, cartCount } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const list = products.filter(
    (p) =>
      p.active &&
      (category === "All" || p.category === category) &&
      `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">Shop</h1>
            <p className="text-sm text-muted-foreground">منتجات أصلية بضمان معتمد وتركيب من فرقنا</p>
          </div>
          <Link to="/cart" className="relative shrink-0">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product…" className="pl-9" />
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === c ? "brand-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {list.map((product) => (
          <Card key={product.id} className="p-3">
            <Link to="/store/$productId" params={{ productId: product.id }}>
              <img
                src={productImage(product)}
                alt={product.name}
                loading="lazy"
                width={912}
                height={912}
                className="h-32 w-full rounded-xl bg-surface object-contain p-2"
              />
              <p className="mt-2 line-clamp-2 text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </Link>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <span className="truncate text-sm font-bold text-primary">{money(product.price)}</span>
              <Badge tone={product.stock > 0 ? "success" : "danger"}>{product.stock > 0 ? "In stock" : "Out"}</Badge>
            </div>
            <Button
              size="sm"
              variant="amber"
              className="mt-2 w-full"
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(product.id);
                toast.success("Added to cart");
              }}
            >
              Add to cart
            </Button>
          </Card>
        ))}
      </div>
    </CustomerShell>
  );
}
