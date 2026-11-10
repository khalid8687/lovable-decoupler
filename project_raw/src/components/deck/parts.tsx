import { motion } from "framer-motion";
import type { ReactNode } from "react";
import logoLight from "@/assets/cairocode_logo_light.png";
import logoDark from "@/assets/cairocode_logo_dark.png";

export const fade = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] as const },
});

export function Logo({ className = "h-16", onLight = false }: { className?: string; onLight?: boolean }) {
  return <img src={onLight ? logoDark : logoLight} alt="Cairo Code" className={`${className} w-auto object-contain`} />;
}

export function Light({ kicker, title, children }: { kicker: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className="slide-content bg-surface text-ink">
      <div className="absolute inset-x-0 top-0 h-2 bg-teal" />
      <div className="relative flex h-full flex-col px-[110px] pb-[90px] pt-[80px]">
        <div className="mb-10 flex items-start justify-between gap-10">
          <div>
            <motion.div {...fade(0)} className="s-kicker mb-3 flex items-center gap-3 text-teal">
              <span className="h-1 w-12 rounded-full bg-gold" />
              {kicker}
            </motion.div>
            <motion.h2 {...fade(0.08)} className="s-title text-navy">{title}</motion.h2>
          </div>
          <Logo onLight className="h-20 shrink-0" />
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Dark({ children }: { children: ReactNode }) {
  return (
    <div className="slide-content bg-dark-grad text-primary-foreground">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function Card({ children, className = "", d = 0 }: { children: ReactNode; className?: string; d?: number }) {
  return (
    <motion.div {...fade(d)} className={`rounded-lg border border-border bg-card p-9 shadow-soft ${className}`}>
      {children}
    </motion.div>
  );
}

export function Media({ src, video, poster, className = "", label }: { src?: string; video?: string; poster?: string; className?: string; label?: string }) {
  if (video)
    return (
      <div className={`media relative overflow-hidden rounded-3xl shadow-soft ${className}`}>
        <video src={video} poster={poster} autoPlay muted loop playsInline controls className="h-full w-full object-cover" />
      </div>
    );
  if (src)
    return (
      <div className={`media relative overflow-hidden rounded-3xl shadow-soft ${className}`}>
        <img src={src} alt={label ?? ""} className="h-full w-full object-cover" loading="lazy" />
        {label && <div className="absolute bottom-4 right-4 rounded-full bg-navy/85 px-5 py-2 s-cap text-primary-foreground">{label}</div>}
      </div>
    );
  return <div className={`grid place-items-center rounded-3xl bg-placeholder s-body text-muted-foreground ${className}`}>ضع الصورة هنا</div>;
}
