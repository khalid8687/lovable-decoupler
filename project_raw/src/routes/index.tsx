import type React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Moon, Sun, Languages, ArrowLeft, ArrowRight, Check, Bell, MessageCircle, CalendarDays, Smartphone } from "lucide-react";
import logo from "@/assets/images/logo.png";
import pharmacy from "@/assets/images/pharmacy.jpg";
import { features, shortLabels, t, type Lang } from "@/assets/data/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3ayan — صيدليتك معك خطوة بخطوة" },
      { name: "description", content: "Order medicine by prescription photo, track doses and get pharmacist replies on your phone — no install needed." },
      { property: "og:title", content: "3ayan — Your pharmacy, step by step" },
      { property: "og:description", content: "Prescription photo orders, refill tracking, reminders and senior care — in Arabic and English." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type IconName = keyof typeof Icons;
function Ico({ name, className, strong }: { name: string; className?: string | undefined; strong?: boolean }) {
  const C = Icons[name as IconName] as React.ComponentType<{ className?: string | undefined; strokeWidth?: number | undefined }>;
  return <C className={className} strokeWidth={strong ? 2.4 : undefined} />;
}

/* Phone tile tones: vivid filled chips cycling across the showcase icons */
const phoneTones = [
  "bg-gradient-to-br from-brand-violet to-brand-violet/70 text-primary-foreground",
  "bg-gradient-to-br from-brand-orange to-brand-orange/70 text-primary-foreground",
  "bg-gradient-to-br from-brand-magenta to-brand-magenta/70 text-primary-foreground",
  "bg-gradient-to-br from-brand to-brand-magenta text-primary-foreground",
];

/* Scroll-reveal hook: adds .is-visible when elements enter the viewport */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Gentle parallax: returns translateY for an element based on scroll */
function useParallax(factor: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * factor;
        el.style.transform = `translateY(${offset.toFixed(1)}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [factor]);
  return ref;
}

/* Bento layout: span + tone per feature index (14 features) */
const bento: { span: string; tone: "card" | "brand" | "violet" | "orange" | "pink" | "dark" }[] = [
  { span: "sm:col-span-2", tone: "card" },     // 1 prescription photo — hero card
  { span: "", tone: "brand" },                 // 2 voice
  { span: "", tone: "card" },                  // 3 profile
  { span: "sm:row-span-2", tone: "violet" },   // 4 refill tracking — tall
  { span: "", tone: "card" },                  // 5 reminders
  { span: "", tone: "pink" },                  // 6 seniors
  { span: "sm:col-span-2", tone: "dark" },     // 7 interactions — wide dark
  { span: "", tone: "card" },                  // 8 chronic
  { span: "", tone: "orange" },                // 9 food guidance
  { span: "", tone: "card" },                  // 10 alternatives
  { span: "", tone: "card" },                  // 11 labs
  { span: "sm:col-span-2", tone: "card" },     // 12 family — wide
  { span: "", tone: "card" },                  // 13 side effects
  { span: "", tone: "pink" },                  // 14 emergencies
];

const toneCls: Record<string, string> = {
  card: "border border-border bg-card text-card-foreground shadow-card",
  brand: "bg-brand text-primary-foreground shadow-glow",
  violet: "border border-brand-violet/30 bg-brand-violet/15 text-card-foreground",
  orange: "border border-brand-orange/30 bg-brand-orange/15 text-card-foreground",
  pink: "border border-brand-magenta/30 bg-brand-magenta/15 text-card-foreground",
  dark: "border border-border bg-secondary text-secondary-foreground shadow-card",
};
const toneIcon: Record<string, string> = {
  card: "bg-brand text-primary-foreground",
  brand: "bg-background/20 text-primary-foreground",
  violet: "bg-brand-violet/25 text-brand-violet",
  orange: "bg-brand-orange/25 text-brand-orange",
  pink: "bg-brand-magenta/25 text-brand-magenta",
  dark: "bg-brand text-primary-foreground",
};

function Index() {
  const [lang, setLang] = useState<Lang>("ar");
  const [light, setLight] = useState(false);
  const c = t[lang];
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  useReveal();
  const phoneRef = useParallax(-0.06);

  useEffect(() => {
    const l = localStorage.getItem("lang") as Lang | null;
    const th = localStorage.getItem("theme");
    if (l) setLang(l);
    if (th) setLight(th === "light");
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    localStorage.setItem("theme", light ? "light" : "dark");
  }, [light]);

  const ids = ["features", "how", "pharmacy", "seniors"];

  return (
    <div className="min-h-screen overflow-x-hidden bg-soft">
      {/* Header — logo only, floating glass pill */}
      <header className="sticky top-3 z-50 px-4 sm:px-6">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-border bg-background/70 px-5 shadow-card backdrop-blur-xl">
          <a href="#top"><img src={logo} alt="3ayan" className="h-11 w-auto brightness-150 [.light_&]:brightness-100" /></a>
          <nav className="hidden gap-7 text-sm font-semibold text-muted-foreground md:flex">
            {c.nav.map((n, i) => <a key={n} href={`#${ids[i]}`} className="transition-colors hover:text-foreground">{n}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-bold hover:bg-muted" aria-label="Language">
              <Languages className="h-4 w-4" />{lang === "ar" ? "EN" : "عربي"}
            </button>
            <button onClick={() => setLight(!light)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted" aria-label="Theme">
              {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <a href="#final" className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105 sm:inline-block">{c.cta}</a>
          </div>
        </div>
      </header>

      {/* Hero — centered, glowing phone */}
      <section id="top" className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm font-semibold text-muted-foreground backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />{c.heroTag}
          </span>
          <h1 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-extrabold leading-[1.25] sm:text-6xl">
            {c.heroTitle[0]}
            <span className="mt-2 block text-brand">{c.heroTitle[1]}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{c.heroSub}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#final" className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105">{c.cta}<Arrow className="h-4 w-4" /></a>
            <a href="#features" className="rounded-full border border-border bg-card/60 px-8 py-4 font-bold backdrop-blur hover:bg-muted">{c.heroBtn2}</a>
          </div>
          <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-4">
            {c.stats.map(([n, l]) => (
              <div key={l}><div className="font-display text-3xl font-extrabold text-brand">{n}</div><div className="text-sm text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
        <div ref={phoneRef} className="mt-16 flex justify-center will-change-transform"><Phone lang={lang} /></div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHead tag={c.featTag} title={c.featTitle} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const b = bento[i]!;
            return (
              <div
                key={f.icon}
                style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}
                className={`reveal group relative overflow-hidden rounded-[2rem] p-6 transition-transform duration-500 hover:-translate-y-1.5 ${b.span} ${toneCls[b.tone]}`}
              >
                <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-brand opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40" />
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneIcon[b.tone]}`}><Ico name={f.icon} className="h-6 w-6" /></div>
                <h3 className="mt-4 text-lg font-bold">{f[lang][0]}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${b.tone === "brand" ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{f[lang][1]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How */}
      <section id="how" className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-border bg-secondary/40 px-6 py-16 sm:px-12">
          <SectionHead tag={c.howTag} title={c.howTitle} />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {c.how.map(([h, p], i) => (
              <div key={h} style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties} className="reveal relative rounded-3xl border border-border bg-card p-8 shadow-card">
                <div className="font-display text-6xl font-extrabold text-brand">{i + 1}</div>
                <h3 className="mt-4 text-xl font-bold">{h}</h3>
                <p className="mt-2 text-muted-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacy */}
      <section id="pharmacy" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <div className="reveal relative">
          <img src={pharmacy} alt="" width={1280} height={896} loading="lazy" className="rounded-[2rem] object-cover shadow-glow" />
          <div className="absolute -bottom-6 start-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card animate-float">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-primary-foreground"><Bell className="h-5 w-5" /></div>
            <div><div className="text-sm font-bold">{lang === "ar" ? "طلب جديد · روشتة" : "New order · Prescription"}</div><div className="text-xs text-muted-foreground">{lang === "ar" ? "منذ لحظات" : "Just now"}</div></div>
          </div>
        </div>
        <div className="reveal">
          <SectionHead tag={c.pharmTag} title={c.pharmTitle} left />
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{c.pharmSub}</p>
          <ul className="mt-8 space-y-4">
            {c.pharmList.map((x) => (
              <li key={x} className="flex items-center gap-3 font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success"><Check className="h-4 w-4" /></span>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Seniors */}
      <section id="seniors" className="px-4 py-12 sm:px-6">
        <div className="reveal mx-auto grid max-w-6xl items-center gap-12 overflow-hidden rounded-[2.5rem] bg-brand p-8 text-primary-foreground shadow-glow sm:p-14 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-background/20 px-4 py-1.5 text-sm font-bold">{c.elderTag}</span>
            <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-5xl">{c.elderTitle}</h2>
            <p className="mt-5 text-lg opacity-90">{c.elderSub}</p>
          </div>
          <div className="mx-auto w-full max-w-sm rounded-3xl bg-card p-7 text-card-foreground shadow-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icons.HandHeart className="h-5 w-5 text-primary" />3ayan · 08:00</div>
            <p className="mt-4 text-2xl font-bold">{c.elderQ}</p>
            <button className="mt-6 w-full rounded-2xl bg-success py-5 text-2xl font-extrabold text-primary-foreground">{c.elderOk}</button>
            <button className="mt-3 w-full rounded-2xl border-2 border-destructive py-4 text-xl font-bold text-destructive">{c.elderHelp}</button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h2 className="reveal font-display text-3xl font-extrabold sm:text-4xl">{c.notifTitle}</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[Smartphone, MessageCircle, CalendarDays].map((I, i) => (
            <div key={i} style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties} className="reveal flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-card">
              <I className="h-6 w-6 text-primary" /><span className="font-bold">{c.notif[i]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final */}
      <section id="final" className="px-4 pb-24 sm:px-6">
        <div className="reveal relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-border bg-card bg-soft p-10 text-center shadow-card sm:p-16">
          <img src={logo} alt="3ayan" className="mx-auto h-28 w-auto animate-float brightness-150 [.light_&]:brightness-100" />
          <h2 className="mt-6 font-display text-3xl font-extrabold sm:text-5xl">{c.final}</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">{c.finalSub}</p>
          <a href="#top" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105">{c.cta}<Arrow className="h-4 w-4" /></a>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <img src={logo} alt="3ayan" className="h-10 w-auto brightness-150 [.light_&]:brightness-100" />
          <p className="text-sm text-muted-foreground">© 2026 · {c.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ tag, title, left }: { tag: string; title: string; left?: boolean }) {
  return (
    <div className={`reveal ${left ? "" : "text-center"}`}>
      <span className="text-sm font-bold uppercase tracking-wider text-brand">{tag}</span>
      <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-5xl">{title}</h2>
    </div>
  );
}

function Phone({ lang }: { lang: Lang }) {
  const a = t[lang].app;
  return (
    <div className="relative animate-float">
      <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-brand opacity-50 blur-3xl" />
      <div className="w-[300px] rounded-[3rem] bg-phone p-3 shadow-glow sm:w-[330px]">
        <div className="relative h-[620px] overflow-hidden rounded-[2.4rem] bg-phone-screen sm:h-[660px]">
          <div className="absolute start-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-phone rtl:translate-x-1/2" />
          <div className="bg-brand px-5 pb-6 pt-12 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div><div className="text-xs opacity-80">{a.hello}</div><div className="mt-1 text-lg font-extrabold">{a.next}</div></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/25"><Bell className="h-5 w-5" /></div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-background/20 p-3">
              <Icons.Pill className="h-5 w-5" /><span className="text-sm font-bold">{a.left}</span>
              <div className="ms-auto h-1.5 w-20 overflow-hidden rounded-full bg-background/30"><div className="h-full w-1/3 rounded-full bg-primary-foreground" /></div>
            </div>
          </div>
          <div className="px-4 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-extrabold text-foreground">{a.sections}</div>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand">{a.all}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {features.slice(0, 7).map((f, i) => {
                const featured = i === 0;
                return featured ? (
                  <div key={f.icon} className="col-span-2 flex items-center gap-2.5 rounded-2xl bg-card p-3 shadow-card">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-magenta text-primary-foreground shadow-glow">
                      <Ico name={f.icon} className="h-5 w-5" strong />
                    </div>
                    <span className="text-[12px] font-extrabold leading-tight text-foreground">{shortLabels[lang][i]}</span>
                  </div>
                ) : (
                  <div key={f.icon} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-2 text-center shadow-card">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${phoneTones[(i - 1) % phoneTones.length]}`}>
                      <Ico name={f.icon} className="h-5 w-5" strong />
                    </div>
                    <span className="text-[10px] font-bold leading-tight text-foreground">{shortLabels[lang][i]}</span>
                  </div>
                );
              })}
              <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-brand/10 p-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-primary-foreground shadow-glow"><Icons.Sparkles className="h-5 w-5" strokeWidth={2.4} /></div>
                <span className="text-[10px] font-bold leading-tight text-foreground">{a.more}</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-around rounded-2xl bg-card py-2 shadow-card">
            {["Home", "MessageCircle", "Camera", "User"].map((n, i) => (
              <div key={n} className={i === 2 ? "flex h-10 w-10 -translate-y-3 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-glow" : "text-muted-foreground"}>
                <Ico name={n} className="h-4.5 w-4.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
