import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CustomerShell } from "@/components/shells";
import { Button, Card, EmptyState, Field, Select, money } from "@/components/kit";
import { useStore } from "@/lib/store";
import { productImage } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Kangaroo Home Care Store" },
      { name: "description", content: "Review your appliance order, choose delivery and pay cash or card on delivery in Qatar." },
      { property: "og:title", content: "Your Cart — Kangaroo Home Care Store" },
      { property: "og:description", content: "Checkout with free Doha delivery and managed warranty registration." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, products, setCartQty, clearCart, cartTotal, addOrder, me, settings } = useStore();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState(me.defaultPropertyId);
  const [pay, setPay] = useState(
    me.paymentMethod === "card" ? "Card on delivery" : me.paymentMethod === "account" ? "Company account" : "Cash on delivery",
  );

  const property = me.properties.find((p) => p.id === propertyId) ?? me.properties[0]!;
  const delivery = cartTotal >= settings.freeDeliveryOver ? 0 : 25;

  const lines = cart
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((x) => x.product);

  const checkout = () => {
    const order = addOrder({
      kind: "product",
      title: `Store order — ${lines.reduce((n, l) => n + l.line.qty, 0)} item(s)`,
      customerId: me.id,
      customer: me.name,
      phone: me.phone,
      address: `${property.label} · ${property.address}`,
      zone: property.zone,
      status: "new",
      priority: "normal",
      amount: cartTotal + delivery,
      source: "store",
      notes: pay,
      items: lines.map((l) => ({ name: l.product!.name, qty: l.line.qty, price: l.product!.price })),
    });
    clearCart();
    toast.success(`Order ${order.id} placed`);
    navigate({ to: "/orders/$orderId", params: { orderId: order.id } });
  };


  return (
    <CustomerShell>
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">Cart</h1>
        {lines.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Your cart is empty" body="Browse the store and add appliances or tools." />
            <Link to="/store">
              <Button className="mt-4 w-full" size="lg">
                Go to store
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {lines.map(({ line, product }) => (
                <Card key={line.productId} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
                  <img
                    src={productImage(product!)}
                    alt={product!.name}
                    loading="lazy"
                    width={912}
                    height={912}
                    className="h-16 w-16 shrink-0 rounded-xl bg-surface object-contain p-1"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{product!.name}</p>
                    <p className="text-xs text-muted-foreground">{money(product!.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCartQty(line.productId, line.qty - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCartQty(line.productId, line.qty + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setCartQty(line.productId, 0)} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="mt-4 space-y-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">Delivering to {me.name}</p>
                  <p className="text-xs text-muted-foreground">{me.phone}</p>
                </div>
                <Link to="/profile" className="text-xs font-bold text-primary">
                  Edit my details
                </Link>
              </div>
              <Field label="Delivery address" hint="Saved places from your account">
                <Select value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
                  {me.properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} — {p.address} · {p.zone}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Payment">
                <Select value={pay} onChange={(e) => setPay(e.target.value)}>
                  <option>Cash on delivery</option>
                  <option>Card on delivery</option>
                  <option>Company account</option>
                </Select>
              </Field>
            </Card>

            <Card className="mt-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{money(cartTotal)}</span>
                <span className="text-muted-foreground">Delivery ({property.zone})</span>
                <span className={`font-semibold ${delivery === 0 ? "text-success" : ""}`}>
                  {delivery === 0 ? "Free" : money(delivery)}
                </span>
                <span className="font-bold">Total</span>
                <span className="text-lg font-bold text-primary">{money(cartTotal + delivery)}</span>
              </div>
              {delivery > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Free delivery on orders over {money(settings.freeDeliveryOver)}.
                </p>
              )}
              <Button className="mt-4 w-full" size="lg" onClick={checkout}>
                Place order
              </Button>
            </Card>

          </>
        )}
      </div>
    </CustomerShell>
  );
}
