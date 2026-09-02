import { createFileRoute } from "@tanstack/react-router";
import {
  Wallet,
  PieChart,
  Building2,
  Users,
  QrCode,
  CalendarDays,
  ShieldCheck,
  WifiOff,
  Cloud,
  RefreshCw,
  DatabaseBackup,
  Bell,
  MessageCircle,
  Phone,
  Globe,
  ClipboardList,
  TrendingUp,
  Lock,
  UserCheck,
  Receipt,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { Reveal } from "@/components/Reveal";
import oltaniLogo from "@/assets/oltani-logo.png";
import trackLogo from "@/assets/track-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import heroVideo from "@/assets/video-hero.mp4";
import syncVideo from "@/assets/video-sync.mp4";
import diagramSync from "@/assets/diagram-sync.jpg";
import shotFinance from "@/assets/shot-finance.jpg";
import shotManager from "@/assets/shot-manager.jpg";
import shotCalendar from "@/assets/shot-calendar.jpg";
import shotCrm from "@/assets/shot-crm.jpg";
import photoAccess from "@/assets/photo-access.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "عرض مشروع نظام إدارة Track Education Center | OLTANI" },
      {
        name: "description",
        content:
          "عرض تفصيلي وبسيط لنظام ERP و CRM متكامل لإدارة مركز Track Education Center: الإدارة المالية ومراكز التكلفة، لوحة المدير، القاعات والمحاضرين، الحضور بالباركود، والعمل بدون إنترنت.",
      },
      { property: "og:title", content: "عرض مشروع نظام إدارة Track Education Center | OLTANI" },
      {
        property: "og:description",
        content: "نظام إداري ومالي متكامل يعمل أوفلاين ويُزامن سحابياً — تنفيذ شركة OLTANI.",
      },
    ],
  }),
  component: Proposal,
});

const PHONE = "01002194451";
const WA = "https://wa.me/201002194451";

/* ---------- small building blocks ---------- */

function SectionHeading({
  index,
  kicker,
  title,
  subtitle,
}: {
  index?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {index && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-bold tracking-wide text-primary">
          {kicker ? `${index} · ${kicker}` : index}
        </span>
      )}
      <h2 className="mt-4 text-2xl font-extrabold leading-tight text-foreground sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Wallet;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-panel h-full p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
      <div className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-base font-bold text-foreground sm:text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{children}</p>
    </div>
  );
}

function Shot({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}) {
  return (
    <figure className="surface-panel glow-ring overflow-hidden">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className="w-full"
      />
      <figcaption className="border-t border-border px-4 py-3 text-xs leading-6 text-muted-foreground sm:text-sm">
        {caption}
      </figcaption>
    </figure>
  );
}

function Simple({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-panel border-primary/40 bg-secondary/40 p-4 sm:p-5">
      <p className="text-xs font-bold text-primary">بالبساطة كدة 👇</p>
      <p className="mt-2 text-sm leading-7 text-foreground/90">{children}</p>
    </div>
  );
}

/* ---------- page ---------- */

function Proposal() {
  const nav = [
    { href: "#finance", label: "المالية" },
    { href: "#manager", label: "لوحة المدير" },
    { href: "#ops", label: "القاعات والحضور" },
    { href: "#crm", label: "الطلاب" },
    { href: "#tech", label: "البنية التقنية" },
    { href: "#plan", label: "خطة التنفيذ" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <img
              src={oltaniLogo}
              alt="شعار شركة OLTANI"
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold sm:text-base">OLTANI</span>
              <span className="block truncate text-[10px] text-muted-foreground sm:text-xs">
                Open Link Technologies &amp; AI
              </span>
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bar-brand px-3 py-2 text-xs font-bold text-primary-foreground sm:px-4 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">واتساب</span>
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-foreground sm:px-4 sm:text-sm"
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{PHONE}</span>
            </a>
          </div>
        </div>
        <nav className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 sm:px-6">
          <ul className="flex min-w-max gap-4 text-xs text-muted-foreground sm:text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-primary">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src={heroVideo}
          poster={heroBg}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
        <div className="absolute inset-0 bg-background/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-8 flex flex-wrap items-center justify-center gap-4">
              <img
                src={trackLogo}
                alt="شعار Track Education Center"
                width={220}
                height={124}
                className="h-28 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-36"
              />
              <span className="text-2xl text-muted-foreground">×</span>
              <img
                src={oltaniLogo}
                alt="شعار OLTANI"
                width={140}
                height={140}
                className="h-28 w-28 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-36 sm:w-36"
              />
            </div>
            <p className="text-xs font-bold tracking-widest text-primary sm:text-sm">
              عرض مشروع مقدم من OLTANI
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
              نظام إداري ومالي متكامل
              <span className="block text-gradient-brand">
                لإدارة Track Education Center
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-lg">
              نظام واحد يجمع الحسابات والأرباح، وحجز القاعات، ومستحقات الدكاترة، وحضور الطلاب
              بالباركود، وملفات الطلاب والتسويق — ويعمل بكفاءة كاملة حتى بدون إنترنت.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#finance"
                className="rounded-full bar-brand px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                استعرض تفاصيل النظام
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground"
              >
                تواصل معنا الآن
              </a>
            </div>
            <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[
                { k: "5", v: "أنظمة في منصة واحدة" },
                { k: "100%", v: "عمل بدون إنترنت" },
                { k: "لحظي", v: "تسجيل الحضور بالباركود" },
                { k: "آلي", v: "حساب مستحقات الدكاترة" },
              ].map((s) => (
                <div key={s.v} className="surface-panel p-3 text-center sm:p-4">
                  <dt className="text-lg font-black text-primary sm:text-2xl">{s.k}</dt>
                  <dd className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            kicker="نظرة عامة"
            index="مقدمة"
            title="ما هي المشكلة التي نحلها؟"
            subtitle="إدارة السنتر اليوم موزعة بين دفاتر ورقية، ملفات إكسل، ورسائل واتساب. النتيجة: أرقام غير دقيقة، خلافات في مستحقات الدكاترة، وتضارب في حجز القاعات. النظام يجمع كل ذلك في مكان واحد."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="surface-panel h-full p-6">
              <h3 className="text-lg font-bold text-destructive">الوضع الحالي</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                {[
                  "لا تعرف ربح كل كورس أو قاعة على حدة، فقط إجمالي تقديري.",
                  "حساب نسب الدكاترة يدوياً ويستغرق وقتاً ويسبب خلافات.",
                  "تضارب في مواعيد القاعات وحجوزات مكررة.",
                  "غياب سجل يوضح من عدّل أو حذف فاتورة.",
                  "توقف العمل كلياً عند انقطاع الإنترنت.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="surface-panel glow-ring h-full p-6">
              <h3 className="text-lg font-bold text-primary">بعد تطبيق النظام</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground/90">
                {[
                  "ربحية دقيقة لكل كورس وقاعة ودكتور عبر مراكز التكلفة.",
                  "مستحقات الدكاترة تُحسب تلقائياً من الحضور الفعلي.",
                  "تقويم مرئي يمنع أي تضارب في حجز القاعات.",
                  "سجل تدقيق كامل لكل حركة بالوقت والمستخدم.",
                  "العمل مستمر أوفلاين، والمزامنة تلقائية عند عودة الإنترنت.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1. Finance */}
      <section id="finance" className="border-y border-border bg-sidebar/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading
              index="الجزء الأول"
              kicker="Financial & Cost Centers"
              title="الإدارة المالية المتقدمة ومراكز التكلفة"
              subtitle="دفتر أستاذ عام رقمي ذكي يضبط التدفقات النقدية ويحلّل ربحية كل نشاط داخل السنتر."
            />
          </Reveal>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
            <Reveal>
              <Shot
                src={shotFinance}
                alt="لوحة التحكم المالية: الإيرادات والمصروفات وصافي الربح ومراكز التكلفة"
                width={1280}
                height={800}
                caption="نموذج للشاشة المالية: إيرادات، مصروفات، صافي الربح، وأعلى مراكز التكلفة."
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Reveal>
                <FeatureCard icon={PieChart} title="مراكز التكلفة (Cost Centers)">
                  ربط كل إيراد ومصروف بمركز محدد (كورس التشريح للفرقة الأولى، قاعة رقم 1، دكتور
                  معين) لمعرفة ربحية كل عنصر بدقة بدلاً من حساب السنتر ككتلة واحدة.
                </FeatureCard>
              </Reveal>
              <Reveal delay={80}>
                <FeatureCard icon={Layers} title="رأس المال والأصول">
                  تسجيل رأس المال التأسيسي وتتبع إهلاك الأصول (شاشات، مقاعد، أجهزة تكييف) سنوياً.
                </FeatureCard>
              </Reveal>
              <Reveal delay={160}>
                <FeatureCard icon={Receipt} title="الإيرادات">
                  تحصيلات الطلاب (كورسات ومراجعات)، إيرادات تأجير القاعات للمحاضرين، ومبيعات
                  المذكرات والمطبوعات.
                </FeatureCard>
              </Reveal>
              <Reveal delay={240}>
                <FeatureCard icon={Wallet} title="شجرة المصروفات">
                  تشغيلية واستهلاكية (إيجار، مرافق، أوراق، مطبوعات، ضيافة، صيانة) + الأجور
                  والمرتبات (سكرتارية، عمال، خدمة عملاء).
                </FeatureCard>
              </Reveal>
              <Reveal delay={320}>
                <FeatureCard icon={UserCheck} title="مستحقات المحاضرين">
                  حساب آلي لنسب الدكاترة (نسبة مئوية من الحضور أو أجر ثابت) وخصمها من الإيرادات
                  فوراً.
                </FeatureCard>
              </Reveal>
              <Reveal delay={400}>
                <FeatureCard icon={TrendingUp} title="تحليل الربحية">
                  مقارنة أداء الكورسات والقاعات شهرياً لمعرفة الأعلى ربحاً والأقل جدوى.
                </FeatureCard>
              </Reveal>
            </div>
          </div>
          <Reveal>
            <div className="mt-8">
              <Simple>
                تخيّل أن كل جنيه يدخل أو يخرج من السنتر يحمل «ملصق» يوضح مصدره ومكانه. في نهاية
                الشهر يخبرك النظام: كورس التشريح ربح كذا، القاعة رقم 2 خسرت كذا — بدون حسابات
                يدوية.
              </Simple>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Manager */}
      <section id="manager" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            index="الجزء الثاني"
            kicker="Manager Dashboard"
            title="لوحة تحكم الإدارة العليا والمتابعة"
            subtitle="شاشة معزولة بصلاحيات عليا لمالك أو مدير السنتر، تعطي رؤية شاملة ولحظية من أي مكان."
          />
        </Reveal>
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Shot
              src={shotManager}
              alt="لوحة تحكم المدير: مؤشرات لحظية، نسبة إشغال، درج النقدية، وسجل التدقيق"
              width={1280}
              height={800}
              caption="نموذج لوحة المدير: مؤشرات لحظية، إشغال القاعات، مطابقة درج النقدية، وسجل التدقيق."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <FeatureCard icon={TrendingUp} title="مؤشرات لحظية (Live KPIs)">
                النقدية الحالية في درج السكرتارية، نسبة إشغال القاعات، وعدد الطلاب الحاضرين الآن.
              </FeatureCard>
            </Reveal>
            <Reveal delay={80}>
              <FeatureCard icon={Wallet} title="إغلاق الوردية">
                مطابقة النقدية المسجلة بالنظام مع النقدية الفعلية نهاية اليوم لتحديد أي عجز أو
                زيادة.
              </FeatureCard>
            </Reveal>
            <Reveal delay={160}>
              <FeatureCard icon={ClipboardList} title="سجل التدقيق (Audit Trail)">
                تسجيل كل إضافة أو تعديل أو حذف لفاتورة أو طالب مع الوقت والمستخدم لضمان الشفافية
                ومنع التلاعب.
              </FeatureCard>
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard icon={PieChart} title="التقارير التحليلية">
                أرباح وخسائر، تقارير مراكز التكلفة، معدلات الحضور والغياب، وحساب نقطة التعادل
                (Break-even).
              </FeatureCard>
            </Reveal>
            <Reveal delay={320}>
              <FeatureCard icon={Bell} title="التنبيهات الذكية">
                إشعارات بموعد دفع الإيجار، نواقص المطبوعات والأوراق، وتأخر تحصيل أقساط الطلاب.
              </FeatureCard>
            </Reveal>
            <Reveal delay={400}>
              <FeatureCard icon={Lock} title="صلاحيات مفصّلة">
                كل مستخدم يرى ما يخصه فقط: السكرتارية للتحصيل، والمدير للأرباح والتقارير الحساسة.
              </FeatureCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Operations */}
      <section id="ops" className="border-y border-border bg-sidebar/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading
              index="الجزء الثالث"
              kicker="Operations"
              title="إدارة القاعات والمحاضرين والحضور"
              subtitle="من حجز القاعة حتى تسجيل حضور الطالب بالباركود وتحديث حساب الدكتور في نفس اللحظة."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <Shot
                src={shotCalendar}
                alt="تقويم تفاعلي لحجز القاعات أسبوعياً"
                width={1280}
                height={800}
                caption="جدولة القاعات: عرض مرئي أسبوعي يوضح المتاح والمشغول بحسب السعة ويمنع التضارب."
              />
            </Reveal>
            <Reveal delay={120}>
              <Shot
                src={photoAccess}
                alt="طالب يمسح كارت الباركود عند بوابة الدخول"
                width={1280}
                height={800}
                caption="التحكم في الدخول: مسح كارت الطالب (Barcode/QR) يسجل الحضور ويحدّث الإيرادات والمستحقات فوراً."
              />
            </Reveal>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Reveal>
              <FeatureCard icon={CalendarDays} title="جدولة القاعات">
                تقويم تفاعلي بالسعات والمواعيد، مع منع الحجز المزدوج تلقائياً.
              </FeatureCard>
            </Reveal>
            <Reveal delay={80}>
              <FeatureCard icon={Building2} title="بوابة المحاضرين">
                قاعدة بيانات للدكاترة: التخصص، الاتفاق المالي، وسجل كل الحجوزات والمستحقات.
              </FeatureCard>
            </Reveal>
            <Reveal delay={160}>
              <FeatureCard icon={QrCode} title="التحكم في الدخول">
                ربط بقارئات الباركود لمسح كروت الطلاب عند الدخول وتسجيل الحضور آلياً.
              </FeatureCard>
            </Reveal>
          </div>
          <Reveal>
            <div className="mt-8">
              <Simple>
                الطالب يمسح كارته عند الباب → النظام يسجل حضوره في المحاضرة الصحيحة → يزيد رصيد
                مستحقات الدكتور وإيراد الكورس تلقائياً. كل ذلك في أقل من ثانية وبدون تدخل بشري.
              </Simple>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. CRM */}
      <section id="crm" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            index="الجزء الرابع"
            kicker="CRM"
            title="إدارة علاقات الطلاب"
            subtitle="مصمم لاستهداف طلاب الكليات العملية (طب بشري، أسنان، صيدلة) بجامعات 6 أكتوبر والقاهرة والجيزة."
          />
        </Reveal>
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <FeatureCard icon={Users} title="الملف الأكاديمي للطالب">
                بيانات الطالب، رقم ولي الأمر للطوارئ، الجامعة، التخصص، والفرقة الدراسية.
              </FeatureCard>
            </Reveal>
            <Reveal delay={80}>
              <FeatureCard icon={Layers} title="التقسيم والتسويق">
                فرز الطلاب حسب الفرقة والجامعة لإرسال عروض مخصصة مبنية على منهج كل جامعة.
              </FeatureCard>
            </Reveal>
            <Reveal delay={160}>
              <FeatureCard icon={MessageCircle} title="تواصل فعّال">
                تكامل مع WhatsApp و SMS لإرسال تذكيرات المحاضرات والتعديلات الطارئة بضغطة واحدة.
              </FeatureCard>
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard icon={UserCheck} title="العملاء المحتملون (Leads)">
                تتبع الطلاب المستفسرين ومتابعتهم حتى تحويلهم إلى اشتراكات فعلية.
              </FeatureCard>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Shot
              src={shotCrm}
              alt="ملف الطالب في نظام CRM مع سجل الحضور وتذكير واتساب"
              width={1280}
              height={800}
              caption="نموذج ملف الطالب: البيانات الأكاديمية، سجل الحضور، والتذكيرات عبر واتساب."
            />
          </Reveal>
        </div>
      </section>

      {/* 5. Tech */}
      <section id="tech" className="border-y border-border bg-sidebar/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <SectionHeading
              index="الجزء الخامس"
              kicker="Offline-First Architecture"
              title="البنية التقنية والمزامنة"
              subtitle="النظام يعمل حتى لو انقطع الإنترنت أو الكهرباء، ثم يزامن بياناته تلقائياً مع السحابة."
            />
          </Reveal>
          <Reveal>
            <figure className="surface-panel glow-ring mt-10 overflow-hidden">
              <video
                className="w-full"
                src={syncVideo}
                poster={diagramSync}
                autoPlay
                muted
                loop
                playsInline
              />
              <figcaption className="border-t border-border px-4 py-3 text-xs leading-6 text-muted-foreground sm:text-sm">
                توضيح حركة البيانات: تطبيق السنتر بقاعدة بيانات محلية مشفّرة ← محرك المزامنة ←
                الخادم السحابي مع نسخ احتياطي وحماية.
              </figcaption>
            </figure>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <FeatureCard icon={WifiOff} title="تطبيق سطح المكتب">
                برنامج كمبيوتر مستقل وسريع، متصل بقاعدة بيانات محلية مشفّرة بالكامل على أجهزة
                السنتر لتسجيل الحجوزات والباركود والفواتير فوراً بدون إنترنت.
              </FeatureCard>
            </Reveal>
            <Reveal delay={80}>
              <FeatureCard icon={Cloud} title="الخوادم السحابية">
                قاعدة بيانات مركزية على خادم افتراضي (VPS) ببيئة Ubuntu، والاتصال يمر عبر
                Cloudflare لتأمين النظام وتوجيه النطاقات وصد الهجمات.
              </FeatureCard>
            </Reveal>
            <Reveal delay={160}>
              <FeatureCard icon={RefreshCw} title="محرك المزامنة">
                يعمل في الخلفية ويراقب الاتصال: يرفع الجديد ويجلب تعديلات المدير من الخارج، مع حل
                التعارضات باستخدام أختام زمنية.
              </FeatureCard>
            </Reveal>
            <Reveal delay={240}>
              <FeatureCard icon={DatabaseBackup} title="نسخ احتياطي تلقائي">
                نسخ دورية على الخادم السحابي لحماية البيانات من التلف أو الفقدان التام.
              </FeatureCard>
            </Reveal>
          </div>
          <Reveal>
            <div className="mt-8">
              <Simple>
                فكّر في الأمر مثل تسجيل الملاحظات في دفترك الخاص: تكتب دائماً حتى لو لا يوجد
                إنترنت. وعندما يعود الإنترنت، يقوم النظام بنسخ ما كتبته إلى خزانة آمنة في السحابة —
                بدون أن تفعل أي شيء.
              </Simple>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Plan */}
      <section id="plan" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <SectionHeading
            index="خطة العمل"
            kicker="Roadmap"
            title="مراحل تنفيذ المشروع"
            subtitle="تنفيذ على مراحل واضحة، مع تسليم قابل للاستخدام في نهاية كل مرحلة وتدريب فريق السنتر."
          />
        </Reveal>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "المرحلة 1 — التحليل والتأسيس",
              d: "جلسات مع إدارة السنتر لتوصيف الحسابات، شجرة المصروفات، مراكز التكلفة، والصلاحيات، ثم تصميم قاعدة البيانات وواجهات النظام.",
              icon: ClipboardList,
            },
            {
              t: "المرحلة 2 — المالية والعمليات",
              d: "بناء الوحدة المالية ومراكز التكلفة، جدولة القاعات، بوابة المحاضرين، وربط قارئات الباركود مع تسجيل الحضور.",
              icon: Wallet,
            },
            {
              t: "المرحلة 3 — CRM والتسويق",
              d: "ملفات الطلاب والتقسيم حسب الجامعة والفرقة، إدارة العملاء المحتملين، وتكامل واتساب/SMS للتذكيرات.",
              icon: Users,
            },
            {
              t: "المرحلة 4 — البنية السحابية والمزامنة",
              d: "تجهيز خادم VPS بـ Ubuntu، الحماية عبر Cloudflare، محرك المزامنة وحل التعارضات، والنسخ الاحتياطي التلقائي.",
              icon: Cloud,
            },
            {
              t: "المرحلة 5 — التدريب والتشغيل",
              d: "تدريب السكرتارية والإدارة، إدخال البيانات الأولية، وتشغيل تجريبي موازٍ للتأكد من مطابقة الأرقام.",
              icon: UserCheck,
            },
            {
              t: "المرحلة 6 — الدعم والتطوير",
              d: "دعم فني مستمر، تقارير جديدة عند الطلب، ومتابعة أداء النظام وتحديثات الأمان.",
              icon: ShieldCheck,
            },
          ].map((p, i) => (
            <li key={p.t}>
              <Reveal delay={i * 70}>
                <div className="surface-panel h-full p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bar-brand text-sm font-black text-primary-foreground">
                      {i + 1}
                    </span>
                    <h3 className="min-w-0 text-sm font-bold sm:text-base">{p.t}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.d}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA / contact */}
      <section className="border-t border-border bg-sidebar/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <Reveal>
            <div className="surface-panel glow-ring mx-auto max-w-4xl p-6 text-center sm:p-10">
              <img
                src={oltaniLogo}
                alt="شعار OLTANI"
                width={140}
                height={140}
                loading="lazy"
                className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
              />
              <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                جاهزون لبدء تنفيذ نظام Track Education Center
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                تواصل معنا لتحديد جلسة تحليل مجانية، ومناقشة الجدول الزمني والتكلفة النهائية بحسب
                المراحل المطلوبة.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bar-brand px-6 py-3 text-sm font-bold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  واتساب {PHONE}
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  اتصال هاتفي
                </a>
                <a
                  href="https://oltani.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold"
                >
                  <Globe className="h-4 w-4" aria-hidden />
                  oltani.com
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={oltaniLogo}
              alt="شعار OLTANI"
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 shrink-0 object-contain"
            />
            <p className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
              OLTANI — Open Link Technologies &amp; Artificial Network Intelligence
            </p>
          </div>
          <p className="shrink-0 text-xs text-muted-foreground sm:text-sm">{PHONE}</p>
        </div>
      </footer>
    </div>
  );
}
