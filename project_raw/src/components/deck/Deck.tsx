import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, Grid2X2, Maximize, Minimize, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SLIDES } from "./slides";
import { ScaledSlide } from './ScaledSlide';
import logoLight from "@/assets/cairocode_logo_light.png";

const chapters = [...new Set(SLIDES.map(s => s.chapter))];

export function Deck() {
  const search = useSearch({ from: '/' });
  const navigate = useNavigate({ from: '/' });
  const index = Math.min(search.slide - 1, SLIDES.length - 1);
  const current = SLIDES[index];
  const [overview, setOverview] = useState(false);
  const [reading, setReading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [z, setZ] = useState(0.5);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (n: number) => {
    void navigate({ search: { slide: Math.max(1, Math.min(n + 1, SLIDES.length)), print: false }, replace: true });
  };
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const f = () => { setMobile(mq.matches); setZ(window.innerWidth / 900); };
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  useEffect(() => {
    if (current) document.title = `${index + 1}/${SLIDES.length} — ${current.title} | الغربية`;
  }, [index, current]);
  useEffect(() => {
    document.querySelector('.deck-stage')?.scrollTo({ top: 0, left: 0 });
  }, [index, overview, reading]);
  useEffect(() => {
    const changed = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); go(index - 1); }
      if (e.key === 'Escape') { setOverview(false); setReading(false); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
  useEffect(() => {
    if (!search.print) return;
    let cancelled = false;
    void document.fonts.ready.then(() => { if (!cancelled) window.print(); });
    return () => { cancelled = true; };
  }, [search.print]);
  const toggleFullscreen = async () => {
    setReading(false); setOverview(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setFullscreen(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  };
  if (!current) return null;
  const C = current.C;
  return (
    <>
      <div className={`deck-shell no-print ${fullscreen ? 'is-presenting' : ''}`}>
        <header className="deck-header border-b border-primary-foreground/15 bg-navy-deep text-primary-foreground">
          <div className="flex min-w-0 items-center gap-4"><img src={logoLight} alt="Cairo Code" className="h-9 w-auto"/><div className="hidden sm:block"><div className="font-bold">منظومة الغربية • خطة التنفيذ</div><div className="text-xs text-primary-foreground/60">العمل الأسبوعي والتسليم • ديسمبر 2026</div></div></div>
          <div className="deck-tools flex gap-1">
            <Button variant="ghost" size="icon" title="فهرس العرض" aria-label="فهرس العرض" aria-pressed={overview} onClick={() => { setOverview(!overview); setReading(false); }}><Grid2X2/></Button>
            <Button variant="ghost" size="icon" title="قراءة العرض كاملًا" aria-label="قراءة العرض كاملًا" aria-pressed={reading} onClick={() => { setReading(!reading); setOverview(false); }}><BookOpen/></Button>
            <Button variant="ghost" size="icon" title="نسخ رابط الشريحة" aria-label="نسخ رابط الشريحة" onClick={copy}>{copied ? <Check/> : <Copy/>}</Button>
            <Button variant="ghost" size="icon" title="طباعة العرض" aria-label="طباعة العرض" onClick={() => window.open('/?slide=1&print=true', '_blank', 'noopener')}><Printer/></Button>
            <Button variant="ghost" size="icon" title={fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'} aria-label={fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'} onClick={toggleFullscreen}>{fullscreen ? <Minimize/> : <Maximize/>}</Button>
          </div>
        </header>
        {overview ? <main className="deck-overview bg-surface p-5 md:p-10"><div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold text-navy">فهرس العرض</h1><Button variant="ghost" size="icon" aria-label="إغلاق الفهرس" onClick={()=>setOverview(false)}><X/></Button></div>{chapters.map(chapter=><section key={chapter} className="mb-10"><h2 className="mb-4 text-lg font-bold text-teal">{chapter}</h2><div className="overview-grid">{SLIDES.map((s,n)=>s.chapter===chapter&&<Button key={s.id} variant="ghost" className={`overview-item ${n===index?'is-active':''}`} aria-label={`الشريحة ${n+1}: ${s.title}`} onClick={()=>{go(n);setOverview(false);}}><div className="overview-preview" aria-hidden="true"><ScaledSlide><s.C/></ScaledSlide></div><div className="flex w-full items-start gap-3 whitespace-normal text-right"><span className="num text-teal">{n+1}</span><span>{s.title}</span></div></Button>)}</div></section>)}</main>
        : reading ? <main className={`deck-reading ${mobile ? 'm' : ''}`}>{SLIDES.map((s,n)=><section key={s.id} aria-label={s.title} style={mobile?{zoom:z}:undefined}>{mobile?<s.C/>:<div className="reading-frame"><ScaledSlide><s.C/></ScaledSlide></div>}<Button variant="secondary" className="reading-open" onClick={()=>{go(n);setReading(false);}}>عرض الشريحة {n+1}<ArrowLeft/></Button></section>)}</main>
        : <main className={`deck-stage ${mobile&&!fullscreen?'mobile-stage':''}`} aria-label={current.title}
          onTouchStart={e=>{const t=e.changedTouches[0];if(t)touch.current={x:t.clientX,y:t.clientY};}}
          onTouchEnd={e=>{const t=e.changedTouches[0];const start=touch.current;touch.current=null;if(!t||!start)return;const dx=t.clientX-start.x;const dy=t.clientY-start.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(index+(dx<0?1:-1));}}>
          {mobile&&!fullscreen?<div className="m"><div style={{zoom:z}}><C/></div></div>:<ScaledSlide><C/></ScaledSlide>}
        </main>}
        <footer className="deck-footer bg-navy-deep text-primary-foreground">
          <div className="deck-progress" style={{width:`${((index+1)/SLIDES.length)*100}%`}}/>
          <div className="flex min-w-0 items-center gap-3"><span className="num shrink-0 text-sm text-gold">{index+1} / {SLIDES.length}</span><span className="truncate text-sm">{current.title}</span></div>
          <div className="flex shrink-0 items-center gap-2"><Button variant="ghost" size="icon" title="الشريحة السابقة" aria-label="الشريحة السابقة" disabled={index===0} onClick={()=>go(index-1)}><ArrowRight/></Button><Button variant="ghost" size="icon" title="الشريحة التالية" aria-label="الشريحة التالية" disabled={index===SLIDES.length-1} onClick={()=>go(index+1)}><ArrowLeft/></Button></div>
        </footer>
      </div>
      {search.print&&<div className="print-deck">{SLIDES.map(s=><div key={s.id} className="print-page"><ScaledSlide><s.C/></ScaledSlide></div>)}</div>}
    </>
  );
}
