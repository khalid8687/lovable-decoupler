import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Store,
  Wrench,
  HardHat,
  LayoutDashboard,
} from "lucide-react";
import { CustomerShell, Brand } from "@/components/shells";
import { Badge, Button, Card, SectionTitle, money, timeAgo } from "@/components/kit";
import { useStore } from "@/lib/store";
import { COMPANY, IMAGES } from "@/lib/data";
import { ServiceIcon } from "@/components/service-icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kangaroo Home Care — Smart Home Maintenance in Qatar" },
      {
        name: "description",
        content:
          "AI-assisted home maintenance in Qatar: talk to Roo, show your appliance on camera, book a 60-minute technician or shop appliances.",
      },
      { property: "og:title", content: "Kangaroo Home Care — Smart Home Maintenance in Qatar" },
      {
        property: "og:description",
        content: "AI video support, 60-minute emergency response in Doha, appliance store and warranty vault.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { services, products, orders } = useStore();
  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");

  return (
    <CustomerShell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 pt-5">
        <Brand />
        <div className="flex shrink-0 gap-2">
          <Link to="/tech" title="Technician app">
            <Button variant="outline" size="icon">
              <HardHat className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/admin" title="Admin console">
            <Button variant="outline" size="icon">
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="px-4 pt-5">
        <div className="relative overflow-hidden rounded-3xl brand-gradient p-5 text-primary-foreground shadow-[var(--shadow-lift)]">
          <img
            src={IMAGES.hero}
            alt="Kangaroo technician inside a Doha apartment"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            width={1408}
            height={1008}
          />
          <div className="relative">
            <Badge tone="brand" className="bg-primary-foreground/15 text-primary-foreground">
              <Sparkles className="h-3 w-3" /> Roo AI · live video support
            </Badge>
            <h1 className="mt-3 text-2xl font-bold leading-snug">
              Call Roo. Show the fault.
              <br />
              Fix it in minutes.
            </h1>
            <p className="mt-2 max-w-sm text-sm text-primary-foreground/80">
              مكالمة ذكية مع الوكيل الفني — يشوف الجهاز بالكاميرا ويرشدك خطوة بخطوة، ولو محتاج فني يوصلك خلال 60 دقيقة.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/call">
                <Button variant="amber" size="lg">
                  <PhoneCall className="h-5 w-5" /> Start AI call
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  Choose manually
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 px-4 pt-4">
        {[
          { icon: Clock, title: "60 min", sub: "Doha response" },
          { icon: ShieldCheck, title: "Warranty", sub: "managed for you" },
          { icon: Wrench, title: "24/7", sub: "engineer led" },
        ].map((item) => (
          <div key={item.title} className="card-soft p-3 text-center">
            <item.icon className="mx-auto h-5 w-5 text-secondary" />
            <p className="mt-1 text-sm font-bold">{item.title}</p>
            <p className="text-[11px] text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </section>

      {active.length > 0 && (
        <section className="px-4 pt-6">
          <SectionTitle title="Active jobs" subtitle="Live status from dispatch" />
          <div className="space-y-3">
            {active.slice(0, 2).map((order) => (
              <Link key={order.id} to="/orders/$orderId" params={{ orderId: order.id }}>
                <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{order.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.id} · {timeAgo(order.createdAt)}
                    </p>
                  </div>
                  <Badge tone={order.status === "in-progress" ? "warning" : "brand"}>{order.status}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pt-6">
        <SectionTitle
          title="Select maintenance service"
          subtitle="اختر الخدمة يدوياً وسنرسل عرض السعر"
          action={
            <Link to="/services" className="shrink-0 text-sm font-semibold text-primary">
              See all
            </Link>
          }
        />
        <div className="grid grid-cols-3 gap-3">
          {services.filter((s) => s.active).slice(0, 9).map((service) => (
            <Link key={service.id} to="/services" className="card-soft flex flex-col items-center gap-2 p-3 text-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-strong text-primary">
                <ServiceIcon name={service.icon} className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-semibold leading-tight">{service.name}</span>
              <span className="text-[10px] text-muted-foreground">from {service.fromPrice} QAR</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <SectionTitle
          title="Shop for your home"
          subtitle="Appliances installed by our own technicians"
          action={
            <Link to="/store" className="shrink-0 text-sm font-semibold text-primary">
              Store
            </Link>
          }
        />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {products.filter((p) => p.active).map((product) => (
            <Link
              key={product.id}
              to="/store/$productId"
              params={{ productId: product.id }}
              className="card-soft w-40 shrink-0 overflow-hidden p-0"
            >
              <img
                src={IMAGES[product.imageKey]}
                alt={product.name}
                loading="lazy"
                width={912}
                height={912}
                className="h-28 w-full bg-surface object-contain p-2"
              />
              <div className="p-3">
                <p className="line-clamp-2 text-xs font-semibold">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-primary">{money(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="font-semibold">Emergency line</p>
            <p className="truncate text-sm text-muted-foreground">{COMPANY.emergency} · 24/7 across Qatar</p>
          </div>
          <a href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`} className="shrink-0">
            <Button variant="amber" size="sm">
              <PhoneCall className="h-4 w-4" /> Call
            </Button>
          </a>
        </Card>
      </section>

      <section className="px-4 py-6">
        <Link to="/store">
          <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <Store className="h-5 w-5 shrink-0 text-secondary" />
            <p className="min-w-0 truncate text-sm font-semibold">Free delivery inside Doha on all store orders</p>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Card>
        </Link>
      </section>
    </CustomerShell>
  );
}
