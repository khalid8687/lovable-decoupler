import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Expand, ExternalLink, Heart, Info, Phone, Search, SlidersHorizontal, X } from "lucide-react";

import oltaniLogo from "@/assets/oltani-logo.webp";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  adjustLightness,
  brands,
  colorDistance,
  families,
  hexToRgb,
  paintColors,
  type PaintColor,
} from "@/lib/paint-colors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLTANI Colors — Paint Shade Guide" },
      { name: "description", content: "Explore paint shades with OLTANI Colors. Search by code, preview colors full screen, and compare leading brands available in Egypt." },
      { property: "og:title", content: "OLTANI Colors — Paint Shade Guide" },
      { property: "og:description", content: "Preview any shade full screen, lighten or darken it, and find the closest codes from other brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: ColorAtlas,
});

function ColorAtlas() {
  const [selected, setSelected] = useState<PaintColor>(() =>
    paintColors.find((color) => color.id === "scib-9642") ?? paintColors[0] ??
      { id: "default", brand: "SCIB", code: "9642", name: "Sharp Navy N", family: "Blue", hex: "#3B4F7D" },
  );
  const [brand, setBrand] = useState("All");
  const [family, setFamily] = useState("All");
  const [query, setQuery] = useState("");
  const [lightness, setLightness] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [immersive, setImmersive] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("oltani-colors-favorites") ?? window.localStorage.getItem("lunar-favorites");
    if (stored) setFavorites(JSON.parse(stored) as string[]);
  }, []);

  useEffect(() => {
    const onFullscreen = () => setImmersive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const visibleColors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return paintColors.filter((color) => {
      const matchesBrand = brand === "All" || color.brand === brand;
      const matchesFamily = family === "All" || color.family === family;
      const matchesQuery =
        !normalized ||
        color.code.toLowerCase().includes(normalized) ||
        color.name.toLowerCase().includes(normalized) ||
        color.brand.toLowerCase().includes(normalized);
      return matchesBrand && matchesFamily && matchesQuery;
    });
  }, [brand, family, query]);

  const displayedHex = adjustLightness(selected.hex, lightness);
  const rgb = hexToRgb(displayedHex);
  const matches = useMemo(
    () =>
      paintColors
        .filter((color) => color.brand !== selected.brand)
        .map((color) => ({ color, distance: colorDistance(displayedHex, color.hex) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3),
    [displayedHex, selected.brand],
  );

  function chooseColor(color: PaintColor) {
    setSelected(color);
    setLightness(0);
  }

  function toggleFavorite() {
    const next = favorites.includes(selected.id)
      ? favorites.filter((id) => id !== selected.id)
      : [...favorites, selected.id];
    setFavorites(next);
    window.localStorage.setItem("oltani-colors-favorites", JSON.stringify(next));
  }

  async function openFullscreen() {
    setImmersive(true);
    if (wallRef.current?.requestFullscreen) {
      try {
        await wallRef.current.requestFullscreen();
      } catch {
        setImmersive(true);
      }
    }
  }

  async function closeFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    setImmersive(false);
  }

  return (
    <main className="min-h-screen bg-paper font-sans text-ink antialiased">
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-line bg-paper/95 px-3 backdrop-blur-sm sm:px-4">
        <img src={oltaniLogo} alt="OLTANI" className="h-14 w-auto max-w-20 object-contain sm:max-w-24" />
        <div className="min-w-0">
          <div className="truncate font-display text-xl leading-5 sm:text-2xl">OLTANI Colors</div>
          <div className="mt-1 text-[9px] text-ink-soft">Professional Paint Atlas</div>
        </div>
        <label className="ml-auto hidden h-10 w-80 items-center gap-2 rounded-md border border-line bg-paper-deep px-3 md:flex">
          <Search className="size-4 text-ink-soft" aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by code or name…" className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft" />
        </label>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Call OLTANI">
            <a href="tel:+201002194451"><Phone /></a>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Visit OLTANI website">
            <a href="https://oltani.com" target="_blank" rel="noreferrer"><ExternalLink /></a>
          </Button>
          <span className="hidden rounded-md border border-line px-3 py-2 text-xs lg:inline-flex">{selected.brand}</span>
        </div>
      </header>

      <section className="border-b border-line px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {brands.map((item) => (
            <Button key={item} size="sm" variant={brand === item ? "default" : "outline"} onClick={() => setBrand(item)} className="shrink-0 rounded-full shadow-none">
              {item}
            </Button>
          ))}
          <span className="mx-1 h-6 w-px shrink-0 self-center bg-line" />
          {families.map((item) => (
            <Button key={item} size="sm" variant={family === item ? "secondary" : "ghost"} onClick={() => setFamily(item)} className="shrink-0 rounded-full">
              {item}
            </Button>
          ))}
        </div>
      </section>

      <div className="grid min-h-[calc(100vh-7.5rem)] md:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 md:max-h-[calc(100vh-7.5rem)] md:overflow-y-auto">
          <div ref={wallRef} className={`relative isolate flex min-h-[48vh] flex-col justify-between overflow-hidden p-4 transition-colors duration-300 md:min-h-[62vh] ${immersive ? "fixed inset-0 z-50 min-h-screen" : ""}`} style={{ backgroundColor: displayedHex }}>
            <div className="wall-texture absolute inset-0 -z-10" />
            <div className="flex justify-end gap-2">
              {immersive ? (
                <Button variant="secondary" onClick={closeFullscreen} className="bg-paper/90 shadow-none"><X /> Exit</Button>
              ) : (
                <Button variant="secondary" onClick={openFullscreen} className="bg-paper/90 shadow-none"><Expand /> Full screen</Button>
              )}
              <Button variant="secondary" size="icon" onClick={toggleFavorite} className="bg-paper/90 shadow-none" aria-label="Save color">
                <Heart className={favorites.includes(selected.id) ? "fill-current text-terra" : ""} />
              </Button>
            </div>

            <div className={`flex items-end gap-3 ${immersive ? "mx-auto mb-4 w-full max-w-xl" : ""}`}>
              <div className="max-w-sm rounded-md border border-line/70 bg-paper/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                <p className="font-mono text-[11px] text-ink-soft">{selected.brand} · {selected.code}</p>
                <h1 className="font-display text-3xl leading-tight">{selected.name}</h1>
                <p className="mt-1 text-left font-mono text-[11px] text-ink-soft">{displayedHex} · R{rgb.r} G{rgb.g} B{rgb.b}</p>
              </div>
            </div>

            {immersive && (
              <div className="mx-auto mb-4 w-full max-w-xl rounded-md border border-line/60 bg-paper/90 p-4 backdrop-blur-sm">
                <div className="mb-3 flex justify-between text-xs text-ink-soft"><span>Darker</span><b className="text-ink">{lightness > 0 ? `+${lightness}` : lightness}%</b><span>Lighter</span></div>
                <Slider min={-55} max={55} step={1} value={[lightness]} onValueChange={(value) => setLightness(value[0] ?? 0)} aria-label="Lighten and darken the shade" />
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 className="font-display text-2xl leading-none">Closest Shades</h2><p className="mt-1 text-xs text-ink-soft">Approximate digital matches from other brands</p></div>
              <span className="text-[10px] text-ink-soft">Based on the current color</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {matches.map(({ color, distance }) => (
                <button key={color.id} onClick={() => chooseColor(color)} className="rounded-md border border-line bg-paper-deep p-2 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra">
                  <span className="block h-11 rounded-sm border border-ink/10" style={{ backgroundColor: color.hex }} />
                  <span className="mt-2 block text-sm font-medium">{color.name}</span>
                  <span className="font-mono text-[10px] text-ink-soft">{color.brand} · {color.code} · {Math.max(50, Math.round(100 - distance / 3))}% match</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 border-t border-line pt-3 text-xs leading-5 text-ink-soft"><Info className="mt-0.5 size-4 shrink-0" /><p>On-screen colors and codes here are for approximate preview only. Check the brand's printed catalogue and a real paint sample before buying — surface, lighting and sheen change the result.</p></div>
          </div>
        </section>

        <aside className="flex min-h-[520px] flex-col border-t border-line bg-paper md:max-h-[calc(100vh-7.5rem)] md:border-l md:border-t-0">
          <div className="p-4 pb-3">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="font-display text-2xl leading-none">Sample Tray</h2><p className="mt-1 text-[11px] text-ink-soft">{visibleColors.length} shades available</p></div><SlidersHorizontal className="size-4 text-ink-soft" /></div>
            <label className="flex h-10 items-center gap-2 rounded-md border border-line bg-paper-deep px-3 md:hidden"><Search className="size-4 text-ink-soft" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a color code or name" className="w-full bg-transparent text-sm outline-none" /></label>
          </div>
          <div className="grid flex-1 content-start grid-cols-3 gap-2 overflow-y-auto px-4 pb-4 sm:grid-cols-4 md:grid-cols-3">
            {visibleColors.map((color) => {
              const active = color.id === selected.id;
              return (
                <button key={color.id} onClick={() => chooseColor(color)} aria-label={`${color.brand} ${color.code} ${color.name}`} className={`relative rounded-md p-1 text-left outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-terra ${active ? "bg-terra/10 ring-1 ring-terra" : "hover:bg-paper-deep"}`}>
                  <span className="block h-16 rounded-sm border border-ink/10" style={{ backgroundColor: color.hex }} />
                  {active && <Check className="absolute end-2 top-2 size-4 rounded-full bg-paper p-0.5 text-terra" />}
                  <span className="mt-1 block font-mono text-[9px] text-ink-soft">{color.brand} · {color.code}</span>
                  <span className="block truncate text-[11px]">{color.name}</span>
                </button>
              );
            })}
            {visibleColors.length === 0 && <div className="col-span-full py-16 text-center text-sm text-ink-soft">No matching shade. Try another code or name.</div>}
          </div>
          <div className="sticky bottom-0 border-t border-line bg-paper/95 p-4 backdrop-blur-sm">
            <div className="mb-2 flex justify-between text-xs text-ink-soft"><span>Darker</span><b className="text-ink">{lightness > 0 ? `+${lightness}` : lightness}%</b><span>Lighter</span></div>
            <div className="flex items-center gap-3">
              <Slider min={-55} max={55} step={1} value={[lightness]} onValueChange={(value) => setLightness(value[0] ?? 0)} className="flex-1" aria-label="Lighten and darken the shade" />
              <Button size="sm" onClick={() => setLightness(0)} disabled={lightness === 0} className="shadow-none">Reset</Button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 border-t border-line pt-3 font-mono text-[10px] text-ink-soft">
              <a href="https://oltani.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-terra">oltani.com</a>
              <span aria-hidden="true">•</span>
              <a href="tel:+201002194451" className="transition-colors hover:text-terra">01002194451</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
