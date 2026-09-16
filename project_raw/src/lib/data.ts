import heroImg from "@/assets/hero-technician.jpg";
import acImg from "@/assets/product-ac.jpg";
import fridgeImg from "@/assets/product-fridge.jpg";
import washerImg from "@/assets/product-washer.jpg";
import pressureImg from "@/assets/product-pressure-washer.jpg";
import heaterImg from "@/assets/product-heater.jpg";

export const IMAGES = {
  hero: heroImg,
  ac: acImg,
  fridge: fridgeImg,
  washer: washerImg,
  pressure: pressureImg,
  heater: heaterImg,
} as const;

export type ImageKey = keyof typeof IMAGES;

export type ServiceCategory = {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  slaMinutes: number;
  fromPrice: number;
  active: boolean;
  description: string;
};

export type DeviceKnowledge = {
  id: string;
  brand: string;
  model: string;
  category: string;
  warrantyMonths: number;
  symptoms: {
    label: string;
    keywords: string[];
    visualCheck: string;
    steps: string[];
    escalateTo?: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  imageKey: ImageKey;
  /** Admin-uploaded picture (data URL) — overrides imageKey when present. */
  imageData?: string | undefined;
  gallery?: string[];
  warrantyMonths: number;
  description: string;
  active: boolean;
};

export type Technician = {
  id: string;
  name: string;
  phone: string;
  trade: string;
  zone: string;
  rating: number;
  status: "available" | "on-job" | "off";
};

export type OrderKind = "service" | "product";
export type OrderStatus =
  | "new"
  | "assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

export type TimelineEntry = { at: string; label: string; by: string };

export type Order = {
  id: string;
  kind: OrderKind;
  title: string;
  customerId?: string | undefined;
  customer: string;
  phone: string;
  address: string;
  zone: string;
  createdAt: string;
  scheduledAt?: string;
  status: OrderStatus;
  priority: "normal" | "urgent";
  amount: number;
  paid?: boolean;
  paymentMethod?: "cash" | "card" | "account";
  technicianId?: string;
  source: "ai-agent" | "manual" | "store";
  notes?: string | undefined;
  items?: { name: string; qty: number; price: number }[];
  aiSummary?: string;
  attachments?: string[];
  rating?: number;
  timeline: TimelineEntry[];
};

export type AgentReport = {
  id: string;
  orderId?: string | undefined;
  customerId?: string | undefined;
  customer: string;
  device: string;
  symptom: string;
  resolution: "self-fixed" | "needs-visit" | "info-only";
  transcript: { role: "agent" | "customer"; text: string }[];
  snapshots: string[];
  createdAt: string;
};

export type WarrantyFile = {
  id: string;
  customerId: string;
  device: string;
  serial: string;
  supplier: string;
  startDate: string;
  months: number;
  documentName: string;
  /** Uploaded warranty card / invoice picture (data URL). */
  documentImage?: string | undefined;
  purchasePrice?: number | undefined;
  notes?: string | undefined;
};

export type AppUser = {
  id: string;
  name: string;
  role: "customer" | "technician" | "admin";
  phone: string;
  email?: string | undefined;
  zone: string;
  active: boolean;
  /** Link to the CRM record when the user is a customer. */
  customerId?: string | undefined;
  permissions?: string[] | undefined;
};

export type CustomerProperty = {
  id: string;
  label: string;
  type: "villa" | "apartment" | "office" | "compound";
  zone: string;
  address: string;
  unit?: string | undefined;
  gateNote?: string | undefined;
};

export type Customer = {
  id: string;
  name: string;
  nameAr?: string | undefined;
  phone: string;
  altPhone?: string | undefined;
  email?: string | undefined;
  whatsapp?: string | undefined;
  qid?: string | undefined;
  language: "en" | "ar";
  tier: "standard" | "silver" | "gold" | "platinum";
  contractType: "none" | "monthly" | "annual" | "warranty";
  contractRenewal?: string | undefined;
  joinedAt: string;
  avatar?: string | undefined;
  properties: CustomerProperty[];
  defaultPropertyId: string;
  preferredWindow: "morning" | "afternoon" | "evening";
  paymentMethod: "cash" | "card" | "account";
  creditLimit: number;
  notes?: string | undefined;
  tags: string[];
  active: boolean;
};

export type AppSettings = {
  companyName: string;
  tagline: string;
  phone: string;
  emergency: string;
  email: string;
  address: string;
  currency: string;
  vatPercent: number;
  callOutFee: number;
  emergencySurcharge: number;
  freeDeliveryOver: number;
  zones: string[];
  workingHours: string;
  autoDispatch: boolean;
  aiVoiceEnabled: boolean;
  storeEnabled: boolean;
};

export const seedSettings: AppSettings = {
  companyName: "Kangaroo Home Care",
  tagline: "Smart Maintenance. Reliable Service.",
  phone: "+974 3998 1100",
  emergency: "+974 3344 2272",
  email: "Info@kangaroohcare.com",
  address: "Al Furousiya St., Building 398, First Floor, Doha, Qatar",
  currency: "QAR",
  vatPercent: 0,
  callOutFee: 50,
  emergencySurcharge: 75,
  freeDeliveryOver: 500,
  zones: ["Al Waab", "Lusail", "West Bay", "Al Sadd", "Al Gharrafa", "Al Wakrah", "Al Kheesa", "The Pearl", "Umm Salal"],
  workingHours: "07:00 — 22:00 · Emergency 24/7",
  autoDispatch: true,
  aiVoiceEnabled: true,
  storeEnabled: true,
};

// Hour-stable base so server and client render identical relative times.
const now = Math.floor(Date.now() / 3600000) * 3600000;
const iso = (minusMinutes: number) =>
  new Date(now - minusMinutes * 60000).toISOString();


export const seedServices: ServiceCategory[] = [
  { id: "sv-ac", name: "Air Conditioning", nameAr: "التكييف", icon: "AirVent", slaMinutes: 60, fromPrice: 150, active: true, description: "Split & central AC service, gas charging, deep cleaning." },
  { id: "sv-plumb", name: "Plumbing & Water", nameAr: "السباكة", icon: "Droplets", slaMinutes: 60, fromPrice: 120, active: true, description: "Leaks, blockages, water tanks and pumps." },
  { id: "sv-elec", name: "Electrical", nameAr: "الكهرباء", icon: "Zap", slaMinutes: 60, fromPrice: 130, active: true, description: "Breakers, wiring, lighting and DB boards." },
  { id: "sv-appliance", name: "Home Appliances", nameAr: "الأجهزة المنزلية", icon: "WashingMachine", slaMinutes: 180, fromPrice: 140, active: true, description: "Fridges, washers, ovens and water heaters." },
  { id: "sv-paint", name: "Painting & Finishing", nameAr: "الدهانات والتشطيبات", icon: "PaintRoller", slaMinutes: 1440, fromPrice: 350, active: true, description: "Repainting, waterproofing, gypsum repairs." },
  { id: "sv-pool", name: "Swimming Pools", nameAr: "المسابح", icon: "Waves", slaMinutes: 720, fromPrice: 400, active: true, description: "Water treatment, pumps and filters." },
  { id: "sv-garden", name: "Gardens & Landscape", nameAr: "الحدائق", icon: "Trees", slaMinutes: 720, fromPrice: 250, active: true, description: "Irrigation, trimming and seasonal care." },
  { id: "sv-cctv", name: "CCTV & Security", nameAr: "الكاميرات والأمن", icon: "Cctv", slaMinutes: 240, fromPrice: 300, active: true, description: "Cameras, intercom, access control." },
  { id: "sv-lift", name: "Elevators", nameAr: "المصاعد", icon: "MoveVertical", slaMinutes: 120, fromPrice: 500, active: true, description: "Inspection and certified maintenance." },
  { id: "sv-carpentry", name: "Doors, Windows & Kitchen", nameAr: "الأبواب والنوافذ", icon: "DoorOpen", slaMinutes: 480, fromPrice: 180, active: true, description: "Aluminium, carpentry and kitchen fittings." },
  { id: "sv-pest", name: "Pest Control", nameAr: "مكافحة الحشرات", icon: "Bug", slaMinutes: 480, fromPrice: 200, active: true, description: "Certified, family-safe treatments." },
  { id: "sv-emergency", name: "24/7 Emergency", nameAr: "الطوارئ", icon: "Siren", slaMinutes: 60, fromPrice: 250, active: true, description: "60-minute response inside Doha." },
];

export const seedDevices: DeviceKnowledge[] = [
  {
    id: "dv-1",
    brand: "General",
    model: "Split AC 1.5 Ton",
    category: "Air Conditioning",
    warrantyMonths: 24,
    symptoms: [
      {
        label: "Not cooling",
        keywords: ["not cooling", "warm air", "hot", "no cold", "تكييف", "مش ساقع", "حرارة"],
        visualCheck: "Point the camera at the indoor filter and at the outdoor unit fan.",
        steps: [
          "Set the mode to COOL and temperature to 18°C, then wait 3 minutes.",
          "Slide out the front cover and check if the filter is grey with dust — rinse it with water and dry it.",
          "Confirm the outdoor fan is spinning; if it is silent the compressor needs a technician.",
        ],
        escalateTo: "Air Conditioning",
      },
      {
        label: "Water dripping indoors",
        keywords: ["water", "leak", "drip", "تنقيط", "مياه"],
        visualCheck: "Show the drain pipe outlet on the wall.",
        steps: [
          "Switch the unit off to stop condensation.",
          "Check the drain hose for a visible bend or blockage and straighten it.",
          "Dry the tray with a cloth and run the unit on FAN for 10 minutes.",
        ],
        escalateTo: "Air Conditioning",
      },
    ],
  },
  {
    id: "dv-2",
    brand: "Hitachi",
    model: "Refrigerator 650 Ltr",
    category: "Home Appliances",
    warrantyMonths: 12,
    symptoms: [
      {
        label: "Not cooling / ice build-up",
        keywords: ["fridge", "freezer", "ice", "not cold", "تلاجة", "ثلج"],
        visualCheck: "Show the freezer back wall and the door gasket.",
        steps: [
          "Make sure the thermostat is between 3 and 5 and the vents are not blocked by food.",
          "Inspect the door rubber for gaps — clean it with warm water so it seals.",
          "If the back wall is a solid block of ice, defrost for 4 hours before we visit.",
        ],
        escalateTo: "Home Appliances",
      },
    ],
  },
  {
    id: "dv-3",
    brand: "Bosch",
    model: "Front Load Washer 8kg",
    category: "Home Appliances",
    warrantyMonths: 24,
    symptoms: [
      {
        label: "Not draining / error code",
        keywords: ["washer", "washing", "drain", "error", "غسالة", "ماء"],
        visualCheck: "Show the display code and the filter flap at the bottom right.",
        steps: [
          "Open the small bottom-right flap and drain the residual water into a tray.",
          "Unscrew the filter, remove lint and coins, then refit it firmly.",
          "Run a rinse cycle; if the code returns, the pump needs replacement.",
        ],
        escalateTo: "Home Appliances",
      },
    ],
  },
  {
    id: "dv-4",
    brand: "Ariston",
    model: "Water Heater 50L",
    category: "Plumbing & Water",
    warrantyMonths: 36,
    symptoms: [
      {
        label: "No hot water",
        keywords: ["heater", "hot water", "سخان", "ماء ساخن"],
        visualCheck: "Show the heater breaker and the indicator lamp.",
        steps: [
          "Check the dedicated breaker in the DB board is ON.",
          "Press the red reset button on the heater thermostat cover.",
          "Wait 20 minutes; if the lamp stays off the element is likely burnt.",
        ],
        escalateTo: "Plumbing & Water",
      },
    ],
  },
  {
    id: "dv-5",
    brand: "Schneider",
    model: "DB Board 12-Way",
    category: "Electrical",
    warrantyMonths: 60,
    symptoms: [
      {
        label: "Breaker keeps tripping",
        keywords: ["breaker", "power", "trip", "electric", "كهرباء", "قاطع"],
        visualCheck: "Open the DB board cover and show which breaker is down.",
        steps: [
          "Unplug every device on that circuit.",
          "Reset the breaker once. If it holds, plug devices back one by one to find the faulty one.",
          "If it trips with nothing connected, stop — this is a wiring fault for our electrician.",
        ],
        escalateTo: "Electrical",
      },
    ],
  },
];

export const seedProducts: Product[] = [
  { id: "pr-1", name: "Split Air Conditioner 1.5 Ton", brand: "General", category: "Air Conditioners", price: 2150, stock: 12, imageKey: "ac", warrantyMonths: 24, description: "Inverter split unit with installation by Kangaroo technicians.", active: true },
  { id: "pr-2", name: "Refrigerator 650 Ltr", brand: "Hitachi", category: "Home Appliances", price: 2005, stock: 6, imageKey: "fridge", warrantyMonths: 12, description: "Side-by-side fridge, free delivery inside Doha.", active: true },
  { id: "pr-3", name: "Front Load Washer 8kg", brand: "Bosch", category: "Home Appliances", price: 1800, stock: 9, imageKey: "washer", warrantyMonths: 24, description: "Quiet inverter motor with 15 wash programs.", active: true },
  { id: "pr-4", name: "Pressure Washer K3", brand: "Karcher", category: "Tools", price: 1000, stock: 20, imageKey: "pressure", warrantyMonths: 12, description: "For villa yards, cars and pool decks.", active: true },
  { id: "pr-5", name: "Smart Water Heater 50L", brand: "Ariston", category: "Plumbing", price: 890, stock: 15, imageKey: "heater", warrantyMonths: 36, description: "Digital thermostat with eco mode.", active: true },
];

export const seedTechnicians: Technician[] = [
  { id: "tc-1", name: "Ahmed Samir", phone: "+974 3311 2201", trade: "AC & Refrigeration", zone: "West Bay", rating: 4.9, status: "available" },
  { id: "tc-2", name: "Rakesh Kumar", phone: "+974 3311 2202", trade: "Plumbing", zone: "Al Wakrah", rating: 4.7, status: "on-job" },
  { id: "tc-3", name: "Mohamed Fathy", phone: "+974 3311 2203", trade: "Electrical", zone: "Al Sadd", rating: 4.8, status: "available" },
  { id: "tc-4", name: "Suresh Nair", phone: "+974 3311 2204", trade: "Appliances", zone: "Lusail", rating: 4.6, status: "available" },
];

export const seedOrders: Order[] = [
  {
    id: "KG-1041",
    kind: "service",
    title: "Split AC not cooling — Villa 22",
    customer: "Fatima Al Kuwari",
    phone: "+974 5566 1010",
    address: "Villa 22, Al Waab, Doha",
    zone: "Al Waab",
    createdAt: iso(35),
    status: "assigned",
    priority: "urgent",
    amount: 250,
    technicianId: "tc-1",
    source: "ai-agent",
    aiSummary:
      "AI agent inspected the indoor filter via camera: heavy dust and frozen coil. Filter cleaned by customer, cooling still weak — gas top-up required.",
    attachments: ["ac-filter-snapshot", "outdoor-unit-snapshot"],
    timeline: [
      { at: iso(35), label: "Created from AI call", by: "AI Agent" },
      { at: iso(30), label: "Assigned to Ahmed Samir", by: "Admin" },
    ],
  },
  {
    id: "KG-1040",
    kind: "service",
    title: "Kitchen sink leak",
    customer: "Yousef Al Emadi",
    phone: "+974 5566 2020",
    address: "Apt 8, Lusail Marina",
    zone: "Lusail",
    createdAt: iso(190),
    status: "in-progress",
    priority: "normal",
    amount: 180,
    technicianId: "tc-2",
    source: "manual",
    timeline: [
      { at: iso(190), label: "Booked manually", by: "Customer" },
      { at: iso(150), label: "Assigned to Rakesh Kumar", by: "Admin" },
      { at: iso(40), label: "Technician on site", by: "Technician" },
    ],
  },
  {
    id: "KG-1039",
    kind: "product",
    title: "Store order — 1x Pressure Washer K3",
    customer: "Noora Al Ali",
    phone: "+974 5566 3030",
    address: "Villa 7, Al Gharrafa",
    zone: "Al Gharrafa",
    createdAt: iso(420),
    status: "completed",
    priority: "normal",
    amount: 1000,
    source: "store",
    items: [{ name: "Pressure Washer K3", qty: 1, price: 1000 }],
    rating: 5,
    timeline: [
      { at: iso(420), label: "Paid on delivery", by: "Customer" },
      { at: iso(300), label: "Delivered", by: "Logistics" },
    ],
  },
  {
    id: "KG-1038",
    kind: "service",
    title: "Annual maintenance visit",
    customer: "Hamad Al Thani",
    phone: "+974 5566 4040",
    address: "Villa 3, Al Kheesa",
    zone: "Al Kheesa",
    createdAt: iso(1500),
    status: "completed",
    priority: "normal",
    amount: 600,
    technicianId: "tc-3",
    source: "manual",
    rating: 4,
    timeline: [
      { at: iso(1500), label: "Scheduled", by: "Admin" },
      { at: iso(900), label: "Completed & signed", by: "Technician" },
    ],
  },
];

export const seedReports: AgentReport[] = [
  {
    id: "AR-501",
    orderId: "KG-1041",
    customer: "Fatima Al Kuwari",
    device: "General Split AC 1.5 Ton",
    symptom: "Not cooling",
    resolution: "needs-visit",
    transcript: [
      { role: "customer", text: "The AC in the living room blows warm air." },
      { role: "agent", text: "Please point the camera at the indoor filter." },
      { role: "agent", text: "The filter is fully blocked and the coil is iced. Clean the filter, I am also booking a gas check." },
    ],
    snapshots: ["ac-filter-snapshot", "outdoor-unit-snapshot"],
    createdAt: iso(33),
  },
  {
    id: "AR-500",
    customer: "Ali Hassan",
    device: "Bosch Front Load Washer 8kg",
    symptom: "Not draining",
    resolution: "self-fixed",
    transcript: [
      { role: "customer", text: "Washer stops with water inside." },
      { role: "agent", text: "Open the bottom-right flap and clean the drain filter." },
      { role: "customer", text: "It worked, thank you." },
    ],
    snapshots: ["washer-filter-snapshot"],
    createdAt: iso(600),
  },
];

export const seedCustomers: Customer[] = [
  {
    id: "cu-1",
    name: "Fatima Al Kuwari",
    nameAr: "فاطمة الكواري",
    phone: "+974 5566 1010",
    altPhone: "+974 3311 8080",
    email: "fatima.k@example.qa",
    whatsapp: "+974 5566 1010",
    qid: "288xxxxxx41",
    language: "ar",
    tier: "platinum",
    contractType: "annual",
    contractRenewal: "2027-02-11",
    joinedAt: "2024-03-04",
    properties: [
      { id: "pp-1", label: "Main villa", type: "villa", zone: "Al Waab", address: "Villa 22, Al Waab, Doha", gateNote: "Gate code 4471 · dog in the yard" },
      { id: "pp-2", label: "Beach house", type: "apartment", zone: "The Pearl", address: "Tower 9, Apt 1802, The Pearl", unit: "1802" },
    ],
    defaultPropertyId: "pp-1",
    preferredWindow: "morning",
    paymentMethod: "account",
    creditLimit: 5000,
    notes: "VIP — always call 15 minutes before arriving.",
    tags: ["VIP", "Annual contract", "AC fleet"],
    active: true,
  },
  {
    id: "cu-2",
    name: "Yousef Al Emadi",
    phone: "+974 5566 2020",
    email: "yousef@example.qa",
    language: "en",
    tier: "gold",
    contractType: "monthly",
    contractRenewal: "2026-10-01",
    joinedAt: "2025-01-19",
    properties: [
      { id: "pp-3", label: "Marina apartment", type: "apartment", zone: "Lusail", address: "Apt 8, Lusail Marina", unit: "8" },
    ],
    defaultPropertyId: "pp-3",
    preferredWindow: "evening",
    paymentMethod: "card",
    creditLimit: 2000,
    tags: ["Monthly plan"],
    active: true,
  },
  {
    id: "cu-3",
    name: "Noora Al Ali",
    phone: "+974 5566 3030",
    email: "noora@example.qa",
    language: "ar",
    tier: "silver",
    contractType: "warranty",
    joinedAt: "2025-08-22",
    properties: [
      { id: "pp-4", label: "Family villa", type: "villa", zone: "Al Gharrafa", address: "Villa 7, Al Gharrafa" },
    ],
    defaultPropertyId: "pp-4",
    preferredWindow: "afternoon",
    paymentMethod: "cash",
    creditLimit: 1000,
    tags: ["Store buyer"],
    active: true,
  },
  {
    id: "cu-4",
    name: "Hamad Al Thani",
    phone: "+974 5566 4040",
    email: "hamad@example.qa",
    language: "en",
    tier: "gold",
    contractType: "annual",
    contractRenewal: "2027-01-05",
    joinedAt: "2023-11-02",
    properties: [
      { id: "pp-5", label: "Compound villa 3", type: "compound", zone: "Al Kheesa", address: "Villa 3, Al Kheesa" },
    ],
    defaultPropertyId: "pp-5",
    preferredWindow: "morning",
    paymentMethod: "account",
    creditLimit: 8000,
    notes: "Facility manager handles approvals.",
    tags: ["Compound", "Elevator contract"],
    active: true,
  },
];

export const seedWarranties: WarrantyFile[] = [
  { id: "WR-90", customerId: "cu-1", device: "General Split AC 1.5 Ton", serial: "GN-88213", supplier: "General Qatar", startDate: "2026-02-11", months: 24, documentName: "warranty-ac-villa22.pdf", purchasePrice: 2150, notes: "Installed by Kangaroo — labour covered." },
  { id: "WR-91", customerId: "cu-3", device: "Karcher K3 Pressure Washer", serial: "KR-11902", supplier: "Karcher ME", startDate: "2026-05-02", months: 12, documentName: "warranty-karcher-k3.pdf", purchasePrice: 1000 },
  { id: "WR-92", customerId: "cu-4", device: "Ariston Water Heater 50L", serial: "AR-55120", supplier: "Ariston Gulf", startDate: "2025-11-20", months: 36, documentName: "warranty-heater-villa3.pdf", purchasePrice: 890 },
];

export const seedUsers: AppUser[] = [
  { id: "us-1", name: "Fatima Al Kuwari", role: "customer", phone: "+974 5566 1010", email: "fatima.k@example.qa", zone: "Al Waab", active: true, customerId: "cu-1" },
  { id: "us-2", name: "Yousef Al Emadi", role: "customer", phone: "+974 5566 2020", email: "yousef@example.qa", zone: "Lusail", active: true, customerId: "cu-2" },
  { id: "us-3", name: "Ahmed Samir", role: "technician", phone: "+974 3311 2201", zone: "West Bay", active: true, permissions: ["jobs"] },
  { id: "us-4", name: "Eng. Khaled Nasser", role: "admin", phone: "+974 3998 1100", email: "khaled@kangaroohcare.com", zone: "HQ", active: true, permissions: ["all"] },
];

export const COMPANY = {
  name: "Kangaroo Home Care",
  nameAr: "كانجرو للعناية بالمنزل",
  tagline: "Smart Maintenance. Reliable Service.",
  phone: "+974 3998 1100",
  emergency: "+974 3344 2272",
  email: "Info@kangaroohcare.com",
  address: "Al Furousiya St., Building 398, First Floor, Doha, Qatar",
  currency: "QAR",
};

/** Admin-uploaded picture wins over the bundled asset. */
export const productImage = (p: Product) => p.imageData ?? IMAGES[p.imageKey];
