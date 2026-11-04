import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logo from "@/assets/logo.png";
import imgSwitch from "@/assets/products/switch-3560x.jpg";
import imgRouter from "@/assets/products/router-cisco.jpg";
import imgDongle from "@/assets/products/dongle.jpg";
import img6921 from "@/assets/products/cisco-6921.webp";
import img8841 from "@/assets/products/cisco-8841.webp";
import img7841 from "@/assets/products/cisco-7841.jpg";
import imgServer from "@/assets/products/server-hp.webp";
import imgIssabel from "@/assets/products/issabel-pbx.webp";
import { calculateItem, phonePricing } from "@/lib/quote-pricing";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Switches Market — Eslam Hassan Project Quotation" },
    { name: "description", content: "Networking and Issabel PBX quotation for Eslam Hassan, with Cisco 8841, 7841 and 6921 phones and itemized discounted pricing." },
    { property: "og:title", content: "Switches Market — Eslam Hassan Quotation" },
    { property: "og:description", content: "Cisco networking and VoIP equipment, final prices and project terms from Switches Market." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: QuotePage,
});

type Lang = "en" | "ar";

const T = {
  en: {
    dir: "ltr" as const,
    company: "Switches Market",
    tagline: "Networking · VoIP · AI Solutions",
    switchLang: "العربية",
    downloadPdf: "Download PDF",
    heroTitle: "Project Quotation",
    heroFor: "Prepared for",
    clientName: "Eslam Hassan",
    issued: "Issued",
    validUntil: "Valid until",
    validNote: "This offer is valid for one week from the issue date.",
    overview: "Project Overview",
    overviewText:
      "A complete networking + VoIP PBX solution powered by Cisco enterprise hardware and the Issabel IP-PBX platform. The system unifies your landline phones, mobile SIM lines and internal extensions into one intelligent, scalable communications backbone — ready for future AI automation.",
    steps: "Step-by-Step Execution",
    stepList: [
      { t: "Site Survey & Design", d: "Full network audit, cabling plan and VoIP topology tailored to your workflow." },
      { t: "Hardware Installation", d: "Rack mounting, powering, cabling and configuring the Cisco switch, router and IP phones." },
      { t: "PBX Server Deployment", d: "Deploy the Issabel PBX on a dedicated server, integrate 2 landline trunks + 2 mobile SIM dongles." },
      { t: "Configuration & Testing", d: "Extensions, IVR, voicemail, call routing, recording and CDR reports fully tuned." },
      { t: "Training & Handover", d: "On-site training for your team, documentation and 30-day post-launch support." },
    ],
    benefits: "Key Benefits",
    benefitList: [
      "Enterprise-grade Cisco reliability",
      "Unified landline + mobile calls on one PBX",
      "Free internal calls between all extensions",
      "Call recording, IVR & analytics",
      "Scalable up to hundreds of users",
      "AI-ready platform for future automation",
    ],
    devices: "Devices & Software Breakdown",
    pricing: "Pricing Summary",
    item: "Item",
    qty: "Qty",
    unit: "Final Unit (EGP)",
    discount: "Discount",
    total: "Total (EGP)",
    subtotal: "Subtotal",
    totalDiscount: "Total Discount",
    grand: "Grand Total",
    contact: "Ready to move forward?",
    contactSub: "Contact us to approve and start execution.",
    termsTitle: "Terms & Conditions",
    terms: [
      "This offer is valid for ONE WEEK from the issue date.",
      "Prices are in Egyptian Pounds (EGP) and exclude any customs duties beyond what is stated.",
      "Payment: 60% advance before work begins, 40% on delivery/commissioning.",
      "Delivery & installation timeline: 5–10 business days from advance receipt.",
      "Hardware warranty: 1-month replacement on imported hardware parts only.",
      "Software warranty: starts from the first system startup / go-live date.",
      "Any additional scope beyond this quotation will be quoted separately.",
    ],
    call: "Call Now",
    whatsapp: "WhatsApp",
    products: [
      { key: "switch", name: "Cisco Catalyst 3560X — 48 Port Gigabit Switch", img: imgSwitch, qty: 1, price: 7800, discount: 10,
        desc: "48-port Gigabit Layer-3 switch — the backbone of your LAN. Handles all IP phones, workstations and the PBX server with wire-speed performance and advanced QoS for crystal-clear voice." },
      { key: "router", name: "Cisco Router — 2 Landline (FXO) Lines", img: imgRouter, qty: 1, price: 6600, discount: 10,
        desc: "Integrates 2 traditional landline phone lines into the VoIP network, allowing incoming and outgoing calls through the PBX." },
      { key: "dongle", name: "4G/LTE GSM Dongle (Mobile Line)", img: imgDongle, qty: 2, price: 2500, discount: 5,
        desc: "Injects mobile SIM lines directly into the PBX. Answer and dial mobile numbers from any extension — including installation." },
      { key: "p6921", name: "Cisco IP Phone 6921", img: img6921, ...phonePricing.p6921,
        desc: "Two-line IP phone with a monochrome display, dedicated line keys and speakerphone for everyday office communications." },
      { key: "p7841", name: "Cisco IP Phone 7841", img: img7841, ...phonePricing.p7841,
        desc: "Four-line IP phone with a monochrome display, programmable line keys and Gigabit Ethernet passthrough." },
      { key: "p8841", name: "Cisco IP Phone 8841", img: img8841, ...phonePricing.p8841,
        desc: "Five-line IP phone with a color display, wideband audio and Gigabit Ethernet for managers and busy workstations." },
      { key: "server", name: "PBX Server (HP Desktop, i5 4th/5th, 12GB RAM, 256GB SSD)", img: imgServer, qty: 1, price: 6100, discount: 0,
        desc: "Dedicated server hosting the Issabel IP-PBX — fast SSD boot, plenty of RAM for concurrent calls and recordings." },
      { key: "system", name: "Issabel PBX System — Full Configuration & Deployment", img: imgIssabel, qty: 1, price: 14000, discount: 0, flatDiscount: 1000,
        desc: "Full software deployment: extensions, IVR menus, voicemail, call recording, ring groups, time conditions, trunk integration, backup and staff training." },
    ],
  },
  ar: {
    dir: "rtl" as const,
    company: "Switches Market",
    tagline: "شبكات · فويب · حلول ذكاء اصطناعي",
    switchLang: "English",
    downloadPdf: "تحميل PDF",
    heroTitle: "عرض سعر مشروع",
    heroFor: "مُعدّ للعميل",
    clientName: "إسلام حسن",
    issued: "تاريخ الإصدار",
    validUntil: "صالح حتى",
    validNote: "هذا العرض ساري لمدة أسبوع واحد من تاريخ الإصدار.",
    overview: "نظرة عامة على المشروع",
    overviewText:
      "حل متكامل للشبكات ونظام سنترال VoIP باستخدام أجهزة سيسكو المؤسسية ومنصة Issabel. يوحّد النظام خطوط التليفون الأرضي وخطوط الموبايل والتحويلات الداخلية في منظومة اتصالات ذكية وقابلة للتوسع وجاهزة لإضافات الذكاء الاصطناعي مستقبلاً.",
    steps: "خطوات التنفيذ",
    stepList: [
      { t: "المعاينة والتصميم", d: "معاينة كاملة للموقع وتصميم الشبكة والكابلات وتوبولوجي الـ VoIP بما يناسب طبيعة عملك." },
      { t: "تركيب الأجهزة", d: "تركيب السويتش والراوتر والتليفونات وتوصيل الكابلات وضبطها بشكل احترافي." },
      { t: "تجهيز سيرفر السنترال", d: "تنصيب Issabel على سيرفر مخصص ودمج خطي تليفون أرضي و2 دونجل موبايل." },
      { t: "الكونفيجريشن والاختبار", d: "ضبط التحويلات والـ IVR والبريد الصوتي وتسجيل المكالمات وتقارير CDR." },
      { t: "التدريب والتسليم", d: "تدريب فريق العمل وتسليم التوثيق ودعم فني لمدة 30 يوم بعد التشغيل." },
    ],
    benefits: "أهم المزايا",
    benefitList: [
      "أجهزة سيسكو مؤسسية عالية الاعتمادية",
      "توحيد خطوط الأرضي والموبايل في سنترال واحد",
      "مكالمات داخلية مجانية بين كل الفروع",
      "تسجيل مكالمات و IVR وتقارير تحليلية",
      "قابل للتوسع لمئات المستخدمين",
      "منصة جاهزة لإضافة الذكاء الاصطناعي",
    ],
    devices: "تفاصيل الأجهزة والسوفت وير",
    pricing: "ملخص الأسعار",
    item: "البند",
    qty: "الكمية",
    unit: "سعر الوحدة النهائي (ج.م)",
    discount: "الخصم",
    total: "الإجمالي (ج.م)",
    subtotal: "الإجمالي",
    totalDiscount: "إجمالي الخصم",
    grand: "الإجمالي النهائي",
    contact: "جاهز تبدأ؟",
    contactSub: "تواصل معنا للموافقة وبدء التنفيذ فوراً.",
    termsTitle: "الشروط والأحكام",
    terms: [
      "هذا العرض ساري لمدة أسبوع واحد من تاريخ الإصدار.",
      "الأسعار بالجنيه المصري ولا تشمل أي رسوم جمركية إضافية غير المذكورة.",
      "الدفع: 60% مقدم قبل بدء العمل، و 40% عند التسليم.",
      "مدة التركيب والتشغيل: من 5 إلى 10 أيام عمل من استلام المقدم.",
      "ضمان الهاردوير: استبدال لمدة شهر على القطع الاستيراد فقط.",
      "ضمان السوفت وير: يبدأ من أول تشغيل للسيستم (تاريخ التشغيل الفعلي).",
      "أي أعمال إضافية خارج هذا العرض تُحسب بعرض منفصل.",
    ],
    call: "اتصل الآن",
    whatsapp: "واتساب",
    products: [
      { key: "switch", name: "سويتش سيسكو Catalyst 3560X — 48 بورت جيجا", img: imgSwitch, qty: 1, price: 7800, discount: 10,
        desc: "سويتش 48 بورت جيجا Layer-3 — العمود الفقري للشبكة، يدير كل التليفونات وأجهزة الكمبيوتر وسيرفر السنترال بأداء عالي." },
      { key: "router", name: "راوتر سيسكو — تركيب خطين تليفون أرضي", img: imgRouter, qty: 1, price: 6600, discount: 10,
        desc: "يدمج خطي تليفون أرضي داخل شبكة الـ VoIP لاستقبال وإجراء المكالمات عبر السنترال." },
      { key: "dongle", name: "دونجل 4G/LTE لخطوط الموبايل", img: imgDongle, qty: 2, price: 2500, discount: 5,
        desc: "يُدخل خطوط الموبايل مباشرة داخل السنترال — الرد والاتصال بأرقام الموبايل من أي تحويلة، شامل التركيب." },
      { key: "p6921", name: "تليفون سيسكو IP 6921", img: img6921, ...phonePricing.p6921,
        desc: "تليفون IP بخطين وشاشة أحادية اللون وأزرار مخصصة للخطوط وسبيكر للاستخدام اليومي في المكتب." },
      { key: "p7841", name: "تليفون سيسكو IP 7841", img: img7841, ...phonePricing.p7841,
        desc: "تليفون IP بأربعة خطوط وشاشة أحادية اللون وأزرار خطوط قابلة للبرمجة ومنافذ شبكة جيجا." },
      { key: "p8841", name: "تليفون سيسكو IP 8841", img: img8841, ...phonePricing.p8841,
        desc: "تليفون IP بخمسة خطوط وشاشة ملونة وصوت عالي الجودة ومنافذ شبكة جيجا للمدراء ومحطات العمل كثيرة المكالمات." },
      { key: "server", name: "سيرفر PBX (HP Desktop, i5 جيل 4/5, رام 12, SSD 256)", img: imgServer, qty: 1, price: 6100, discount: 0,
        desc: "سيرفر مخصص لاستضافة Issabel — إقلاع سريع من SSD ورامات كافية للمكالمات والتسجيلات المتزامنة." },
      { key: "system", name: "نظام Issabel PBX — تنصيب وكونفيجريشن كامل", img: imgIssabel, qty: 1, price: 14000, discount: 0, flatDiscount: 1000,
        desc: "تنصيب كامل للسوفت وير: تحويلات، IVR، بريد صوتي، تسجيل مكالمات، Ring Groups، Time Conditions، دمج الترنكات، النسخ الاحتياطي وتدريب الفريق." },
    ],
  },
};

const PHONE = "201002194451";
const WHATSAPP = `https://wa.me/${PHONE}`;
const TEL = `tel:+${PHONE}`;

function formatK(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(2)}k`;
  }
  return n.toString();
}

function todayString(): string {
  const d = new Date();
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}
function validUntilString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

function QuotePage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  const items = useMemo(
    () => t.products.map(calculateItem),
    [t.products],
  );
  const grossTotal = useMemo(() => items.reduce((a, b) => a + b.gross, 0), [items]);
  void grossTotal;
  const totalDiscount = useMemo(() => items.reduce((a, b) => a + b.discountAmt, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + b.line, 0), [items]);
  const grand = subtotal;

  const issued = todayString();
  const valid = validUntilString();

  const downloadPdf = () => {
    // PDF is always in English for guaranteed font support.
    const en = T.en;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    // Header band
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageW, 34, "F");
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 34, pageW, 1, "F");

    // Try to add logo
    try {
      doc.addImage(logo, "PNG", 12, 6, 22, 22);
    } catch { /* ignore */ }

    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(en.company, 38, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(en.tagline, 38, 22);
    doc.setFontSize(9);
    doc.text(`Phone: +${PHONE}`, pageW - 12, 16, { align: "right" });
    doc.text(`WhatsApp: wa.me/${PHONE}`, pageW - 12, 22, { align: "right" });

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Project Quotation", 12, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Prepared for: ${en.clientName}`, 12, 56);
    doc.text(`Issued: ${issued}`, 12, 62);
    doc.text(`Valid until: ${valid}`, 12, 68);

    // Overview
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text("Project Overview", 12, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const overviewLines = doc.splitTextToSize(en.overviewText, pageW - 24);
    doc.text(overviewLines, 12, 87);

    // Pricing table
    autoTable(doc, {
      startY: 110,
      head: [["#", "Item", "Qty", "Final Unit (EGP)", "Disc.", "Total (EGP)"]],
      body: items.map((it, i) => [
        String(i + 1),
        en.products[i].name,
        String(it.qty),
        it.netUnit.toLocaleString(),
        it.discount ? `${it.discount}%` : it.discountAmt ? `-${it.discountAmt.toLocaleString()}` : "—",
        it.line.toLocaleString(),
      ]),
      styles: { font: "helvetica", fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        2: { cellWidth: 14, halign: "center" },
        3: { cellWidth: 28, halign: "right" },
        4: { cellWidth: 18, halign: "center" },
        5: { cellWidth: 30, halign: "right" },
      },
    });

    // Totals
    let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const rightX = pageW - 12;
    doc.text(`Total Discount:`, rightX - 85, y);
    doc.text(`- EGP ${totalDiscount.toLocaleString()}`, rightX, y, { align: "right" });
    y += 6;
    doc.text(`Subtotal (after discount):`, rightX - 85, y);
    doc.text(`EGP ${subtotal.toLocaleString()}`, rightX, y, { align: "right" });
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Grand Total:`, rightX - 85, y);
    doc.setTextColor(59, 130, 246);
    doc.text(`EGP ${grand.toLocaleString()}`, rightX, y, { align: "right" });

    // Terms
    y += 16;
    if (y + 65 > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(200);
    doc.line(12, y, pageW - 12, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text("Terms & Conditions", 12, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70);
    const terms = [
      "1. This offer is valid for ONE WEEK from the issue date.",
      "2. Prices are in Egyptian Pounds (EGP) and exclude any customs duties beyond what is stated.",
      "3. Payment: 60% advance before work begins, 40% on delivery/commissioning.",
      "4. Delivery & installation timeline: 5-10 business days from advance receipt.",
      "5. Hardware warranty: 1-month replacement on imported hardware parts only.",
      "6. Software warranty: starts from the first system startup / go-live date.",
      "7. Any additional scope beyond this quotation will be quoted separately.",
    ];
    terms.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, pageW - 24);
      doc.text(wrapped, 12, y);
      y += wrapped.length * 5;
    });

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    for (let page = 1; page <= doc.getNumberOfPages(); page++) {
      doc.setPage(page);
      doc.setFillColor(15, 23, 42);
      doc.rect(0, pageH - 14, pageW, 14, "F");
      doc.setTextColor(255);
      doc.setFontSize(9);
      doc.text(`${en.company} — ${en.tagline}`, 12, pageH - 5);
      doc.text(`+${PHONE}  ·  wa.me/${PHONE}`, pageW - 12, pageH - 5, { align: "right" });
    }

    doc.save(`SwitchesMarket-Quotation-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div dir={t.dir} className="min-h-screen">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Switches Market" className="h-10 w-10 md:h-12 md:w-12 object-contain animate-glow rounded-lg" />
            <div className="leading-tight">
              <div className="font-display font-bold text-base md:text-lg text-gradient">{t.company}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground">{t.tagline}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadPdf}
              className="btn-primary hover:btn-primary-hover px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span className="hidden sm:inline">{t.downloadPdf}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold border border-primary/40 hover:bg-primary/10 transition"
            >
              {t.switchLang}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-cyan mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              {t.company}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient">{t.heroTitle}</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">{t.tagline}</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-muted-foreground">{t.heroFor}</div>
                <div className="text-xl font-bold mt-1">{t.clientName}</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-muted-foreground">{t.issued}</div>
                <div className="text-sm font-semibold mt-1">{issued}</div>
              </div>
              <div className="glass rounded-xl p-4 border-accent/40">
                <div className="text-xs text-muted-foreground">{t.validUntil}</div>
                <div className="text-sm font-semibold mt-1 text-accent">{valid}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <img src={logo} alt="Logo" className="relative h-40 md:h-56 w-auto object-contain animate-float" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <Section title={t.overview}>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl">{t.overviewText}</p>
      </Section>

      {/* Steps */}
      <Section title={t.steps}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {t.stepList.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5 relative overflow-hidden group hover:border-primary/60 transition"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-semibold text-base mb-2">{s.t}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section title={t.benefits}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.benefitList.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: t.dir === "rtl" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 glass rounded-lg p-4 hover:border-accent/60 transition"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full btn-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <span className="font-medium text-sm md:text-base">{b}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Devices */}
      <Section title={t.devices}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl overflow-hidden group hover:border-primary/70 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-2 relative bg-white flex items-center justify-center p-6 min-h-[220px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 pointer-events-none" />
                  <img src={p.img} alt={p.name} className="relative max-h-48 w-auto object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold leading-snug">{p.name}</h3>
                      {p.discount || (p as { flatDiscount?: number }).flatDiscount ? (
                        <span className="flex-shrink-0 inline-block px-2 py-1 rounded-full text-[11px] font-bold bg-accent/20 text-accent whitespace-nowrap">
                          -{p.discount ? `${p.discount}%` : `${((p as { flatDiscount?: number }).flatDiscount || 0).toLocaleString()} EGP`} {t.discount}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-border/50 pt-4">
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{t.qty}</div>
                      <div className="font-bold">{p.qty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-muted-foreground">{t.unit}: {formatK(p.netUnit)}</div>
                      <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{t.total}</div>
                      {p.discountAmt ? (
                        <div className="text-xs text-muted-foreground line-through">EGP {p.gross.toLocaleString()}</div>
                      ) : null}
                      <div className="text-2xl font-bold text-gradient">{formatK(p.line)}</div>
                      <div className="text-[10px] text-muted-foreground">EGP {p.line.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section title={t.pricing}>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="btn-primary text-primary-foreground">
                  <th className={`p-4 ${t.dir === "rtl" ? "text-right" : "text-left"} font-semibold`}>#</th>
                  <th className={`p-4 ${t.dir === "rtl" ? "text-right" : "text-left"} font-semibold`}>{t.item}</th>
                  <th className="p-4 text-center font-semibold">{t.qty}</th>
                  <th className={`p-4 ${t.dir === "rtl" ? "text-left" : "text-right"} font-semibold`}>{t.unit}</th>
                  <th className="p-4 text-center font-semibold">{t.discount}</th>
                  <th className={`p-4 ${t.dir === "rtl" ? "text-left" : "text-right"} font-semibold`}>{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.key} className="border-t border-border/50 hover:bg-primary/5 transition">
                    <td className={`p-4 ${t.dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground`}>{i + 1}</td>
                    <td className={`p-4 ${t.dir === "rtl" ? "text-right" : "text-left"} font-medium`}>{it.name}</td>
                    <td className="p-4 text-center">{it.qty}</td>
                    <td className={`p-4 ${t.dir === "rtl" ? "text-left" : "text-right"} tabular-nums`}>
                      {it.discountAmt > 0 && <div className="text-xs text-muted-foreground line-through">{formatK(it.price)}</div>}
                      {formatK(it.netUnit)}
                    </td>
                    <td className="p-4 text-center tabular-nums">
                      {it.discount ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent">-{it.discount}%</span> : it.discountAmt ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent">-{it.discountAmt.toLocaleString()} EGP</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className={`p-4 ${t.dir === "rtl" ? "text-left" : "text-right"} font-bold text-cyan tabular-nums`}>{formatK(it.line)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border/50 p-6 bg-secondary/30">
            <div className="max-w-md ms-auto space-y-3">
              {totalDiscount > 0 && (
                <Row label={t.totalDiscount} value={`-${formatK(totalDiscount)}`} sub={`- EGP ${totalDiscount.toLocaleString()}`} />
              )}
              <Row label={t.subtotal} value={formatK(subtotal)} sub={`EGP ${subtotal.toLocaleString()}`} />
              
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base font-bold">{t.grand}</span>
                  <div className="text-right">
                    <div className="text-3xl md:text-4xl font-black text-gradient tabular-nums">{formatK(grand)}</div>
                    <div className="text-xs text-muted-foreground">EGP {grand.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 glass rounded-xl p-4 border-accent/40 flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className="text-sm font-medium">{t.validNote}</span>
        </div>
      </Section>

      {/* Terms */}
      <Section title={t.termsTitle}>
        <div className="glass rounded-xl p-6 md:p-8 border-accent/40">
          <ul className="space-y-4">
            {t.terms.map((term, i) => (
              <li key={i} className={`flex items-start gap-3 ${t.dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full btn-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-sm md:text-base text-muted-foreground">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Contact CTA */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-gradient mb-3">{t.contact}</h2>
            <p className="text-muted-foreground mb-8">{t.contactSub}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={TEL} className="btn-primary hover:btn-primary-hover px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {t.call} · +{PHONE}
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                 className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition"
                 style={{ boxShadow: "0 0 30px oklch(0.7 0.2 145 / 0.4)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                {t.whatsapp}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="font-display font-bold text-gradient text-lg mb-1">{t.company}</div>
          <div>{t.tagline}</div>
          <div className="mt-2">+{PHONE}</div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-bold mb-8"
      >
        <span className="text-gradient">{title}</span>
      </motion.h2>
      {children}
    </section>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <div className="text-lg font-bold tabular-nums">{value}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
