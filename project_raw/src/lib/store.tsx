import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  seedCustomers,
  seedDevices,
  seedOrders,
  seedProducts,
  seedReports,
  seedServices,
  seedSettings,
  seedTechnicians,
  seedUsers,
  seedWarranties,
  type AgentReport,
  type AppSettings,
  type AppUser,
  type Customer,
  type DeviceKnowledge,
  type Order,
  type OrderStatus,
  type Product,
  type ServiceCategory,
  type Technician,
  type WarrantyFile,
} from "./data";

export type CartLine = { productId: string; qty: number };

type State = {
  services: ServiceCategory[];
  devices: DeviceKnowledge[];
  products: Product[];
  technicians: Technician[];
  orders: Order[];
  reports: AgentReport[];
  warranties: WarrantyFile[];
  users: AppUser[];
  customers: Customer[];
  settings: AppSettings;
  currentCustomerId: string;
  cart: CartLine[];
};

const initialState: State = {
  services: seedServices,
  devices: seedDevices,
  products: seedProducts,
  technicians: seedTechnicians,
  orders: seedOrders,
  reports: seedReports,
  warranties: seedWarranties,
  users: seedUsers,
  customers: seedCustomers,
  settings: seedSettings,
  currentCustomerId: "cu-1",
  cart: [],
};

const STORAGE_KEY = "kangaroo-hcare-state-v2";

type Ctx = State & {
  addOrder: (order: Omit<Order, "id" | "createdAt" | "timeline"> & { timeline?: Order["timeline"] }) => Order;
  updateOrder: (id: string, patch: Partial<Order>, event?: string, by?: string) => void;
  setOrderStatus: (id: string, status: OrderStatus, by?: string) => void;
  assignTechnician: (id: string, technicianId: string) => void;
  rateOrder: (id: string, rating: number) => void;
  addReport: (report: Omit<AgentReport, "id" | "createdAt">) => AgentReport;
  upsertService: (service: ServiceCategory) => void;
  removeService: (id: string) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  upsertDevice: (device: DeviceKnowledge) => void;
  removeDevice: (id: string) => void;
  upsertUser: (user: AppUser) => void;
  removeUser: (id: string) => void;
  upsertWarranty: (file: WarrantyFile) => void;
  removeWarranty: (id: string) => void;
  upsertTechnician: (tech: Technician) => void;
  removeTechnician: (id: string) => void;
  upsertCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;
  setCurrentCustomer: (id: string) => void;
  /** The signed-in customer used to prefill every booking. */
  me: Customer;
  updateMe: (patch: Partial<Customer>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  resetDemo: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt cache */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const value = useMemo<Ctx>(() => {
    const cartCount = state.cart.reduce((n, l) => n + l.qty, 0);
    const cartTotal = state.cart.reduce((sum, line) => {
      const p = state.products.find((x) => x.id === line.productId);
      return sum + (p ? p.price * line.qty : 0);
    }, 0);

    return {
      ...state,
      cartCount,
      cartTotal,
      addOrder: (order) => {
        const created: Order = {
          ...order,
          id: `KG-${1042 + state.orders.length}`,
          createdAt: new Date().toISOString(),
          timeline:
            order.timeline ??
            [{ at: new Date().toISOString(), label: "Order created", by: "Customer" }],
        };
        patch((s) => ({ ...s, orders: [created, ...s.orders] }));
        return created;
      },
      updateOrder: (id, p, event, by = "Admin") =>
        patch((s) => ({
          ...s,
          orders: s.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  ...p,
                  timeline: event
                    ? [...o.timeline, { at: new Date().toISOString(), label: event, by }]
                    : o.timeline,
                }
              : o,
          ),
        })),
      setOrderStatus: (id, status, by = "Admin") =>
        patch((s) => ({
          ...s,
          orders: s.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  timeline: [
                    ...o.timeline,
                    { at: new Date().toISOString(), label: `Status → ${status}`, by },
                  ],
                }
              : o,
          ),
        })),
      assignTechnician: (id, technicianId) =>
        patch((s) => {
          const tech = s.technicians.find((t) => t.id === technicianId);
          return {
            ...s,
            orders: s.orders.map((o) =>
              o.id === id
                ? {
                    ...o,
                    technicianId,
                    status: o.status === "new" ? "assigned" : o.status,
                    timeline: [
                      ...o.timeline,
                      {
                        at: new Date().toISOString(),
                        label: `Assigned to ${tech?.name ?? technicianId}`,
                        by: "Admin",
                      },
                    ],
                  }
                : o,
            ),
          };
        }),
      rateOrder: (id, rating) =>
        patch((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, rating } : o)),
        })),
      addReport: (report) => {
        const created: AgentReport = {
          ...report,
          id: uid("AR"),
          createdAt: new Date().toISOString(),
        };
        patch((s) => ({ ...s, reports: [created, ...s.reports] }));
        return created;
      },
      upsertService: (service) =>
        patch((s) => ({
          ...s,
          services: s.services.some((x) => x.id === service.id)
            ? s.services.map((x) => (x.id === service.id ? service : x))
            : [...s.services, service],
        })),
      removeService: (id) =>
        patch((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) })),
      upsertProduct: (product) =>
        patch((s) => ({
          ...s,
          products: s.products.some((x) => x.id === product.id)
            ? s.products.map((x) => (x.id === product.id ? product : x))
            : [...s.products, product],
        })),
      removeProduct: (id) =>
        patch((s) => ({ ...s, products: s.products.filter((x) => x.id !== id) })),
      upsertDevice: (device) =>
        patch((s) => ({
          ...s,
          devices: s.devices.some((x) => x.id === device.id)
            ? s.devices.map((x) => (x.id === device.id ? device : x))
            : [...s.devices, device],
        })),
      removeDevice: (id) =>
        patch((s) => ({ ...s, devices: s.devices.filter((x) => x.id !== id) })),
      upsertUser: (user) =>
        patch((s) => ({
          ...s,
          users: s.users.some((x) => x.id === user.id)
            ? s.users.map((x) => (x.id === user.id ? user : x))
            : [...s.users, user],
        })),
      removeUser: (id) => patch((s) => ({ ...s, users: s.users.filter((x) => x.id !== id) })),
      upsertWarranty: (file) =>
        patch((s) => ({
          ...s,
          warranties: s.warranties.some((x) => x.id === file.id)
            ? s.warranties.map((x) => (x.id === file.id ? file : x))
            : [...s.warranties, file],
        })),
      removeWarranty: (id) =>
        patch((s) => ({ ...s, warranties: s.warranties.filter((x) => x.id !== id) })),
      upsertTechnician: (tech) =>
        patch((s) => ({
          ...s,
          technicians: s.technicians.some((x) => x.id === tech.id)
            ? s.technicians.map((x) => (x.id === tech.id ? tech : x))
            : [...s.technicians, tech],
        })),
      removeTechnician: (id) =>
        patch((s) => ({ ...s, technicians: s.technicians.filter((x) => x.id !== id) })),
      me: state.customers.find((c) => c.id === state.currentCustomerId) ?? state.customers[0]!,
      upsertCustomer: (customer) =>
        patch((s) => ({
          ...s,
          customers: s.customers.some((x) => x.id === customer.id)
            ? s.customers.map((x) => (x.id === customer.id ? customer : x))
            : [...s.customers, customer],
        })),
      removeCustomer: (id) =>
        patch((s) => ({
          ...s,
          customers: s.customers.filter((x) => x.id !== id),
          currentCustomerId:
            s.currentCustomerId === id ? (s.customers.find((c) => c.id !== id)?.id ?? "") : s.currentCustomerId,
        })),
      setCurrentCustomer: (id) => patch((s) => ({ ...s, currentCustomerId: id })),
      updateMe: (p) =>
        patch((s) => ({
          ...s,
          customers: s.customers.map((c) => (c.id === s.currentCustomerId ? { ...c, ...p } : c)),
        })),
      updateSettings: (p) => patch((s) => ({ ...s, settings: { ...s.settings, ...p } })),
      addToCart: (productId, qty = 1) =>
        patch((s) => ({
          ...s,
          cart: s.cart.some((l) => l.productId === productId)
            ? s.cart.map((l) =>
                l.productId === productId ? { ...l, qty: l.qty + qty } : l,
              )
            : [...s.cart, { productId, qty }],
        })),
      setCartQty: (productId, qty) =>
        patch((s) => ({
          ...s,
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.productId !== productId)
              : s.cart.map((l) => (l.productId === productId ? { ...l, qty } : l)),
        })),
      clearCart: () => patch((s) => ({ ...s, cart: [] })),
      resetDemo: () => setState(initialState),
    };
  }, [state, patch]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const uniqueId = uid;
