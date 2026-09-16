import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home,
  Wrench,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  LayoutDashboard,
  Package,
  Users,
  BrainCircuit,
  FileText,
  ListChecks,
  ClipboardCheck,
  Boxes,
  UserCircle,
  Settings,
  Contact,
} from "lucide-react";
import logo from "@/assets/kangaroo-logo.png";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { COMPANY } from "@/lib/data";

export function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2">
      <img src={logo} alt="Kangaroo Home Care logo" className="h-10 w-10 shrink-0 object-contain" width={40} height={40} />
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold leading-tight">{COMPANY.name}</span>
          <span className="block truncate text-[11px] text-muted-foreground">{COMPANY.tagline}</span>
        </span>
      )}
    </Link>
  );
}

const customerTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Wrench },
  { to: "/store", label: "Store", icon: ShoppingBag },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/profile", label: "Account", icon: UserCircle },
] as const;

export function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount } = useStore();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-background">
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl border-t border-border bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {customerTabs.map((tab) => {
            const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <tab.icon className={cn("h-5 w-5", active && "text-secondary")} />
                  {tab.label}
                  {tab.to === "/store" && cartCount > 0 ? (
                    <span className="absolute right-4 top-2 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Jobs & Dispatch", icon: ListChecks, exact: false },
  { to: "/admin/agent", label: "AI Knowledge", icon: BrainCircuit, exact: false },
  { to: "/admin/reports", label: "AI Reports", icon: FileText, exact: false },
  { to: "/admin/services", label: "Services", icon: Wrench, exact: false },
  { to: "/admin/products", label: "Store", icon: Package, exact: false },
  { to: "/admin/customers", label: "Customers", icon: Contact, exact: false },
  { to: "/admin/users", label: "Users & Team", icon: Users, exact: false },
  { to: "/admin/warranty", label: "Warranty Vault", icon: ShieldCheck, exact: false },
  { to: "/admin/accounts", label: "Finance", icon: Boxes, exact: false },
  { to: "/admin/settings", label: "Administration", icon: Settings, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <Brand />
          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="hidden sm:inline">Admin Console</span>
            <Link to="/" className="rounded-lg border border-border px-3 py-1.5 text-foreground">
              Customer app
            </Link>
          </div>
        </div>
        <div className="no-scrollbar overflow-x-auto border-t border-border">
          <ul className="mx-auto flex max-w-7xl gap-1 px-2 py-2">
            {adminNav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                      active ? "brand-gradient text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

export function TechShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/tech", label: "My Jobs", icon: ClipboardCheck, exact: true },
    { to: "/tech/history", label: "History", icon: ClipboardList, exact: false },
  ] as const;
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Brand compact />
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
          Technician App
        </span>
      </header>
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl border-t border-border bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-2">
          {tabs.map((tab) => {
            const active = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
            return (
              <li key={tab.to}>
                <Link
                  to={tab.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 text-[11px] font-semibold",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
